const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
    product_name: {
        type: String
    },
    product_title: {
        type: String,
        required: true
    },
    product_description: {
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
    image_url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ProductDetails', productDetailsSchema);