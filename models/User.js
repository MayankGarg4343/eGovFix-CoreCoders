const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: String }, // Consider using a Date type instead of String
    aadhar: { type: String },
    phone: { type: String },
    userType: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
