
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

var Publishable_Key = 'pk_test_51Mg50gSDe0wCTNeS1D9dLTi8fc1FcZxP6SRrAvmvz7rmPs9ZRqgG1cmSAgrAAYgp2FlWx8A4oO5r3PhQwasyJgyY00IGol43kz'
var Secret_Key = 'sk_test_51Mg50gSDe0wCTNeSaX9n85juh39jIu8T4ljlEX3iFULxsXRpWGSFixVZFAN4woEaRuPFFIdlg577kvszUCh0rMw500HVGWJQqk'
const stripe = require('stripe')(Secret_Key)



const Customer = require('../Models/customer');


exports.getAddCustomer = (req, res, next) => {
  res.render('forms/add-customer', {
    path: '/add-customer',
    pageTitle: 'Add Customer'
  });
};


exports.postAddCustomer = (req, res, next) => {
  const { role, name, email, phoneno, dob, address, password, ConfirmPassword } = req.body;
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const customer = new Customer({
        role: role,
        name: name,
        email: email,
        phoneno: phoneno,
        dob: dob,
        address: address,
        password: hashedPassword,
        ConfirmPassword: hashedPassword
      });
      return customer.save();

    }).then(result => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "armanali.shaikh77@gmail.com",
          pass: "ewiskckaaamtlwgq"
        }
      });
      var mailOptions = {
        // from: "armanali.shaikh77@gmail.com",
        from: "jklm@gmail.com",
        to: "abcd@gmail.com",
        subject: "Admin Registered you Successfully,",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error: ", error)
        } else {
          console.log(info.response)
        }
        res.redirect('/basicTables');
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getEditCustomer = (req, res, next) => {
  const userId = req.params.id;
  Customer.find({ _id: userId })
    .then(customer => {
      res.render('forms/edit-customer', {
        path: '/edit-customer',
        pageTitle: 'Edit Customer',
        customers: customer
      });
    })
};

exports.postUpdateCustomer = (req, res, next) => {
  Customer.updateMany({ _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phoneno: req.body.phoneno,
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

exports.getDeleteCustomer = (req, res, next) => {
  Customer.findByIdAndDelete({ _id: req.params.id })
    .then(result => {
      res.redirect('/basicTables');
    })
    .catch(err => { console.log("ERROER :: ", err); })
};




exports.getPayment = (req, res, next) => {
  res.render('forms/payment', {
    path: '/payment',
    pageTitle: 'Payment'
  })
}


//POST PAYMENT   
exports.postPayment = ("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{

        price: 'price_1MlBW3SDe0wCTNeS4tTcHQDx',
        quantity: 1,

      }],
      mode: "payment",
      success_url: `http://localhost:4523/success`,
      cancel_url: `http://localhost:4523/cancel`,

    })

    res.redirect(303, session.url)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// SUCCESS 
exports.getSuccess = (req, res, next) => {
  res.render('forms/success');
};
// CANCEL
exports.getCancel = (req, res, next) => {
  res.render('forms/cancel');
};

