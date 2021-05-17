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

router.post("/add-mobile-request", async (req, res) => {
  try {
    const { first_name, last_name, prayer_request, city, state, created_at } =
      req.body;
    console.log(req.body);
    const request = new Request({
      first_name,
      last_name,
      prayer_request,
      city,
      state,
      created_at,
    });

    const prayerRequest = await request.save();

    res
      .status(201)
      .json({ message: "Prayer request added successfully", prayerRequest });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
