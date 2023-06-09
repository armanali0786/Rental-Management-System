const route = require("express").Router();

const isAuth = require("../middleware/is-auth");

const customerController = require("../Controller/customer");

route.get("/add-customer", isAuth.isLogin, customerController.getAddCustomer);

route.post("/add-customer", customerController.postAddCustomer);

route.get("/cus-edit/:id", isAuth.isLogin, customerController.getEditCustomer);

route.post("/cus-update/:id", customerController.postUpdateCustomer);

route.get("/cus-delete/:id", customerController.getDeleteCustomer);

route.get("/payment", isAuth.isLogin, customerController.getPayment);

route.post("/payment", customerController.postPayment);

route.get("/success", isAuth.isLogin, customerController.getSuccess);

route.get("/cancel", isAuth.isLogin, customerController.getCancel);

module.exports = route;
