const express = require("express");
const router = express.Router();

const { getUser } = require("../controller/user");
const { authenticateToken } = require("../middleware/authenticateToken");

router.use(authenticateToken);

router.get("/get-user", authenticateToken, getUser);

module.exports = router;
