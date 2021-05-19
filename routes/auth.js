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
const Location = require("../model/locationSchema");

const {
  register,
  login,
  verifyUser,
  sendCode,
  verifyCode,
  forgotPassword,
  resetPassword,
  addLocation,
  getLocation,
} = require("../controller/auth");

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
});

router.post("/register", register);

router.post("/login", login);

router.post("/verify-user", verifyUser);

router.post("/send-code", sendCode);

router.post("/verify-code", verifyCode);

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

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/add-location", addLocation);

router.get("/get-location", getLocation);

module.exports = router;
