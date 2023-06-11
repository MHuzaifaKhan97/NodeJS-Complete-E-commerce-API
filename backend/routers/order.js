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
    
    let order = new Order({
       orderItems: orderItemsIdsResolved,
       shippingAddress1: req.body.shippingAddress1,
       shippingAddress2: req.body.shippingAddress2,
       city: req.body.city,
       zip: req.body.zip,
       country: req.body.country,
       phone: req.body.phone,
       status: req.body.status,
       totalPrice: req.body.totalPrice,
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
 
 module.exports = router;