const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const schedule = require("node-schedule");
const _ = require("lodash");
const router = express.Router();

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT);
const gmailClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
gmailClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

require("../db/conn");
const User = require("../model/userSchema");
const Request = require("../model/requestSchema");
const auth = require("../controller/auth");

router.get("/", (req, res) => {
  res.send("Hello world from router js");
});

//Email Schedule
schedule.scheduleJob("* 0 7 * * *", async () => {
  // const users = await User.find();
  // console.log(_.map(users, "email"), "users");

  // const accessToken = await gmailClient.getAccessToken();
  // const transporter = nodemailer.createTransport({
  //   service: "Gmail",
  //   auth: {
  //     type: "OAuth2",
  //     user: "nirmaldavid96@gmail.com",
  //     clientId: process.env.GOOGLE_CLIENT,
  //     clientSecret: process.env.CLIENT_SECRET,
  //     refreshToken: process.env.REFRESH_TOKEN,
  //     accessToken: accessToken,
  //   },
  // });

  // const mailOptions = {
  //   from: "PRAYERREQUESTAPP 📧 <nirmaldavid96@gmail.com>",
  //   to: "nirmaldavid96@gmail.com",
  //   subject: "Welcome to Prayer Request App",
  //   text: "Welcome to Prayer Request App",
  //   html: `<h4>Welcome to Prayer Request App</h4><br>
  //   <p>Praise the Lord,<br>You have successfully registered to the Prayer Request App. Go ahead and login to your account.<br> Post your prayer requests and Prayer for others</p><br>
  //   <h4>Happy Praying</h4>`,
  // };

  // await transporter.sendMail(mailOptions);

  console.log("Sent");
});

//middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log(user, "token");
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.post("/register", auth.register);

router.post("/login", auth.login);

router.post("/requests", authenticateToken, async (req, res) => {
  try {
    const { prayer_request, created_at } = req.body;

    if (!prayer_request) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    const user = await User.findOne({ _id: req.user.user._id });

    const request = new Request({
      prayer_request,
      created_at,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      user_id: user._id,
      gender: user.gender,
    });

    console.log(request, "Prayer Request");

    const prayerRequest = await request.save();

    res
      .status(201)
      .json({ message: "Prayer request added successfully", prayerRequest });
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.user._id });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(201).json({ user: user });
  } catch (err) {
    console.log(err);
  }
});

router.post("/verify-user", async (req, res) => {
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
});

router.get("/requests", authenticateToken, async (req, res) => {
  try {
    const prayerRequests = await Request.find({ user_id: req.user.user._id });
    if (prayerRequests.length < 1) {
      return res.status(400).json({ message: "No prayer requests found" });
    }

    res.status(201).json({ prayerRequests });
  } catch (err) {
    console.log(err);
  }
});

router.post("/request", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    const prayerRequest = await Request.findOne({ _id: id });

    res.status(201).json({ prayerRequest });
  } catch (err) {
    console.log(err);
  }
});

router.post("/update-request", authenticateToken, async (req, res) => {
  try {
    const { prayer_request, id } = req.body;
    const updatedRequest = await Request.updateOne(
      { _id: id },
      { $set: { prayer_request: prayer_request } }
    );
    res.status(201).json({ message: "Prayer Request Updated Successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/send-code", async (req, res) => {
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
});

router.post("/verify-code", async (req, res) => {
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
});

router.post("/delete-request", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body;
    const itemDeleted = await Request.deleteOne({ _id: id });
    if (itemDeleted) {
      res.status(201).json({ message: "Prayer Request Deleted Successfully" });
    }
  } catch (error) {}
});

router.post("/google-register", async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT,
    });
    const { given_name, family_name, email } = result.payload;

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(email, 10);

    const user = new User({
      first_name: given_name,
      last_name: family_name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = await gmailClient.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "nirmaldavid96@gmail.com",
        clientId: process.env.GOOGLE_CLIENT,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "PRAYERREQUESTAPP 📧 <nirmaldavid96@gmail.com>",
      to: email,
      subject: "Welcome to Prayer Request App",
      text: "Welcome to Prayer Request App",
      html: `<h4>Welcome to Prayer Request App</h4><br>
      <p>Praise the Lord,<br>You have successfully registered to the Prayer Request App. Go ahead and login to your account.<br> Post your prayer requests and Prayer for others</p><br>
      <h4>Happy Praying</h4>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT,
    });
    const { email } = result.payload;

    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(400)
        .json({ error: "Don't have a account ! Go ahead and Sign Up !" });
    }

    await User.updateOne(
      { email: email },
      {
        $set: { profile_img: result.payload.picture },
      }
    );

    const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

    res
      .status(201)
      .json({ token, message: "User LogIn Successful", user: user });
  } catch (error) {
    console.log(error);
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ error: "User does not exist" });
    }

    const token = jwt.sign({ user }, process.env.TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const accessToken = await gmailClient.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "nirmaldavid96@gmail.com",
        clientId: process.env.GOOGLE_CLIENT,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const link = `http://prayer-request-app.vercel.app/reset-password/?email=${user.email}&token=${token}`;

    const mailOptions = {
      from: "PRAYERREQUESTAPP 📧 <nirmaldavid96@gmail.com>",
      to: email,
      subject: "Forgot Password Link",
      text: link,
      html: `<h6>Please click on the the following button to reset password</h6><br>
      <a href=${link}><button>Reset Password</button></a>`,
    };

    const mailSent = await transporter.sendMail(mailOptions);
    res.status(201).json({
      message:
        "An email with reset password link is sent to your registered email",
      token,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, password } = req.body;

    const valid = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ error: "User does not exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    res.status(201).json({ message: "Password Updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
