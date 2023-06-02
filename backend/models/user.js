const mongoose = require('mongoose');

// Schema
const userSchema = mongoose.Schema({
    name:String,
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

// Model
exports.User = mongoose.model('User', userSchema);
