const route = require("express").Router();
const controller = require("../Controller/controller");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");

const User = require("../Models/user");

const isAuth = require("../middleware/is-auth");
const user = require("../Models/user");

route.get("/", controller.getRegister);

route.get("/register", controller.getRegister);

route.post("/register", controller.postRegister);

route.get("/login", controller.getLogin);

route.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter Valid Email")
      .custom((value) => {
        return user.findOne({ email: value }).then((foundUser) => {
          if (!foundUser) {
            return Promise.reject("User not Found, Please Enter valid email");
          }
        });
      }),
    check("password")
      .notEmpty()
      .withMessage("Password field can not empty")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: req.body.email });
        const isEqual = await bcrypt.compare(value, user.password);
        if (!isEqual) {
          return Promise.reject(
            "Incorrect password, Please Enter Valid Password"
          );
        }
      }),
  ],
  controller.postLogin
);

route.get("/verifyOTP", isAuth.isLogin, controller.getVerifyOTP);

route.post("/verifyOTP", controller.postVerifyOTP);

route.get("/dashboard", isAuth.isLogin, controller.getDashboard);

route.get("/basicTables", isAuth.isLogin, controller.getTables);

route.get("/basicForms", isAuth.isLogin, controller.getForms);

route.get("/verify", isAuth.isLogin, controller.getVerify);

route.post("/verify", controller.postVerify);

route.get("/logout", isAuth.isLogin, controller.getLogout);

route.post("/filter", controller.postFilter);

route.post("/filterdata", controller.postFilterData);

route.get("/index", controller.getHome);

route.get("/list", controller.getList);

route.get("/detail", controller.getDetail);

route.get("/blog", controller.getBlog);

route.get("/blog_detail", controller.getBlogDetail);

route.get("/agent", controller.getAgent);

route.get("/agency", controller.getAgency);

route.get("/about", controller.getAbout);

route.get("/property", controller.getProperty);

route.get("/contact", controller.getContact);

route.get("/login-user", controller.getLoginUser);

module.exports = route;
