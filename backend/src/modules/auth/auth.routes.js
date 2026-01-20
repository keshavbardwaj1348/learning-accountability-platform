const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
} = require("./auth.controller");

const router = express.Router();
const protect = require("../../middlewares/authMiddleware");


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, (req, res) => {
  res.json({ status: "success", data: { userId: req.userId } });
});


module.exports = router;
