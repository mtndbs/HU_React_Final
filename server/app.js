/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config({ path: './config.env' });
const app = express();
const port = process.env.PORT;

const limiter = rateLimiter({
  max: 700,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP , please try again later'
});
// ================= Global middleWare =================
app.use(cors());

app.use(morgan('dev'));
// HELMET secure your Express apps by setting various HTTP headers
app.use(helmet());
// Limit the http request fro
app.use('/api', limiter);
app.use(express.json({ limit: '20kb' }));
app.use(mongoSanitize());
app.use(xss());

// Initialize hardcoded cardData , only when Cards are empty
require('./utils/initailizeCards');
// ================= Global middleWare =================

const userRouter = require('./routes/userRoutes');
const cardRouter = require('./routes/bCardRoutes');

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    dbName: process.env.DBNAME
  })
  .then(() => {
    console.log(`connection to mongoose  succeed ! `);
  })
  .catch(err => {
    console.log(err);
  });

app.use('/api/users', userRouter);
app.use('/api/cards', cardRouter);

// handling all routes errors that are not in the application
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} at this Server!`
  });
  next();
});

app.listen(port, () => {
  console.log(`you're listening to port ${port}`);
});
