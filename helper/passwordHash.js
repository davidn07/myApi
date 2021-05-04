const bcrypt = require("bcryptjs");

exports.passwordHash = async (password) => {
  return await bcrypt.hash(password, 10);
};
