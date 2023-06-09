const route = require('express').Router();

const serviceController = require('../Controller/service');

const isAuth = require('../middleware/is-auth');

route.get('/add-service', isAuth.isLogin, serviceController.getAddService);

route.post('/add-service', serviceController.postAddService);

route.get('/edit-service/:id', isAuth.isLogin, serviceController.getEditService);

route.post('/update-service/:id', serviceController.postUpdateService)


route.get('/ser-delete/:id', isAuth.isLogin, serviceController.getDeleteService);

module.exports = route;