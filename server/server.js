var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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

// GET /todos
// Return all todos
app.get('/todos', (req, res) => {
    Todo
        .find()
        .then((todos) => {
            // We wrap todos in an object
            // in order to we can add another properties we need later on
            res
                .send({todos});
        }, (err) => {
            res
                .send(err);
        });
});

// GET /todos/:id
// Return a todo object
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    console.log('Todo ID: ', id);
    if (!ObjectID.isValid(id)) {
        console.log('ID is invalid. ', id);
        res
            .status(404)
            .send();
        return;
    }
    Todo
        .findById(id)
        .then((todo) => {
            // If todo with id params not found in database
            // Server will send empty body with status code 404
            if (!todo) {
                console.log('Todo not found')
                res
                    .status(404)
                    .send();
                return;
            }
            // Return todo with id params
            res
                .status(200)
                .send({todo});
        }, (err) => {
            // Error occured in the server
            console.log('Error occured when query todo by id. ', err);
            res

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
                .send({usrDoc});
        }, (err) => {
            res
                .status(400)
                .send(err);
        });
        
});

// DELETE /users/:id
// Delete a user
app.delete('/todos/:id', (req, res) => {
    var todoId = req.params.id;
    // Check whether the ID is valid or not
    // Send empty body and set the status code 404
    if (!ObjectID.isValid(todoId)) {
        console.log('Invalid object ID.');
        res
            .status(404)
            .send();
        return;
    }
    // Do remove query
    // If success, return the remove object
    // If there's no data return empty body and status code 404
    // If error occured, return empty body and status code 400
    Todo
        .findByIdAndRemove(todoId)
        .then((rmvTodo) => {
            if (rmvTodo == null) {
                console.log(`Theres no todo data with the ID ${todoId}`);
                res
                    .status(404)
                    .send();
                return;
            }
            console.log(`Todo with ID ${todoId} successfully deleted`);
            res
                .status(200)
                .send({todo: rmvTodo});
            return;
        })
        .catch((e) => {
            console.log(`Error occured when deleted Todo with ID ${todoId}`);
            res
                .status(400)
                .send();
        });
});

// GET /users
// Get all users
app.get('/users', (req, res) => {
    User
        .find()
        .then((users) => {
            res
                .send({users});
        }, (err) => {
            res
                .send(err);
        });
});

// Fire up the server on port 3000
if (!module.parent) {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

// Exporting app variable for testing needs
module.exports = { app };