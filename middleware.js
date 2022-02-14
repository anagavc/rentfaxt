//requiring the express error class
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
//middleware to prevent unauthorized access to the admin contents
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You do not have  access");
    return res.redirect("login");
  }
  next();
};

module.exports.isAdmin = async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);
  if (req.isAuthenticated() && user.role === "admin") {
    return next();
  }
  return res.redirect("/dashboard");
};
