var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useMongoClient: true
});

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var newTodo = new Todo({
    text: 'Prepare meeting room',
    completed: false,
    completedAt: 12345
});

newTodo
    .save()
    .then((res) => {
        console.log('Save new todo');
        console.log(JSON.stringify(res, undefined, 2));
    }, (err) => {
        console.log('Unable to save todo. ', err);
    });