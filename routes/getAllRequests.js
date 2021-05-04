const express = require("express");
const router = express.Router();

const Request = require("../model/requestSchema");

router.get("/all-requests", async (req, res) => {
  try {
    const prayerRequests = await Request.find();
    if (prayerRequests.length === 0) {
      return res.status(400).json({ error: "No prayer requests found" });
    }

    res.status(201).json(prayerRequests);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
