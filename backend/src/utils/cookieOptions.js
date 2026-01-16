const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/", // IMPORTANT
};

module.exports = baseCookieOptions;
