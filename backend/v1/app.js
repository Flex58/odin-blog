const express = require("express");
const passport = require("passport");

require("./config/passport.js");

const app = express();

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`listening on PORT ${PORT}`);
});
