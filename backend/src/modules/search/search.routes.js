const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/authMiddleware");
const { searchGlobal } = require("./search.controller");

// GET /search?q=react
router.get("/", authMiddleware, searchGlobal);

module.exports = router;
