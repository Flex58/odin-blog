const passport = require("passport");

exports.isAuth = passport.authenticate("jwt", { session: false });
