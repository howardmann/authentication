// global route middleware 
// success and failure flash message in views
module.exports = (req, res, next) => {
  res.locals.messageSuccess = req.flash('messageSuccess')
  res.locals.messageFailure = req.flash('messageFailure')
  next();
}
