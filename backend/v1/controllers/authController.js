const { body, validationResult, matchedData } = require("express-validator");
const db = require("../lib/queries");
const bcrypt = require("bcryptjs");
const { issueAccessToken } = require("../utils/issueAccessToken");
const { createRefreshToken } = require("../utils/createRefreshToken");
const { verifyRefreshToken } = require("../utils/verifyRefreshToken");
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
    .custom(async (confirm, { req }) => {
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
    if (!errors.isEmpty()) {
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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await db.getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: "Email or Password incorrect" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ error: "Email or Password incorrect" });
  }

  const payload = {
    email: user.email,
    id: user.id,
  };

  const accessToken = issueAccessToken(payload);
  const { refreshToken, maxAge } = await createRefreshToken(user.id);
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: maxAge * 1000, //14 days in MS expiry also declaed in createRefreshToken
    })
    .json({ accessToken });
};

exports.refreshToken = async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  const refreshToken = await db.getRefreshToken(oldToken);

  if (!refreshToken) {
    return res.status(403).json({ error: "invalid refresh token" });
  }

  const isExpired = verifyRefreshToken(refreshToken);

  if (isExpired) {
    await db.deleteRefreshToken(refreshToken.token);
    return res.status(403).json({ error: "Refresh token is expired" });
  }

  const payload = {
    email: refreshToken.user.email,
    id: refreshToken.user.id,
  };

  await db.deleteRefreshToken(refreshToken.token);
  const newAccessToken = issueAccessToken(payload);
  const { refreshToken: newRefreshToken, maxAge } = await createRefreshToken(
    payload.id,
  );

  return res
    .status(200)
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: maxAge * 1000, //14 days in MS expiry also declaed in createRefreshToken
    })
    .json({ accessToken: newAccessToken });
};

exports.logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(400).json({ error: "Something went wrong" });
  }
  await db.deleteRefreshToken(req.cookies.refreshToken);
  return res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json({ message: "Logged out successfully" });
};

exports.whoAmI = (req, res) => {
  return res.status(200).json({
    email: req.user.email,
    name: req.user.name,
    author: req.user.author,
  });
};

exports.setAuthor = async (req, res) => {
  const key = req.get("Author-Key");
  if (key === process.env.AUTHOR_KEY) {
    await db.updateAuthor(req.user.id, true);
    return res.status(200).json({ message: "Author status updated" });
  } else {
    return res.status(403).json({ message: "Author Key does not match" });
  }
};
