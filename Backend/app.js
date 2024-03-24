// app.js

// external imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

// internal imports
const authRouter = require('./routers/authRouter');
const rbacRouter = require('./routers/rbacRouter');
const { errorHandler } = require('./middlewares/common/errorHandler');

// app initialization
const app = express();

// dotenv configuration
dotenv.config();

mongoose.connect('mongodb+srv://nowayhome:nowayhome@cluster0.oxoqi6z.mongodb.net/EasyCity')
.then(() => {
    console.log('database connected.');
}).catch((error) => {
    console.log('error: ', error);
});

// request body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable credentials (cookies, authorization headers)
}));

// routes
app.use('/auth', authRouter);
app.use('/rbac', rbacRouter);

// error handler
app.use(errorHandler);
app.options('*', cors());

// listen to the port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
