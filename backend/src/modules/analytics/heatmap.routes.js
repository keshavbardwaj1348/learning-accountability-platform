const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const { getHeatmap } = require("./heatmap.controller");

const router = express.Router();

router.get("/heatmap", protect, getHeatmap);

module.exports = router;
