const User = require("./auth.model");
const AppError = require("../../utils/AppError");
const asyncHandler = require("../../utils/asyncHandler");
const cookieOptions = require("../../utils/cookieOptions");

const {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} = require("./auth.service");

const {
  registerSchema,
  loginSchema,
} = require("./auth.validation");

/**
 * Register
 */
const register = asyncHandler(async (req, res) => {
  const { email, password } = registerSchema.parse(req.body);

  if (await User.findOne({ email })) {
    throw new AppError("User already exists", 409);
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();

  user.auth.refreshTokenHash = hashRefreshToken(refreshToken);
  user.auth.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();

  res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json({ status: "success", message: "User registered successfully" });
});

/**
 * Login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();

  user.auth.refreshTokenHash = hashRefreshToken(refreshToken);
  user.auth.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();

  res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ status: "success", message: "Login successful" });
});

/**
 * Refresh token
 */
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const user = await User.findOne({
    "auth.refreshTokenHash": refreshTokenHash,
    "auth.refreshTokenExpiry": { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken();

  user.auth.refreshTokenHash = hashRefreshToken(newRefreshToken);
  user.auth.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await user.save();

  res
    .cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ status: "success", message: "Token refreshed" });
});

/**
 * Logout
 */
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await User.updateOne(
      { "auth.refreshTokenHash": hashRefreshToken(refreshToken) },
      {
        $set: {
          "auth.refreshTokenHash": null,
          "auth.refreshTokenExpiry": null,
        },
      }
    );
  }

res
  .clearCookie("accessToken", { ...cookieOptions, maxAge: 0 })
  .clearCookie("refreshToken", { ...cookieOptions, maxAge: 0 })
  .json({ status: "success", message: "Logged out successfully" });
});

module.exports = { register, login, refresh, logout };
