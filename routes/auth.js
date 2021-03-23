const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const router = express.Router();

dotenv.config();

require("../db/conn");
const User = require("../model/userSchema");
const Request = require("../model/requestSchema");

router.get("/", (req, res) => {
  res.send("Hello world from router js");
});

//middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) res.status(401).json({ rror: "Not authorised" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    req.user = user;

    next();
  });
};

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, phone_number, password } = req.body;

  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      first_name,
      last_name,
      email,
      phone_number,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(422).json({ error: "Please fill the data" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({ error: "User does not exist" });
    }
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(404).json({ error: "password does not match" });
    }

    const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
  }
});

router.post("/requests", authenticateToken, async (req, res) => {
  const { prayer_request, message } = req.body;

  if (!prayer_request || !message) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    const request = new Request({
      prayer_request,
      message,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      phone_number: req.user.phone_number,
      user_id: req.user._id,
    });

    const prayerRequest = await request.save();

    res
      .status(201)
      .json({ message: "Prayer request added successfully", prayerRequest });
  } catch (err) {
    console.log(err);
  }
});

router.get("/requests", authenticateToken, async (req, res) => {
  try {
    const prayerRequests = await Request.find({ user_id: req.user._id });
    if (prayerRequests.length < 1)
      res.status(401).json({ message: "No prayer requests found" });

    res.status(201).json({ prayerRequests });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
