const express = require('express');
const app = express();
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
// For JSON Body Parse
const bodyParser = require('body-parser');
// For API Request Logging
const morgan = require('morgan');
// For MongoDB
const mongoose = require('mongoose');
// Use dot env
require('dotenv/config')

// Allowing all request for all other origin. 
app.use(cors());
app.options("*", cors());

// Used a middleware to parse req.body in post request
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname+'public/uploads'));
// Error handler
app.use(errorHandler)

// Constants from .env file
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;

// Import routers
const productRouter = require('./routers/products');
const userRouter = require('./routers/user');
const orderRouter = require('./routers/order');
const categoryRouter = require('./routers/category');

// Routes 
app.use(`${api}/products`, productRouter)
app.use(`${api}/user`, userRouter)
app.use(`${api}/order`, orderRouter)
app.use(`${api}/categories`, categoryRouter)

// Connection with MongoDB
mongoose.connect(connectionString, {
    dbName: 'eshop-database'
}).then(() => {
    console.log("Database is connected")
}).catch((err) => {
    console.log(err);
})

app.listen(3000,()=> {
    console.log(api);
    console.log("Server is listening")
})