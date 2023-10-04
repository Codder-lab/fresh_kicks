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
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    address: {
        type: String,
        required: true,
    },
    address2: {
        type: String
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    creditCard: {
        nameOnCard: {
            type: String,
            required: true,
        },
        cardNumber: {
            type: String,
            required: true,
        },
        expirationDate: {
            type: String, // Use Date type if storing actual date
            required: true,
        },
        cvv: {
            type: String,
            required: true,
        },
    },
        
    // Add other order-related fields such as total price, order date, status, etc.
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);