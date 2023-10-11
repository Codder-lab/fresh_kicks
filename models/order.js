const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
                return this.paymentMethod === 'debit';
            },
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    firstName: {
        type: String,
        required: function () {
                return this.paymentMethod === 'debit';
            },
    },
    lastName: {
        type: String,
        required: function () {
                return this.paymentMethod === 'debit';
            },
    },
    email: {
        type: String,
        required: function () {
                return this.paymentMethod === 'debit';
            },
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
        required: function () {
                return this.paymentMethod === 'debit';
            },
    },
    address2: {
        type: String
    },
    state: {
        type: String,
        required: function () {
                return this.paymentMethod === 'debit';
            },
    },
    zip: {
        type: Number,
        required: function () {
                return this.paymentMethod === 'debit';
            },
    },
    totalPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String, // Assuming you want to store the payment method used
        required: function () {
                return this.paymentMethod === 'debit';
            },
    },
    creditCard: {
        nameOnCard: {
            type: String,
            required: function () {
                return this.paymentMethod === 'credit';
            },
        },
        cardNumber: {
            type: String,
            required: function () {
                return this.paymentMethod === 'credit';
            },
        },
        expirationDate: {
            type: String, // Use Date type if storing actual date
            required: function () {
                return this.paymentMethod === 'credit';
            },
        },
        cvv: {
            type: String,
            required: function () {
                return this.paymentMethod === 'credit';
            },
        },
    },
    debitCard: {
        nameOnCard: {
            type: String,
            required: function () {
                return this.paymentMethod === 'debit';
            },
        },
        cardNumber: {
            type: String,
            required: function () {
                return this.paymentMethod === 'debit';
            },
        },
        expirationDate: {
            type: String, // Use Date type if storing actual date
            required: function () {
                return this.paymentMethod === 'debit';
            },
        },
        cvv: {
            type: String,
            required: function () {
                return this.paymentMethod === 'debit';
            },
        },
    },
        
    // Add other order-related fields such as total price, order date, status, etc.
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);