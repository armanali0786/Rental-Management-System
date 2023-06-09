const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const items_per_page = 2;

const User = require("../Models/user");
const Service = require("../Models/service");
const Customer = require("../Models/customer");
const Otp = require("../Models/otp");

const router = require("../Routers/route");
const user = require("../Models/user");
const { validationResult } = require("express-validator");

exports.postRegister = (req, res, next) => {
  const {
    role,
    name,
    email,
    phoneno,
    dob,
    address,
    city,
    password,
    ConfirmPassword,
  } = req.body;
  verifyEmail = "http://localhost:7500/verify";
  bcrypt.hash(password, 12).then((hashedPassword) => {
    const user = new User({
      role: role,
      name: name,
      email: email,
      phoneno: phoneno,
      dob: dob,
      address: address,
      city: city,
      password: hashedPassword,
      ConfirmPassword: hashedPassword,
    });
    user.save();
    res.redirect("/login");
  });
};

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Validation Failed");
      err.statusCode = 422;
      err.data = errors.array();
      throw err;
    }
    verifyOTP = Math.floor(Math.random() * 9000);
    console.log("OTP ", verifyOTP);
    expireTime = Date.now() + 10 * 10000;
    const user = await User.findOne({ email: req.body.email });
    const token = jwt.sign({ id: user.id, role: user.role }, "mysecretkey", {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 3600000 });
    console.log("role is::", user.role);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "armanali.shaikh77@gmail.com",
        pass: "ewiskckaaamtlwgq",
      },
    });
    var mailOptions = {
      from: "abcd@gmail.com",
      to: "armanali.shaikh77@gmail.com",
      subject: "Mail Verification,",
      html: `verification Otp Mail : ${verifyOTP}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error: ", error);
      } else {
        console.log(info.response);
      }
    });
    const otpModel = new Otp({
      userId: user._id,
      otp: verifyOTP,
    });
    otpModel.save();
    Otp.findOneAndDelete({ userId: user._id }).then((result) => {
      res.redirect("/verifyOTP");
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.data });
  }
};

exports.getVerifyOTP = (req, res) => {
  res.render("auth/verifyOTP", {});
};

exports.postVerifyOTP = (req, res) => {
  if (req.body.otp == verifyOTP && Date.now() <= expireTime) {
    console.log("OTP verified");
    res.redirect("/dashboard");
  } else {
    console.log("Invalid OTP");
    res.redirect("/verifyOTP");
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const role = req.cookies.jwt;
    const roleId = jwt.verify(role, "mysecretkey");
    const roleName = roleId.role;
    User.find().then((user) => {
      res.render("dashboard", {
        title: "dashboard",
        users: user,
        role: roleName,
      });
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.data });
  }
};

exports.getTables = (req, res) => {
  // const role = req.params.role;
  const role = req.cookies.jwt;
  const roleId = jwt.verify(role, "mysecretkey");
  const roleName = roleId.role;
  User.find().then((user) => {
    Customer.find().then((customer) => {
      res.render("tables/basicTables", {
        path: "/basicTables",
        pageTitle: "basic Tables",
        users: user,
        customers: customer,
        role: roleName,
      });
    });
  });
};

exports.getForms = (req, res) => {
  res.render("forms/basicForms", {
    title: "Forms",
  });
};

exports.getRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register",
  });
};

exports.getVerify = (req, res) => {
  res.render("auth/verify", {
    title: "Verify",
  });
};
exports.postVerify = (req, res) => {
  res.render("auth/login", {
    title: "login",
  });
};

exports.getLogout = (req, res) => {
  res.clearCookie("jwt");
  // res.cookie('jwt', 'logout', {
  //   expires: new Date(Date.now() + 2 * 1000),
  //   httpOnly: true
  // });
  res.redirect("/login");
};

exports.postFilter = (req, res) => {
  const name = req.body.filterData;
  if (name == "user") {
    User.find().then((user) => {
      res.render("tables/basicTables", {
        path: "/basicTables",
        pageTitle: "basic Tables",
        users: user,
        role: "user",
      });
    });
  } else if (name == "customer") {
    Customer.find().then((customer) => {
      res.render("tables/basicTables", {
        path: "/basicTables",
        pageTitle: "basic Tables",
        customers: customer,
        role: "customer",
      });
    });
  } else {
    const role = req.cookies.jwt;
    const roleId = jwt.verify(role, "mysecretkey");
    const roleName = roleId.role;
    User.find().then((user) => {
      Customer.find().then((customer) => {
        res.render("tables/basicTables", {
          path: "/basicTables",
          pageTitle: "basic Tables",
          users: user,
          customers: customer,
          role: "all",
        });
      });
    });
  }
};

exports.postFilterData = (req, res) => {
  const name = req.body.filterData;
  const role = req.cookies.jwt;
  const roleId = jwt.verify(role, "mysecretkey");
  const roleName = roleId.role;

  if (name == "service") {
    Service.find().then((service) => {
      res.render("tables/ServiceTable", {
        path: "/ServiceTable",
        pageTitle: "ServiceTable ",
        services: service,
        role: "service",
        roles: roleName,
      });
    });
  } else {
    const role = req.cookies.jwt;
    const roleId = jwt.verify(role, "mysecretkey");
    const roleName = roleId.role;
    Service.find().then((service) => {
      res.render("tables/ServiceTable", {
        path: "/ServiceTable",
        pageTitle: "basic Tables",
        services: service,
        role: "all",
        roles: roleName,
      });
    });
  }
};

exports.getHome = (req, res, next) => {
  res.render("index");
};

exports.getList = (req, res, next) => {
  res.render("list");
};

exports.getDetail = (req, res, next) => {
  res.render("detail");
};

exports.getBlog = (req, res, next) => {
  res.render("blog");
};
exports.getBlogDetail = (req, res, next) => {
  res.render("blog_detail");
};

exports.getAgent = (req, res, next) => {
  res.render("agent");
};

exports.getAgency = (req, res, next) => {
  res.render("agency");
};

exports.getAbout = (req, res, next) => {
  res.render("about");
};

exports.getProperty = (req, res, next) => {
  res.render("property");
};

exports.getContact = (req, res, next) => {
  res.render("contact");
};

exports.getLoginUser = (req, res, next) => {
  res.render("login-user");
};
