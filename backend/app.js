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
// Constants from .env file
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;

const productSchema = mongoose.Schema({
    name:String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema);
//api/v1
// get method 
app.get(`${api}/products`, async (req, res) => {

   const productList = await Product.find();
    
   if(!productList){
    res.status(500).json({
        success: false,
    });
   }
   res.send(productList);
})
// post method
app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name:req.body.name,
        image:req.body.image,
        countInStock:req.body.countInStock,
    })
    product.save().then((createdProduct) => {
        res.status(201).send(createdProduct);
    }).catch(err => res.status(500).json({
        error:err,
        success: false,
    }));

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