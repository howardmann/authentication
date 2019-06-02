# Authentication & Authorization
Demo app using passport.js for basic principles of authentication and authorization.

As a public user, I can:
- view the homepage
- visit the signup page and create a new account
- visit the login page

As a logged in user, I can:
- view my private profile page
- view special pages only visible to logged in users
- logout

As a logged in user with admin privileges, I can do all of the above plus:
- view all users
- view admin pages

[Click here for a live demo of the app.](https://authdemo.now.sh)

Here is an overview of pages and permissions.
```shell
PAGES
page              permission
/                 public homepage
/special          restricted to signed up and logged in users
/users/profile    restricted to profile of logged in user
/admin            restricted to loggedin admin users
/users            restricted to loggedin admin users

AUTH
method    path             description
GET       /login           render login view form page
POST      /login           authenticate email and password and redirects to profile page if success and login page again if fail
GET       /signup          render signup view form page
POST      /signup          create user and redirect to profile page if success and signup page with flash message if fail
GET       /logout          clears session and redirects to login page


```

Dependency descriptions
```javascript
  "dependencies": {
    "bcrypt": "^3.0.6", // for hashing passwords 
    "body-parser": "^1.19.0", // to capture form post data in req.body
    "connect-flash": "^0.1.1", // flash messages 
    "dotenv": "^8.0.0", // environment variables
    "express": "^4.17.1", // http web server
    "express-handlebars": "^3.1.0", // template engine
    "express-session": "^1.16.1", // track sessions
    "mongoose": "^5.5.12", // mongodb ORM
    "passport": "^0.4.0", // authentication
    "passport-local": "^1.0.0" // passport strategy for local DB auth (e.g. username and password)
  }

```

This is a summary of the relevant directories
```shell
auth // where all the authorization and authentication logic lives
  L middleware
    L flashMessageInViews.js  // enables all views to access {{messageSuccess}} and {{messageFailure}}
    L userInViews.js // enables all views to check if user session exists, e.g. enables us to flash login or logout link
  L authorization.js // middleware to gate routes (e.g. loginRequired, adminRequired, signupRequired)
  L index.js // entry point
  L logInOut.js // login and out pages and passport authentication logic
  L register.js // signup page and create user passport logic
  L serializer.js // serializes session user_id via passport
routes // where routes live
  L index.js // calls auth methods
  L pages.js // other pages
  L users.js // users pages
views
  L auth // templates for login and signup page
    L login.hbs
    L signup.hbs
  L pages
  L users
  L layouts
repositories // applying clean programming principles (separation of concerns) to make it easier to switch out DBs
  L userRepository.js // model wrapper for user CRUD operations
  L memory // user in memory (start off for dev purposes)
  L mongodb // user in mongodb db (for persistence)
model
  L monbodb // mongodb model and schema
db
  L mongodb // mongodb connection and seeds
  L memory // simple array for dev purposes
server.js // express webserver and dependencies 
```

We will approach authentication and authorization via the following steps:
1. Register user
2. Login and logout authentication
3. Flash messages
4. Authorization
5. Using it in routes

## 1. Register User
Passport.js is a library that makes it easier to handle session serialization, redirects and other aspects of authentication.

We will be using the `passport-local` strategy which is your vanilla username and password login strategy.

In the code below we we first start with the functionality to sign up a user. The local-signup strategy is middleware that our route will pass through. 

The first options that are passed tell passportJs that the email and password fields we are using differ from the default username field (in our case we use the name `email` in our form for username). The final field `passReqToCallback` lets us access the req object in the callback (which we will need to find other properties in the req.body e.g. the phone number).

The callback queries our DB to check if the user already exists, if it does then we return `done(null, false)` which will trigger the `failureRedirect`. If it doesn't then we create the user, hash the password using bcrypt and return `done(null, {id: newUser.id})`. By not passing false to the second param we trigger the `successRedirect` path. Here we pass the user_id to be serialized only into the session accessible via `req.user`, instead of passing the entire user object and passwordHash. You can pass anything you want, but we are passing only the id for security reasons.


```javascript
// auth/register.js
let register = module.exports = {}

// Dependecies
let bcrypt = require('bcrypt');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../repositories/userRepository.js')

// =======USER SIGN UP AND HASH PASSWORD STRATEGY========
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email', // map username to custom field, we call it email in our form
    passwordField: 'password',
    passReqToCallback: true // lets you access other params in req.body
  },
  async (req, email, password, done) => {
    // Return false if user already exists - failureRedirect
    let user = await User.findBy('email', email)
    if (user) { return done(null, false) }

    // Create new user and return the user - successRedirect
    let newUser = await User.create({
      email,
      passwordHash: bcrypt.hashSync(password, 10), // hash the password early
      phone: req.body.phone
    })

    // save the user_id to the req.user property
    return done(null, {id: newUser.id})
  }
))
```

Once we have our strategy we create two methods, 1 to render the signup form and the second to pass the forms payload to the passport signup strategy and handle the appropriate redirects.

```javascript
// auth/register.js

// GET route to render signup page
register.signupPage = (req, res, next) => {
  res.render('auth/signup')
}

// POST route to signup user and redirect 
register.signup = passport.authenticate('local-signup', {
  successRedirect: '/users/profile',
  failureRedirect: '/signup',
  failureFlash: {
    type: 'messageFailure',
    message: 'Email already taken.'
  },
  successFlash: {
    type: 'messageSuccess',
    message: 'Successfully signed up.'
  }
})

```
Later in our `routes/index.js` we will pass these two paths to:
```javascript
// routes/index.js
router
  .get('/signup', auth.signupPage)
  .post('/signup', auth.signup)

```

Visiting GET '/signup' will render the HTML signup form.

```html
// views/auth/signup
<h2>Signup</h2>

<form action="/signup" method="POST">
  <input type="email" placeholder="enter email" name="email" required>
  <br>
  <input type="password" placeholder="enter password" name="password" required>
  <br>
  <input type="tel" placeholder="enter phone" name="phone">
  <br>
  <input type="submit" value="Login">
</form>
```
Submitting the payload will then trigger the passport signup strategy and redirect accordingly. Passport.js enables us to set the success and failure flash messages in the passport.authenticate method. This is then accessible via `req.flash()`.

## 2. Login and Logout Authentication
Login and logout authentication follows the similar approach as registering new users.

We create a new `local-login` passport strategy which checks the DB if the user exists and if the submitted password matches the passwordHash in the DB (using bcrypt). If it does, we call done with the serialized user_id saved as a session in `req.user` and then trigger the `successRedirect` path. If not we call `done(null, false)` which triggers the `failureRedirect` path.

Similarly we create a loginPage path which renders the HTML login form and a method to handle the POST login request.

A logout path is straight forward, we call req.logout() which clears the session, we flash a message and redirect to a URL.

```javascript
//auth/logInOut.js
let logInOut = module.exports = {}

// Dependencies
let bcrypt = require('bcrypt');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../repositories/userRepository.js')

// ======USER LOGIN AUTHENTICATION STRATEGY=======
passport.use('local-login', new LocalStrategy({
    // Fields to accept
    usernameField: 'email', // default is username, override to accept email
    passwordField: 'password',
    passReqToCallback: true // allows us to access req in the call back
  }, async (req, email, password, done) => {
    // Check if user and password is valid
    let user = await User.findBy('email', email)
    let passwordValid = user && bcrypt.compareSync(password, user.passwordHash)

    // If password valid call done and serialize user.id to req.user property
    if (passwordValid) {
      return done(null, {
        id: user.id
      })
    }
    // If invalid call done with false and flash message
    return done(null, false, {
      message: 'Invalid email and/or password'
    });
}))


// GET route to render login form view
logInOut.loginPage = (req, res, next) => {
  res.render('auth/login')
}

// POST route to handle req.body payload. Pass to passport login strategy with relevant redirects
logInOut.login = passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: {
    type: 'messageFailure',
    message: 'Invalid email and/ or password.'
  },
  successFlash: {
    type: 'messageSuccess',
    message: 'Successfully logged in.'
  }
})

// GET logout route, flash message and redirect
logInOut.logout = (req, res, next) => {
  req.logout();
  req.flash('messageSuccess', 'Successfully logged out')
  res.redirect('/login')
}

```

## 3. Flash messages
In order to display the flash messages we have been flashing above we need some middleware. This is a simple middleware that stores the success and failure flash messages in the gloal res.locals property. This makes it accessible in all our views via {{messageSuccess}} and {{messageFailure}}.

```javascript
//auth/middleware/flashMessageInviews.js
// global route middleware 
// success and failure flash message in views
module.exports = (req, res, next) => {
  res.locals.messageSuccess = req.flash('messageSuccess')
  res.locals.messageFailure = req.flash('messageFailure')
  next();
}
```

In addition in order to know if someone has logged in or not we use another middleware to check if the user is authenticated. This lets us be able to display either login or logout links depending if someone is logged in or out.

```javascript
//auth/middleware/userInViews.js
// global route middleware 
// user boolean accessible in views if authenticated
module.exports = (req, res, next) => {
  res.locals.user = req.isAuthenticated()
  next()
}
```

To use these we need to call it in our main server.js file.
```javascript
//server.js
// Custom middleware authentication and flash message view middleware
app.use(userInViews)
app.use(flashMessageInViews)

// Routes
app.use(require('./routes/index'))
const userInViews = require('./auth/middleware/userInViews.js')
const flashMessageInViews = require('./auth/middleware/flashMessageInViews.js')
```

Now in our view layout template we can display our flash messages and appropriate login or logout links.

```handlebars
//views/layouts/main.hbs
  <h1>Web App</h1>
  <div style="background-color: red">    
    {{messageFailure}}
  </div>
  <div style="background-color: green">    
    {{messageSuccess}}
  </div>
  
  <nav>
    <p>
      {{#if user}}
        <a href="/logout">Logout</a>
      {{else}}
        <a href="/login">Login</a>
      {{/if}}
      
      <a href="/signup">Signup</a>
    </p>
```

## 4. Authorization
Authorization middleware lets us gate certain routes depending on a users authentication and permission level. In addition it can then redirect to specific pages with appropriate flash messages.

In our example we use three forms of authorization:
- loginRequired: needs to be logged in otherwise redirect to login page
- adminRequired: needs to be an admin: true user otherwise redirects to profile page
- signupRequired: same as loginRequired except redirects to signup page

```javascript
//auth/authorization.js
let authorization = module.exports = {}

let User = require('../repositories/userRepository')

// Higher order function to keep DRY
let authenticate = ({type, message, redirectPath}) => {
  return (req, res, next) => {
    let isAuthenticated = req.isAuthenticated()
    if (!isAuthenticated) {
      req.flash(type, message)
      return res.redirect(redirectPath)
    }
    next()
  }
}

// ===AUTHORIZATION MDDLEWARE
authorization.loginRequired = authenticate({
  type: 'messageFailure',
  message: 'Must be logged in',
  redirectPath: '/login'
})

authorization.signupRequired = authenticate({
  type: 'messageFailure',
  message: 'Must be signed up',
  redirectPath: '/signup'
})


authorization.adminRequired = async (req, res, next) => {
  let id = req.user && req.user.id
  let user = await User.findBy('id', id)
  let isAdmin = user && user.admin

  if (!isAdmin) {
    req.flash('messageFailure', 'Admin only')
    return res.redirect('/users/profile')
  }

  next();
}
```

## 5. Using it in routes
Now we have our logic and flash views raedy we can integrate to our routes/index file. This should be self explanatory.

```javascript
const express = require('express')
let router = express.Router()

// === AUTH ENDPOINTS ===
const auth = require('../auth')
router
  .get('/login', auth.loginPage)
  .post('/login', auth.login)
  .get('/signup', auth.signupPage)
  .post('/signup', auth.signup)
  .get('/logout', auth.logout)

// === BOILERPLATE === 
// pages endpoints
let pages = require('./pages')

router
  .get('/', pages.home)
  .get('/admin', auth.loginRequired, auth.adminRequired, pages.admin)
  .get('/special', auth.signupRequired, pages.special)
  
// users endpoints
let users = require('./users')
router
  .get('/users/profile', auth.loginRequired, users.show)
  .get('/users', auth.loginRequired, auth.adminRequired, users.index)

module.exports = router
```

## How to use this demo app
This demo app can be used as boilerplate authentication for other apps.

To reuse follow these steps:
1. Ensure you have the minimum dependencies installed (see above)
2. Copy the entire auth folder
3. Create an auth folder in your views to render the appropriate login and signup page (customise depending on form fields)
4. Modify the userRepository in order to create and read user details
6. Update your routes/index file to include the auth routes and use the appropriate auth authorization middleware for your specific routes
7. Update your server.js file to include the relevant authentication dependencies (order matters)