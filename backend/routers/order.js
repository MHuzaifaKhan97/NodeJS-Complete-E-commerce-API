const express = require('express');
const router = express.Router();
// Models
const {Order} = require('../models/order');
const {OrderItem} = require('../models/orderItem');

//api/v1
// Get orders
router.get("/", async (req, res) => {                                   // -1 means newest first
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered':-1});
    if(!orderList){
     res.status(500).json({
         success: false,
     });
    }
    res.send(orderList);
 })

 // Get orders by id
router.get("/:id", async (req, res) => {                                 
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({path:'orderItems', populate: {path: 'product', populate: 'category'}});
    if(!order){
     res.status(500).json({
         success: false,
     });
    }
    res.send(order);
 })

//  Add order
 router.post("/", async (req,res) => {

    const orderItemIds =  Promise.all(req.body.orderItems.map( async item => {
        let orderItem = new OrderItem({
            quantity: item.quantity,
            product: item.product,
        });

        orderItem = await orderItem.save();
       return orderItem._id;
    }));

    const orderItemsIdsResolved = await orderItemIds;
    
    const totalPrices = await Promise.all(orderItemsIdsResolved.map( async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product','price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }));

    // to sum of all prices
    const totalPrice = totalPrices.reduce((a,b) => a+b,0);

    let order = new Order({
       orderItems: orderItemsIdsResolved,
       shippingAddress1: req.body.shippingAddress1,
       shippingAddress2: req.body.shippingAddress2,
       city: req.body.city,
       zip: req.body.zip,
       country: req.body.country,
       phone: req.body.phone,
       status: req.body.status,
       totalPrice: totalPrice,
       user: req.body.user,
    });
    order = await order.save();
    if(!order){
       return res.status(404).send({
            message:"Order can not be created"
        })
    }
    res.send(order);
 })
 // Update order
 router.put("/:id", async (req,res) => {
    const order  = await Order.findByIdAndUpdate(req.params.id,{
       status: req.body.status,
    }, 
    {new: true})
    if(!order){
        return res.status(400).send({
             message:"Order can not be updated"
         })
     }
     res.send(order); 
})

//  Delete order
router.delete("/:id", async (req,res) => {
    let order = await Order.findByIdAndRemove(req.params.id)
    if(order){
        order.orderItems.map(async (orderItems)=> {
            await OrderItem.findByIdAndRemove(orderItems)
        });
     res.status(200).send({
         success: true,
         message:"Order has been deleted successfully"
     })
    }else{
     res.status(404).send({
         success:false,
         message:"Order not found"
     })
    }
  })
 // total sales

 router.get("/get/totalsales", async (req,res) => {
    const totalSales = await Order.aggregate([
        {
            $group: { _id: null, totalSales: { $sum: '$totalPrice'}}
        }
    ]);
    if(!totalSales){
        res.status(400).send({success:false, message:"The order sales can not be generated"})
    }
    res.status(200).send({success:true, totalSales:totalSales.pop().totalSales});
    
 });

  // Get order count
router.get('/get/count', async (req,res) => {
    const orderCount = await Order.countDocuments();
    if(!orderCount){
        res.status(400).send({success:false, message:"No Product found"})
    }
    res.status(200).send({success:true, orderCount:orderCount})

})
// Get list of order for specific user
router.get("/get/userorders/:userid", async (req, res) => {                                  
    const userOrderList = await Order.find({user: req.params.userid}).populate('user', 'name')
    .populate({path:'orderItems', populate: {path: 'product', populate: 'category'}}).sort({'dateOrdered':-1});
    if(!userOrderList){
     res.status(500).json({
         success: false,
     });
    }
    res.send(userOrderList);
 })
 module.exports = router;