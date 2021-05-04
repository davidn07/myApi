const User = require("../model/userSchema");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.user._id });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(201).json({ user: user });
  } catch (err) {
    console.log(err);
  }
};
