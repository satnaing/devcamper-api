const mongoose = require("mongoose");
const slugify = require("slugify");

const bootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [
        50,
        "Name cannot be more than 50 characters",
      ],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [
        500,
        "Description cannot be more than 500 characters",
      ],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please provide a valid url",
      ],
    },
    phone: {
      type: String,
      maxlength: [
        20,
        "Phone number cannot be longer than 20 numbers",
      ],
    },
    email: {
      type: String,
      // match: [
      //   /^w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //   "Please provide a valid url",
      // ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        enum: ["Point"],
        //   required: true,
      },
      coordinates: {
        type: [Number],
        //   required: true,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating cannot be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: "Boolean",
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mongoose Middleware | name to slug
bootcampSchema.pre("save", async function () {
  this.slug = await slugify(this.name, { lower: true });
});

// Cascade Delete
bootcampSchema.pre("remove", async function () {
  await this.model("Course").deleteMany({
    bootcamp: this._id,
  });
});

// Reverse populate with virtuals
bootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

const Bootcamp = mongoose.model("Bootcamp", bootcampSchema);

module.exports = Bootcamp;
