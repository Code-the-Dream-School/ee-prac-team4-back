const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Cannot be blank'],
        maxlength: 250,
    },
    topic: {
        type: String,
        required: [true, 'Cannot be blank'],
        maxlength: 75,
    },
    subtopic: {
        type: String,
        required: [true, 'Cannot be blank'],
        maxlength: 150,
    },
    type: {
        type: String,
        required: [true, 'Cannot be blank'],
        enum :['Article', 'Video', 'Game'],
        maxlength: 75,

    },
    link: {
        type: String,
        required: [true, 'Cannot be blank']
    },

    createdBy : {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true],
    }
}, );

module.exports = mongoose.model('Resources', resourceSchema);