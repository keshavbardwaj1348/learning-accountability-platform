const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const { getOverview } = require("./overview.controller");

const router = express.Router();

router.get("/overview", protect, getOverview);

module.exports = router;
