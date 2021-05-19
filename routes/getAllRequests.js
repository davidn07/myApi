const { json } = require("express");
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

router.post("/get-user-request", async (req, res) => {
  try {
    const { phone_number } = req.body;
    const requests = await Request.find({ phone_number: phone_number });

    res
      .status(201)
      .json({ message: "Prayer request sent successfully", requests });
  } catch (err) {
    console.log(err);
  }
});

router.post("/add-mobile-request", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      prayer_request,
      city,
      state,
      created_at,
      phone_number,
    } = req.body;
    const request = new Request({
      first_name,
      last_name,
      prayer_request,
      city,
      state,
      created_at,
      phone_number,
    });

    const prayerRequest = await request.save();

    res
      .status(201)
      .json({ message: "Prayer request added successfully", prayerRequest });
  } catch (err) {
    console.log(err);
  }
});

router.put("/edit-request", async (req, res) => {
  try {
    const { id, userRequest } = req.body;
    const prayerRequest = await Request.updateOne(
      { _id: id },
      {
        $set: {
          prayer_request: userRequest,
        },
      }
    );
    res.status(201).json({ message: "Prayer request updated !" });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/delete-request", async (req, res) => {
  try {
    const { id } = req.body;
    const prayerRequest = await Request.findByIdAndDelete(id);
    res.status(201).json({ message: "Prayer request deleted !" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
