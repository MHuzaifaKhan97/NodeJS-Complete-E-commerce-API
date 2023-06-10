const express = require('express');
const router = express.Router();
// Models
const {Order} = require('../models/order');
const {OrderItem} = require('../models/orderItem');

//api/v1
// get method 
router.get("/", async (req, res) => {
    const orderList = await Order.find();
    if(!orderList){
     res.status(500).json({
         success: false,
     });
    }
    res.send(orderList);
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
 
 module.exports = router;