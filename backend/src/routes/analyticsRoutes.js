const express = require("express");
const { analytics } = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/analytics", authMiddleware, analytics);

module.exports = router;
