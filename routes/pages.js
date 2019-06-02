let pages = module.exports = {}

pages.home = (req, res, next) => {
  res.render('pages/index')
}

pages.admin = (req, res, next) => {
  res.render('pages/admin')
}

pages.special = (req, res, next) => {
  res.render('pages/special')
}