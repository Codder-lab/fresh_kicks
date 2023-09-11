const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    shippingAddress: {
        type: String,
        required: true,
    },
    // Add other order-related fields such as total price, order date, status, etc.
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);