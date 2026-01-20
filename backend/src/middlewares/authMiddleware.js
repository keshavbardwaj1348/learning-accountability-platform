// const jwt = require("jsonwebtoken");
// const AppError = require("../utils/AppError");

// const protect = (req, res, next) => {
//   const token = req.cookies?.accessToken;

//   if (!token) {
//     return next(new AppError("Not authenticated", 401));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     return next(new AppError("Invalid or expired token", 401));
//   }
// };

// module.exports = protect;


const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Not authenticated", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

module.exports = protect;
