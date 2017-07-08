var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

// Adding JSON parser to express middleware
// in order to every request body converted to JSON object
app.use(bodyParser.json());

// Routes

// POST /todos
// Save a todo
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo
        .save()
        .then((todoDoc) => {
            res
                .status(201)
                .send(todoDoc);
        }, (err) => {
            res
                .status(400)
                .send(err);
        });
});

// POST /users
// Save a user
app.post('/users', (req, res) => {
    var newUser = new User({
        email: req.body.email
    });
    newUser
        .save()
        .then((usrDoc) => {
            res
                .status(201)
                .send(usrDoc);
        }, (err) => {
            res
                .status(400)
                .send(err);
        });
        
});


// Fire up the server on port 3000
app.listen(3000, () => {
    console.log('Server started on port 3000');
});