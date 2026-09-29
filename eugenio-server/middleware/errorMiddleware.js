const { HttpStatus } = require("../config/constants");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "Image must not exceed 5 MB.",
      error: null,
    });
  }

  if (
    err.name === "MulterError" ||
    err.message === "Only image files are allowed."
  ) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: err.message,
      error: null,
    });
  }

  res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Server Error",
    error: null,
  });
};

module.exports = errorHandler;
