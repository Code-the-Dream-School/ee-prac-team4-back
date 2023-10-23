const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Cannot be blank'],
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
        unique: [true, 'This username is already taken'],
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Cannot be blank'],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        unique: [true, 'This email is already taken.'],
    },
    password: {
        type: String,
        required: [true, 'Cannot be blank'],
    },
});

module.exports = mongoose.model('User', userSchema);