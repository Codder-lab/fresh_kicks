const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
    discount: {
        type: Boolean
    },
    new: {
        type: Boolean
    },
    image_url: {
        type: String,
        required: true
    },
    ratings: {
        type: [
        {
            star: Number, // The star level (1 to 5)
            imageUrl: String // URL of the image representing the star level
        }
        ],
        default: []
    }
})

module.exports = mongoose.model('Product', productSchema);