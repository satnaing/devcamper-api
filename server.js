const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// load router
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");

// Load env variables
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

process.env.NODE_ENV === "development" &&
  app.use(morgan("dev"));

app.use(fileUpload());

// Sanitize input data
app.use(mongoSanitize());

// Set extra headers for security
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Allow CORS
app.use(cors());

// Mount route
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`);
  server.close(() => process.exit(1));
});
