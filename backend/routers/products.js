const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Models
const {Product} = require('../models/products');
const { Category } = require('../models/category');

// Get Product List
router.get("/", async (req, res) => {

    const productList = await Product.find().populate('category');
     
    if(!productList){
     res.status(500).json({
         success: false,
     });
    }
    res.send(productList);
 })
 // Get Product by Id
router.get("/:id", async (req, res) => {

    const product = await Product.findById(req.params.id).populate('category');
     
    if(!product){
     res.status(404).json({
         success: false,
         message:"Product not found"
     });
    }
    res.send(product);
 })
  // Get Product List name
// router.get("/", async (req, res) => {
//     const productList = await Product.find().select('name image -_id');
     
//     if(!productList){
//         res.status(500).json({
//             success: false,
//         });
//     }
//     res.send(productList);
//  })

 // Add Product
 router.post("/", async (req, res) => {

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send({
        success:false,
        message:"Invalid Category"
    })

     let product = new Product({
         name:req.body.name,
         description:req.body.description,
         richDescription:req.body.richDescription,
         image:req.body.image,
         brand:req.body.brand,
         price:req.body.price,
         category:req.body.category,
         countInStock:req.body.countInStock,
         rating:req.body.rating,
         numReviews:req.body.numReviews,
         isFeatured:req.body.isFeatured,

     })
     product = await product.save();
    if(!product){
        return res.status(400).send({
            success:false,
            message:"Product can not be created"
        });
    }
    res.status(201).send(product);

 
 })

//  Update Product 
router.put("/:id", async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
     return res.status(400).send({
            success:false,
            message:"Invalid Product Id"
        })
    }

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send({
        success:false,
        message:"Invalid Category"
    })

     let product = await Product.findByIdAndUpdate(req.params.id,{
         name:req.body.name,
         description:req.body.description,
         richDescription:req.body.richDescription,
         image:req.body.image,
         brand:req.body.brand,
         price:req.body.price,
         category:req.body.category,
         countInStock:req.body.countInStock,
         rating:req.body.rating,
         numReviews:req.body.numReviews,
         isFeatured:req.body.isFeatured,

     }, {new: true})
    if(!product){
        return res.status(400).send({
            success:false,
            message:"Product can not be updated"
        });
    }
    res.status(200).send(product);

 })

//  Delete Product 
router.delete("/:id", async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send({
           success:false,
           message:"Invalid Product Id"
       })
   }

     let product = await Product.findByIdAndRemove(req.params.id)
    if(!product){
        return res.status(400).send({
            success:false,
            message:"Product not found"
        });
    }
    res.status(200).send({
        success: true,
        message: "Product has been deleted"
    });

 })
 
 module.exports = router;