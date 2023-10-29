const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Cannot be blank'],
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
        unique: [true, 'This username is already taken'],
        maxlength: 50,
    },
    firstName: {
        type: String,
        required: [true, 'Cannot be blank'],
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: [true, 'Cannot be blank'],
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

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, username: this.username },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    )
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', userSchema);