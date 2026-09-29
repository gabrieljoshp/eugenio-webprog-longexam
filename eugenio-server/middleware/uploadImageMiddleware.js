const multer = require("multer");
const { HttpStatus } = require("../config/constants");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

const validateImageContent = (req, res, next) => {
  if (!req.file) return next();

  const { buffer } = req.file;
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer
    .subarray(0, 8)
    .equals(Buffer.from("89504e470d0a1a0a", "hex"));
  const isWebp =
    buffer.subarray(0, 4).toString() === "RIFF" &&
    buffer.subarray(8, 12).toString() === "WEBP";

  if (isJpeg || isPng || isWebp) return next();

  return res.status(HttpStatus.BAD_REQUEST).json({
    success: false,
    message: "The uploaded file is not a valid JPEG, PNG, or WebP image.",
    error: null,
  });
};

module.exports = upload;
module.exports.validateImageContent = validateImageContent;
