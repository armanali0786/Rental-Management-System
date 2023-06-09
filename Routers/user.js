const route = require('express').Router();

const isAuth = require('../middleware/is-auth');

const userController = require('../Controller/user');

route.get('/add-user', isAuth.isLogin, userController.getAddUser);

route.post('/add-user', userController.postAddUser);

route.get('/edit/:id', isAuth.isLogin, userController.getEditUser);

route.post('/update/:id', userController.postUpdateUser);

route.get('/user-delete/:id', isAuth.isLogin, userController.getDeleteUser);


module.exports = route;