// sets up what is needed
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const csrf = require('csurf');

const router = require('./router.js');
const socketSetup = require('./io.js');

// sets up the server
const setupServer = async () => {
  const port = process.env.PORT || process.env.NODE_PORT || 3000;

  const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/Salve';
  // tries to connect to the database
  mongoose.connect(dbURI, (err) => {
    if (err) {
      console.log('Could not connect to the database');
      throw err;
    }
  });
  const redisURL = process.env.REDISCLOUD_URL || 'redis://default:FEeQVLSYtw83f5xrX28BPN9qzewUs453@redis-19915.c15.us-east-1-4.ec2.cloud.redislabs.com:19915';

  const redisClient = redis.createClient({
    legacyMode: true,
    url: redisURL,
  });
  await redisClient.connect().catch(console.error);

  const app = express();

  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }));
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
  app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  const sessionMiddleWare = session({
    key: 'sessionid',
    store: new RedisStore({
      client: redisClient,
    }),
    secret: 'Salvation',
    resave: true,
    saveUninitialized: true,
  });
  app.use(sessionMiddleWare);

  app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/../views`);
  app.use(cookieParser());
  app.use(csrf());
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    console.log('Missing CSRF token!');
    return false;
  });
  router(app);
  const server = socketSetup(app, sessionMiddleWare);

  server.listen(port, (err) => {
    if (err) { throw err; }
    console.log(`Listening on port ${port}`);
  });
};
setupServer();
