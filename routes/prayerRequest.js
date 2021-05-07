const express = require("express");
const router = express.Router();

const {
  addRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  likeRequest,
} = require("../controller/request");

const { authenticateToken } = require("../middleware/authenticateToken");

router.use(authenticateToken);

router.post("/requests", authenticateToken, addRequest);

router.get("/requests", authenticateToken, getRequests);

router.post("/request", authenticateToken, getRequest);

router.post("/update-request", authenticateToken, updateRequest);

router.post("/delete-request", authenticateToken, deleteRequest);

router.post("/like", authenticateToken, likeRequest);

module.exports = router;
