import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authenticationRoute from './routes/authenticationRoute.js';
import loanRoute from './routes/loanRoute.js';
import morgan from 'morgan-body';
import rfs from 'rotating-file-stream';
import fs from 'fs';
import https from 'https';

dotenv.config();

const app = express();

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
};

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // Daily rotation
  path: path.join(__dirname, 'log'),
});

morgan(app, {
  stream: accessLogStream,
  noColors: true,
  logReqUserAgent: true,
  logRequestBody: true,
  logResponseBody: true,
  logReqCookies: true,
  logReqSignedCookies: true,
});

app.use(bodyParser.urlencoded({ extended: false }), cookieParser());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authenticationRoute, loanRoute);

app.get('/', (req, res) => {
  res.redirect('/api/home');
});

app.use((_req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const port = process.env.PORT || 3000;
    https.createServer(options, app).listen(port, () => {
      console.log(`Server running on https://localhost:${port}`);
    });
  });
