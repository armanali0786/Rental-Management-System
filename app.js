const path = require('path');
const cookieParser = require("cookie-parser");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const { check } = require('express-validator');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const port = 3001;
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;




const Routes = require('./Routers/route')
const UserRoutes = require('./Routers/user')
const CustomerRoutes = require('./Routers/customer')
const ServiceRoutes = require('./Routers/service')


app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGODB_URI =
  'mongodb://localhost:27017/RentalDB';
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.use(Routes)
app.use(UserRoutes)
app.use(CustomerRoutes)
app.use(ServiceRoutes)



app.use((req, res) => {
  res.send("<h2>404</h2>")
})
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log("Database Connected");
  })
  .catch(err => {
    console.log(err);
  });


app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})
