
const bcrypt = require('bcrypt');
const crypto = require('crypto');


var Publishable_Key = 'pk_test_51Mg50gSDe0wCTNeS1D9dLTi8fc1FcZxP6SRrAvmvz7rmPs9ZRqgG1cmSAgrAAYgp2FlWx8A4oO5r3PhQwasyJgyY00IGol43kz'
var Secret_Key = 'sk_test_51Mg50gSDe0wCTNeSaX9n85juh39jIu8T4ljlEX3iFULxsXRpWGSFixVZFAN4woEaRuPFFIdlg577kvszUCh0rMw500HVGWJQqk'
const stripe = require('stripe')(Secret_Key)

// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
const User = require('../Models/user');






exports.getAddUser = (req, res, next) => {
  res.render('forms/add-user', {
    path: '/add-user',
    pageTitle: 'Add user'
  });
};


exports.postAddUser = (req, res, next) => {
  const { role, name, email, phoneno, dob, address, password, ConfirmPassword } = req.body;
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        role: role,
        name: name,
        email: email,
        phoneno: phoneno,
        dob: dob,
        address: address,
        password: hashedPassword,
        ConfirmPassword: hashedPassword
      });
      return user.save();
    }).then(result => {
      res.redirect('/basicTables');
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getEditUser = (req, res, next) => {
  const userId = req.params.id;
  User.find({ _id: userId })
    .then(user => {
      res.render('forms/edit-user', {
        path: '/edit-user',
        pageTitle: 'Edit Customer',
        users: user
      });
    })
};

exports.postUpdateUser = (req, res, next) => {
  User.updateMany({ _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phoneno,
        address: req.body.address,
        dob: req.body.dob
      }
    }
  ).then(result => {
    res.redirect('/basicTables');
  }).catch(err => {
    console.log(err);
  })
}


exports.getDeleteUser = (req, res, next) => {
  User.findByIdAndDelete({ _id: req.params.id })
    .then(result => {
      res.redirect('/basicTables');
    })
    .catch(err => { console.log("ERROER :: ", err); })
};

