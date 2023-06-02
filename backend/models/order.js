const mongoose = require('mongoose');

// Schema
const orderSchema = mongoose.Schema({
    name:String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

// Model
exports.Order = mongoose.model('Order', orderSchema);
