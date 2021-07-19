// Required modules.
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const ejs = require('ejs')
const users = require('./users.class.js')
// Allow Origins for Cors.
const corsOptions = {
  origin: ["http://localhost", "null"], //Set to null in-order to use via HTML directly.
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// Active express middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(cors(corsOptions))

// Below are the http endpoints for the front-end pages.
app.get(['/', '/index'], function (req, res) {
  if(req.cookies.MicronCookie) {
    res.redirect('/home');
  } else {
    res.status(200).set("Content-Security-Policy", "default-src *; style-src 'self' https://* 'unsafe-inline'; script-src 'self' https://* 'unsafe-inline' 'unsafe-eval'").type('text/html').render('index.ejs');
  }
})
app.get('/home', function (req, res) {
  if(req.cookies.MicronCookie) {
    res.status(200).set("Content-Security-Policy", "default-src *; style-src 'self' https://* 'unsafe-inline'; script-src 'self' https://* 'unsafe-inline' 'unsafe-eval'").type('text/html').render('home.ejs');
  } else {
    res.redirect('/index');
  }
})
app.get('/register', function (req, res) {
  if(req.cookies.MicronCookie) {
    res.redirect('/home');
  } else {
    res.status(200).set("Content-Security-Policy", "default-src *; style-src 'self' https://* 'unsafe-inline'; script-src 'self' https://* 'unsafe-inline' 'unsafe-eval'").type('text/html').render('register.ejs');
  }
})

// API functions
// User Login endpoint (POST REQUEST), takes a JSON body.
app.post('/api/users/login', function (req, res) {
  users.Login(req.body.Username, req.body.Password)
  .then((data) => {
    // Return status 200 as authenticated successfully.
    res.cookie('MicronCookie', data.UserID, {sameSite: 'None', secure:true, maxAge: 360000});
    res.type('json').status(200).send(data);
  }).catch((err) => {
    // return 401, unauthorised.
    res.type('json').status(200).send(err);
  })
})
// Register a user account in-order to login.
app.post('/api/users/register', function (req, res) {
  users.Register(req.body.Username, req.body.Password, req.body.FirstName, req.body.LastName)
  .then((data) => {
    // Return status 200 as authenticated successfully.
    res.type('json').status(200).send(data);
  }).catch((err) => {
    // return 401, unauthorised.
    res.type('json').status(200).send(err);
  })
})
// Get user information based on cookie returned from login.
app.get('/api/users/heartbeat', function (req, res) {
  if(req.cookies) {
    users.Info(req.cookies.MicronCookie)
    .then((data) => {
      res.type('json').status(200).send(data);
    }).catch((err) => {
      res.type('json').status(200).send(err);
    })
  } else {
    res.clearCookie('MicronCookie');
    res.type('json').status(200).send({"Result":0, "Message":"Cookie not available."});
  }
})
// Log user out / clear cookie on request.
app.get('/api/users/logout', function (req, res) {
  res.clearCookie('MicronCookie').type('json').send({"Result":1, "Message":"Logged out."});
})

app.listen(3000)
