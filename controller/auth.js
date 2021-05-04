const User = require("../model/userSchema");
const passwordHash = require("../helper/passwordHash");
const emails = require("../helper/emails");

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
