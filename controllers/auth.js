const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");
const sendEmail = require("../utils/sendEmail");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, role, password } = req.body;

  const user = await User.create({
    name,
    email,
    role,
    password,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse(
        `Please provide an email and password`,
        400
      )
    );
  }

  const user = await User.findOne({ email }).select(
    "+password"
  );

  if (!user) {
    return next(
      new ErrorResponse(`Incorrect Credentials`, 401)
    );
  }

  const correctPwd = user.checkPassword(password);

  if (!correctPwd) {
    return next(
      new ErrorResponse(`Incorrect Credentials`, 401)
    );
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / Clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  const options = {
    expires: new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production")
    options.secure = true;

  res.clearCookie("token", options);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(
  async (req, res, next) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// @desc    Update user password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(
  async (req, res, next) => {
    const user = await User.findById(req.user.id).select(
      "+password"
    );

    const correctPassword = user.checkPassword(
      req.body.currentpassword
    );

    if (!correctPassword) {
      return next(
        new ErrorResponse(`Incorrect Password`, 401)
      );
    }

    user.password = req.body.password;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(
  async (req, res, next) => {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return next(
        new ErrorResponse(`No user with this email`, 404)
      );
    }

    // Get reset token
    const resetToken = user.generateResetPwdToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you 
    (or someone else) has requested the reset of a password. 
    Please make a PUT request to: \n\n ${resetURL}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });

      res.status(200).json({
        success: true,
        data: "Email sent",
      });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(
        new ErrorResponse("Email could not be sent", 500)
      );
    }
  }
);

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resetToken
// @access  Private
exports.resetPassword = asyncHandler(
  async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse(`Invalid token`, 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    console.log("pwd is saved");
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJWT();

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production")
    options.secure = true;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
