const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT);

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
  if (!token) res.status(401).json({ error: "Not authorised" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    req.user = user;

    next();
  });
};

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, phone_number, password } = req.body;

  if (!first_name || !last_name || !email || !phone_number || !password) {
    return res.json({ error: "Please fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
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

    const token = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET);

    res
      .status(201)
      .json({ token, message: "User LogIn Successful", user: user });
  } catch (error) {
    console.log(error);
  }
});

router.post("/requests", authenticateToken, async (req, res) => {
  const { prayer_request } = req.body;

  if (!prayer_request) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  try {
    const request = new Request({
      prayer_request,
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

router.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      res.status(400).json({ error: "User not found" });
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
    const prayerRequests = await Request.find({ user_id: req.user._id });
    if (prayerRequests.length < 1)
      res.status(400).json({ message: "No prayer requests found" });

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
      .verifications.create({ to: `+91${phone_number}`, channel: "sms" });

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
      .verificationChecks.create({ to: `+91${phone_number}`, code });

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

router.get("/all-requests", async (req, res) => {
  try {
    const prayerRequests = await Request.find();
    if (prayerRequests.length === 0) {
      res.status(400).json({ error: "No prayer requests found" });
    }

    res.status(201).json(prayerRequests);
  } catch (err) {
    console.log(err);
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
      res.status(400).json({ error: "User does not exist" });
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

module.exports = router;
