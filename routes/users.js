const express = require("express");
const advancedResults = require("../middlewares/advancedResult");
const User = require("../models/User");
const {
  getUsers,
  getUser,
} = require("../controllers/users");
const {
  protect,
  authorize,
} = require("../middlewares/auth");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/", advancedResults(User), getUsers);

router.route("/:id").get(getUser);

module.exports = router;
