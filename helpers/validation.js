const { check } = require("express-validator");

exports.registerValidator = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("mobile", "Mobile No. should be contains 9 digits").isLength({
    min: 9,
    max: 12,
  }),
  check(
    "password",
    "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
  ).isStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  check("image")
    .custom((value, { req }) => {
      if (
        req.file.mimetype === "image/jpg" ||
        req.file.mimetype === "image/png" ||
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/svg"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Please upload an image jpg, png, jpeg or svg."),
];

exports.sendMailVerificationValidator = [
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
];
