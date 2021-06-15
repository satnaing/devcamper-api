const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //   else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  if (!token) {
    return next(
      new ErrorResponse(
        "Not authorized to access this route",
        401
      )
    );
  }

  // Verify token
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    console.error(err);
    return next(
      new ErrorResponse(
        "Not authorized to access this route",
        401
      )
    );
  }
});

// Grant access to specific roles
exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
