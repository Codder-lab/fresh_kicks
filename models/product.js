const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: {
        type: String
    },
    product_title: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_old_price: {
        type: Number
    },
    discount: {
        type: Boolean
    },
    new: {
        type: Boolean
    },
    image_url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);