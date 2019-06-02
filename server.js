// === BOILERPLATE ===
// dependencies
require('dotenv').config()
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080

let app = express()

// View engine setup
app.engine('.hbs', exphbs({extname: '.hbs'}))
app.set('view engine', '.hbs')

// bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ===== AUTHENTICATION ======
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const userInViews = require('./auth/middleware/userInViews.js')
const flashMessageInViews = require('./auth/middleware/flashMessageInViews.js')

// Sessions
app.use(session({
  secret: 'ilikecats',
  cookie: {},
  resave: false,
  saveUninitialized: true
}));
app.use(flash())

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware authentication and flash message view middleware
app.use(userInViews)
app.use(flashMessageInViews)

// Routes
app.use(require('./routes/index'))

// === BOILERPLATE ===
// Catch and send error messages
app.use(function (err, req, res, next) {
  if (err) {
    res.status(422).json({
      error: err.message
    });
  } else {
    next();
  }
});

// 404
app.use(function (req, res) {
  res.status(404).json({
    status: 'Page does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
})