const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router
  .get("/me", protect, getMe)
  .post("/register", register)
  .post("/login", login)
  .get("/logout", protect, logout)
  .post("/forgotpassword", forgotPassword)
  .put("/resetpassword/:resetToken", resetPassword)
  .put("/updatedetails", protect, updateDetails)
  .put("/updatepassword", protect, updatePassword);

module.exports = router;
