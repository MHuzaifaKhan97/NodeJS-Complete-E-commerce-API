const express = require('express');
const app = express();
// For JSON Body Parse
const bodyParser = require('body-parser');
// For API Request Logging
const morgan = require('morgan')
// For MongoDB
const mongoose = require('mongoose');


// use dot env
require('dotenv/config')

// used a middleware to parse req.body in post request
app.use(bodyParser.json());
app.use(morgan("tiny"));

const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;

//api/v1
// get method 
app.get(`${api}/products`, (req, res) => {
    const product = {
        id:1,
        name:'Hair dresser',
        image:'some url'
    };
    res.send(product);
})
// post method
app.post(`${api}/products`, (req, res) => {
    const product = req.body;
    res.send(product);

})

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