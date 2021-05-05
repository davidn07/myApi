const User = require("../model/userSchema");
const { passwordHash } = require("../helper/passwordHash");
const { registerEmail, forgotPasswordEmail } = require("../helper/emails");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    password,
    gender,
  } = req.body;

  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.json({ error: "Please fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await passwordHash(password);

    const user = new User({
      first_name,
      last_name,
      email,
      phone_number,
      password: hashedPassword,
      gender,
    });

    await user.save();
    const emailSent = await registerEmail(email);

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Please fill the data" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "password does not match" });
    }

    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
      expiresIn: "3d",
    });

    res
      .status(201)
      .json({ token, message: "User LogIn Successful", user: user });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { email } = req.body;
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const isEmail = emailRegexp.test(email);

    if (!isEmail) {
      res.status(400).json({ error: "Invalid Email" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({ error: "Email already registered" });
    }

    res.status(201).json({ message: "This is email is available" });
  } catch (err) {
    console.log(err);
  }
};

exports.sendCode = async (req, res) => {
  const { phone_number } = req.body;
  try {
    const status = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: `+${phone_number}`, channel: "sms" });

    if (status) {
      res
        .status(201)
        .json({ message: "OTP sent to the mobile number successfully!" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.verifyCode = async (req, res) => {
  const { phone_number, code } = req.body;
  try {
    const status = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: `+${phone_number}`, code });

    if (status.status === "approved") {
      res.status(201).json({ message: "Verification successfull" });
    } else {
      res.status(400).json({ error: "Incorrect OTP!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ error: "User does not exist" });
    }

    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const emailSent = await forgotPasswordEmail(user, token);
    res.status(201).json({
      message:
        "An email with reset password link is sent to your registered email",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    const valid = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ error: "User does not exist" });
    }

    const hashedPassword = await passwordHash(password);

    await User.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    res.status(201).json({ message: "Password Updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};
