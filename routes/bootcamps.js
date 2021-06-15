const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcampPhoto,
} = require("../controllers/bootcamps");
const advancedResults = require("../middlewares/advancedResult");
const Bootcamp = require("../models/Bootcamp");

// include other resource router
const courseRouter = require("./courses");

// include protected middleware
const {
  protect,
  authorize,
} = require("../middlewares/auth");

const router = express.Router();

// Re-route into other resources router
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(
    protect,
    authorize("publisher", "admin"),
    createBootcamp
  );

router
  .route("/:bootcampId/photo")
  .put(
    protect,
    authorize("publisher", "admin"),
    uploadBootcampPhoto
  );

router
  .route("/:id")
  .get(getBootcamp)
  .put(
    protect,
    authorize("publisher", "admin"),
    updateBootcamp
  )
  .delete(
    protect,
    authorize("publisher", "admin"),
    deleteBootcamp
  );

module.exports = router;
