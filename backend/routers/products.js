const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Models
const {Product} = require('../models/products');
const { Category } = require('../models/category');
// Import multer
const multer = require('multer');

// MIME Types
const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    const isValidFile = FILE_TYPE_MAP[file.mimetype];
    let uplaodError = new Error("invalid image type");
    if(isValidFile){
        uplaodError = null;
    }
      cb(uplaodError, 'public/uploads')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    // Another way is
    const fileName = file.originalname.replace(" ","-")
    const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })


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
 router.post("/", uploadOptions.single('image') , async (req, res) => {

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send({
        success:false,
        message:"Invalid Category"
    })
    
    const file = req.file
    if(!file) return res.status(400).send({
        success:false,
        message:"No image in the request"
    })
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`
     let product = new Product({
         name:req.body.name,
         description:req.body.description,
         richDescription:req.body.richDescription,
         image: `${basePath}${fileName}`,
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
 // Get product count
router.get('/get/count', async (req,res) => {
    const productCount = await Product.countDocuments();
    if(!productCount){
        res.status(400).send({success:false, message:"No Product found"})
    }
    res.status(200).send({success:true, productCount:productCount})

})
 // Get product count
 router.get('/get/featured/:count', async (req,res) => {
    const count = req.params.count ? req.params.count : 0;
    const productList = await Product.find({isFeatured: true}).limit(+count);
    if(!productList){
        res.status(400).send({success:false, message:"No Product found"})
    }
    res.status(200).send({success:true, productList:productList})

})

// Get product by category
router.get('/get/filter', async (req,res) => {
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');
    if(!productList){
        res.status(400).send({success:false, message:"No Product found"})
    }
    res.status(200).send({success:true, productList:productList})

})

 module.exports = router;