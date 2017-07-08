var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
});

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

// var newTodo = new Todo({
//     text: 'Refactoring Code',
//     completed: false,
//     completedAt: 123
// });

// newTodo
//     .save()
//     .then((res) => {
//         console.log('Save new todo');
//         console.log(JSON.stringify(res, undefined, 2));
//     }, (err) => {
//         console.log('Unable to save todo. ', err);
//     });

var newUser = new User({
    email: 'yudhadidi@yahoo.com'
});

newUser
    .save()
    .then((userDoc) => {
        console.log('User successfully saved');
        console.log(JSON.stringify(userDoc, undefined, 2));
    }, (err) => {
        console.log('Unable to save user. ', err);
    });