const express = require("express");
const { track } = require("../controllers/trackController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/track", authMiddleware, track);

module.exports = router;
