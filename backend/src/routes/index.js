const express = require("express");
const authRoutes = require("./authRoutes");
const trackRoutes = require("./trackRoutes");
const analyticsRoutes = require("./analyticsRoutes");

const router = express.Router();

router.use(authRoutes);
router.use(trackRoutes);
router.use(analyticsRoutes);

module.exports = router;
