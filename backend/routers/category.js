const express = require('express');
const router = express.Router();
// Models
const Category = require('../models/category');

//api/v1
// get method 
router.get("/", async (req, res) => {

    const categoryList = await Category.find();
     
    if(!categoryList){
     res.status(500).json({
         success: false,
     });
    }
    res.send(categoryList);
 })

 
 module.exports = router;