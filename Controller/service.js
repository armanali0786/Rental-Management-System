const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../Models/user');
const Service = require('../Models/service');
const Customer = require('../Models/customer');


exports.getAddService = (req, res, next) => {
  Customer.find()
    .then(customer => {
      res.render('forms/add-service', {
        path: '/add-service',
        pageTitle: 'Add Service',
        customers: customer
      });
    })
};


exports.postAddService = (req, res, next) => {
  const { name, email, vehicleno, phoneno, joindate, leavedate } = req.body;
  const service = new Service({
    name: name,
    email: email,
    vehicleno: vehicleno,
    phoneno: phoneno,
    vehicleno: vehicleno,
    joindate: joindate,
    leavedate: leavedate
  })
  service.save()
  res.redirect('/basicTables');
}



exports.getEditService = (req, res, next) => {
  const serviceId = req.params.id;
  Service.find({ _id: serviceId })
    .then(service => {
      User.find()
        .then(user => {
          res.render('forms/edit-service', {
            path: '/edit-service',
            pageTitle: 'Edit Service',
            services: service,
            users: user
          });
        })
    })
};


exports.postUpdateService = (req, res, next) => {
  Service.updateMany({ _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phoneno: req.body.phoneno,
        vehicleno: req.body.vehicleno,
        joindate: req.body.joindate,
        leavedate: req.body.leavedate
      }
    }
  ).then(result => {
    res.redirect('/basicTables');
  }).catch(err => {
    console.log(err);
  })
}


exports.getDeleteService = (req, res, next) => {
  Service.findByIdAndDelete({ _id: req.params.id })
    .then(result => {
      res.redirect('/basictables')
    })
    .catch(err => {
      console.log("ERROER :: ", err);
    })
};
