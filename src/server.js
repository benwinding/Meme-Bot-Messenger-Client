//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const hlpr = require('./shared/helpers');
const Bot = require('./bot/bot');

// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// 522466234751069
// 521529374844755

// Webhook validation
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    hlpr.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    hlpr.err("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('X-Frame-Options', 'ALLOW-FROM https://messenger.com');
    res.append('X-Frame-Options', 'ALLOW-FROM https://facebook.com');
    res.append('X-Frame-Options', 'ALLOW-FROM https://fb.com');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Statically serve files
app.use(express.static('src/public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));
app.get('/donations/:name', function (req, res) {
  let name = req.params.name;
  res.render('donations', {firstName: name, STRIPE_API_KEY: process.env.STRIPE_API_KEY});
});

const stripe = require("stripe")(process.env.STRIPE_API_SECRET);
app.post('/charged', function(req,res) {
  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express
  
  hlpr.log('Charge recieved, token: ', token);

  const charge = stripe.charges.create({
    amount: 300,
    currency: 'aud',
    description: 'Memebot Donation',
    source: token,
  });
  res.render('thankyou');
});

// Message processing
app.post('/webhook', function (req, res) {
  const data = req.body;
  if (data.object !== 'page') {
    hlpr.err("Webhook unknown event not a page", event);
    res.sendStatus(501);
    return;
  }
  if (!data.entry) {
    hlpr.err("Webhook unknown event no messages in request", event);
    res.sendStatus(500);
    return;
  }
  data.entry.forEach(function(entry) {
    if (!entry.messaging) {
      hlpr.err("Webhook received message, but not not a message: ", entry);
      return;
    }
    entry.messaging.forEach(function(event) {
      const senderId = event.sender.id;
      const message = event.message;
      const postback = event.postback;
      if (message)
        Bot.HandleMessageRecieved(senderId, message);
      else if(postback)
        Bot.HandlePostBackRecieved(senderId, postback);
      else
        hlpr.err("Webhook unknown event not a message or postback: ", event);
    });
  });
  res.sendStatus(200);
});



// Set Express to listen out for HTTP requests
const server = app.listen(process.env.PORT || 3000, function () {
  hlpr.log(`Listening on port ${server.address().port}`);
});
