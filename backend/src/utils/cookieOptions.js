// const baseCookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "strict",
//   path: "/", // IMPORTANT
// };

// module.exports = baseCookieOptions;


const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Cross-site cookies (Vercel frontend + Render backend) need SameSite=None
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/", // IMPORTANT
};

module.exports = baseCookieOptions;
