const jwt = require("jsonwebtoken")
const { isJwtExpired } = require("jwt-check-expiration")

const isLogin = (req, res, next) => {
  const token = req.cookies.jwt
  if (typeof token == "undefined") {
    res.redirect("/login")
  }
  else {
    const tokenValidation = isJwtExpired(token);
    if (!tokenValidation) {
      if (token) {

        const decode = jwt.verify(token, 'mysecretkey');
        // console.log(decode.id)
        next();
      }
      else {
        res.redirect("/login")
      }
    }
    else {
      res.redirect("/login")
    }

  }

}
module.exports = {
  isLogin
}
