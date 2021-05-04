const Request = require("../model/requestSchema");
const User = require("../model/userSchema");

exports.addRequest = async (req, res) => {
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

    const prayerRequest = await request.save();

    res
      .status(201)
      .json({ message: "Prayer request added successfully", prayerRequest });
  } catch (err) {
    console.log(err);
  }
};

exports.getRequests = async (req, res) => {
  try {
    const prayerRequests = await Request.find({ user_id: req.user.user._id });
    if (prayerRequests.length < 1) {
      return res.status(400).json({ message: "No prayer requests found" });
    }

    res.status(201).json({ prayerRequests });
  } catch (err) {
    console.log(err);
  }
};

exports.getRequest = async (req, res) => {
  try {
    const { id } = req.body;
    const prayerRequest = await Request.findOne({ _id: id });

    res.status(201).json({ prayerRequest });
  } catch (err) {
    console.log(err);
  }
};

exports.updateRequest = async (req, res) => {
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
};

exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.body;
    const itemDeleted = await Request.deleteOne({ _id: id });
    if (itemDeleted) {
      res.status(201).json({ message: "Prayer Request Deleted Successfully" });
    }
  } catch (error) {}
};
