import config from '../config';
import createServer from 'auto-sni';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();
const server = require('http').Server(app);
const FacebookStrategy = require('passport-facebook').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const io = require('socket.io')(server);
const port = 8001 || process.env.PORT;
const redis = new Redis(`redis://${config.redis}`);
mongoose.connect(`mongodb://${config.mongodb}`);
// Express config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
// Routes
const router = require('./router')(app);
// Passport Strategies
require('./pass.js')(passport, redis, FacebookStrategy, BearerStrategy);
// Socket IO
require('./sockets.js')(io);

if(process.env.NODE_ENV = 'production') {
  // SSL if production
  createServer({
    email: 'luandro@gmail.com',
    agreeTos: true,
    domains: ["localhost"],
    ports: {
      http: 8002,
      https: 8003
    }
  }, app);
}

// Error Handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
});

// Start listening on port
app.listen(port, () => {
  console.log('Ouvindo na porta: ', port);
})

module.exports = app;
