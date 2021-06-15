const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const advancedResults = require("../middlewares/advancedResult");
const Course = require("../models/Course");

// include protected middleware
const {
  protect,
  authorize,
} = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(
    protect,
    authorize("publisher", "admin"),
    createCourse
  );

router
  .route("/:id")
  .get(getCourse)
  .put(
    protect,
    authorize("publisher", "admin"),
    updateCourse
  )
  .delete(
    protect,
    authorize("publisher", "admin"),
    deleteCourse
  );

module.exports = router;
