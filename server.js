require('dotenv').config()

// dependencies
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080

// authentication
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')

let app = express()

// View engine setup
app.engine('.hbs', exphbs({extname: '.hbs'}))
app.set('view engine', '.hbs')

// bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Authentication
app.use(session({
  secret: 'ilikecats',
  cookie: {},
  resave: false,
  saveUninitialized: true
}));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());


// global route middleware set property user if authenticated
app.use((req, res, next) => {
  res.locals.user = req.isAuthenticated()
  next()
})

// global route middleware set flash messages
app.use((req, res, next) => {
  res.locals.messageSuccess = req.flash('messageSuccess')
  res.locals.messageFailure = req.flash('messageFailure')
  next();
})
// Routes
app.use(require('./routes/index'))


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