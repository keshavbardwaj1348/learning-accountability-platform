const User = require("../auth/auth.model");
const asyncHandler = require("../../utils/asyncHandler");

const getStreak = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("streak");

  res.json({
    status: "success",
    data: user.streak,
  });
});

module.exports = { getStreak };
