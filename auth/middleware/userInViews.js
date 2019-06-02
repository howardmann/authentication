// global route middleware 
// user boolean accessible in views if authenticated
module.exports = (req, res, next) => {
  res.locals.user = req.isAuthenticated()
  next()
}