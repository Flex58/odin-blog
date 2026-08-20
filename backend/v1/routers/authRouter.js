const authController = require("../controllers/authController");
const { Router } = require("express");
const passport = require("passport");

const authRouter = Router();

authRouter.post("/token", authController.loginUser);
authRouter.delete("/token", authController.logoutUser);
authRouter.post("/register", authController.createUser);
authRouter.get(
  "/whoami",
  passport.authenticate(["jwt"], { session: false }),
  authController.whoAmI,
);
authRouter.post("/token/refresh", authController.refreshToken);

module.exports = { authRouter };
