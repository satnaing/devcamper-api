const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/asyncHandler");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(
  async (req, res, next) => {
    // Responding status code and data
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  }
);

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(
  async (req, res, next) => {
    req.body.user = req.user.id;

    const publishedBootcamp = await Bootcamp.findOne({
      user: req.user.id,
    });

    if (publishedBootcamp && req.user.role !== "admin") {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.id} has already published a bootcamp`,
          400
        )
      );
    }

    const bootcamp = await Bootcamp.create(req.body);
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  }
);

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(
  async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with id of ${req.params.id}`,
          404
        )
      );
    }

    if (
      bootcamp.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ID ${req.user.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  }
);

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with id of ${req.params.id}`,
          404
        )
      );
    }

    if (
      bootcamp.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ID ${req.user.id} is not authorized to delete this bootcamp`,
          401
        )
      );
    }

    bootcamp.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);

// @desc    Upload bootcamp photo
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.uploadBootcampPhoto = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(
      req.params.bootcampId
    );

    // Check if bootcamp exists
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `Bootcamp not found with id of ${req.params.id}`,
          404
        )
      );
    }

    if (
      bootcamp.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ID ${req.user.id} is not authorized to update this bootcamp`,
          401
        )
      );
    }

    // Check if file is uploaded
    if (!req.files) {
      return next(
        new ErrorResponse(`Please upload a file`, 400)
      );
    }

    const file = req.files.file;

    // Check if file is image
    if (!file.mimetype.startsWith("image")) {
      return next(
        new ErrorResponse(
          `Please upload an image file`,
          400
        )
      );
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }

    // Check custom file name
    file.name = `photo_${req.params.bootcampId}${
      path.parse(file.name).ext
    }`;

    file.mv(
      `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
      async (err) => {
        if (err) {
          console.error(err);
          return next(
            new ErrorResponse(
              `Problem with file upload`,
              500
            )
          );
        }

        await Bootcamp.findByIdAndUpdate(
          req.params.bootcampId,
          { photo: file.name }
        );

        res.status(200).json({
          success: true,
          data: file.name,
        });
      }
    );
  }
);
