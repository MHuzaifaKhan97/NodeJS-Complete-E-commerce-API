const express = require('express');
const router = express.Router();
// Models
const {Category} = require('../models/category');

// get method 
router.get("/", async (req, res) => {

    const categoryList = await Category.find();
     
    if(!categoryList){
     res.status(500).json({
         success: false,
     });
    }
    res.status(200).send(categoryList);
 })

 router.get("/:id", async (req, res) => {

    const category = await Category.findById(req.params.id);
     
    if(!category){
     res.status(500).json({
         success: false,
         message:"Category not found"
     });
    }
    res.status(200).send(category);
 })

 router.post("/", async (req,res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });
    category = await category.save();
    if(!category){
       return res.status(404).send({
            message:"Category can not be created"
        })
    }
    res.send(category);
 })

 // api/v1/id
 router.delete("/:id", async (req,res) => {
   let category = await Category.findByIdAndRemove(req.params.id)
   if(category){
    res.status(200).send({
        success: true,
        message:"Category has been deleted successfully"
    })
   }else{
    res.status(404).send({
        success:false,
        message:"Category not found"
    })
   }
 })
 module.exports = router; 