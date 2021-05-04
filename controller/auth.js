const User = require("../model/userSchema");
const passwordHash = require("../helper/passwordHash");
const emails = require("../helper/emails");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    const hashedPassword = await passwordHash.passwordHash(password);
    console.log(hashedPassword);

    const user = new User({
      first_name,
      last_name,
      email,
      phone_number,
      password: hashedPassword,
      gender,
    });

    await user.save();
    const emailSent = await emails.registerEmail(email);
    console.log(emailSent, "controller");

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
