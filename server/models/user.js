var mongoose = require('mongoose');

// User model declaration
var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

// Exporting User model
module.exports = { User };