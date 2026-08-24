const express = require("express");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routers/authRouter.js");

require("./config/passport.js");

const app = express();

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`listening on PORT ${PORT}`);
});
