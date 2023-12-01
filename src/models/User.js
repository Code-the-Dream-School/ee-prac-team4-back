const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Cannot be blank'],
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
        // unique: [true, 'This username is already taken'], // for testing purposes
        maxlength: 50,
    },
    firstName: {
        type: String,
        required: [false, 'Cannot be blank'], // false only for testing purposes
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: [false, 'Cannot be blank'],  // false only for testing purposes
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'], 
        maxlength: 50,
    },
    role: {
        type: String,
        enum: ['Mentor', 'Student', 'Apprentice', 'Admin'],
        required: [true, 'Please choose your role']
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