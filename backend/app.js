const express = require('express');
const app = express();
// For JSON Body Parse
const bodyParser = require('body-parser');
// For API Request Logging
const morgan = require('morgan')
// For MongoDB
const mongoose = require('mongoose');
// Use dot env
require('dotenv/config')
// Used a middleware to parse req.body in post request
app.use(bodyParser.json());
app.use(morgan("tiny"));
// Constants from .env file
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;

// Import routers
const productRouter = require('./routers/products');

// Routes 
app.use(`${api}/products`, productRouter)

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