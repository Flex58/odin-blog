const authController = require("../controllers/authController");
const { Router } = require("express");
const { isAuth } = require("../middleware/isAuth");

const authRouter = Router();

authRouter.post("/token", authController.loginUser);
authRouter.delete("/token", authController.logoutUser);
authRouter.post("/register", authController.createUser);
authRouter.get("/whoami", isAuth, authController.whoAmI);
authRouter.post("/token/refresh", authController.refreshToken);
authRouter.put("/author", isAuth, authController.setAuthor);

module.exports = { authRouter };
