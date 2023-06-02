const express = require('express');
const app = express();
// use dot env
require('dotenv/config')
// used a middleware to parse req.body in post request
app.use(express.json());
const api = process.env.API_URL;

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

app.listen(3000,()=> {
    console.log(api);
    console.log("Server is listening")
})