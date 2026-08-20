const { body, validationResult, matchedData } = require("express-validator");
const db = require("../lib/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("dotenv").config();

const formValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid Email adress")
    .custom(async (value) => {
      const data = await db.getUserByEmail(value);
      if (data) {
        throw new Error("Email is already in use");
      }
    })
    .withMessage("Email is already in use"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "Password must be at least 8 characters long, have 1 uppercase and include at least 1 number",
    ),
  body("confirm")
    .notEmpty()
    .withMessage("Password doesn't match")
    .custom((confirm, { req }) => {
      if (confirm !== req.body.password) {
        throw new Error("Password doesn't match");
      }
    })
    .withMessage("Password doesn't match"),
];

exports.createUser = [
  formValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({
        errors: errors.array(),
        email: req.body.email,
        name: req.body.name,
      });
    }
    const data = matchedData(req);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await db.createUser(data.email, data.name, hashedPassword);
    return res.status(201).json(user);
  },
];
