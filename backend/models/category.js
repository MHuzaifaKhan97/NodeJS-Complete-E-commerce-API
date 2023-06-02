const mongoose = require('mongoose');

// Schema
const categorySchema = mongoose.Schema({
    name:String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

// Model
exports.Category = mongoose.model('Category', categorySchema);
