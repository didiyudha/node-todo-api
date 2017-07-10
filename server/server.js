require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

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

// DELETE /users/:id
// Delete a todo
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

// PATCH /todos/:id
// Update a todo
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    // Get text and completed properties in request body
    var body = _.pick(req.body, ['text', 'completed']);

    // Check whether the ID is valid or not
    // Send empty body and set the status code 404
    if (!ObjectID.isValid(id)) {
        console.log('Invalid object ID.');
        res
            .status(404)
            .send();
        return;
    }

    // If there's compeleted in request body 
    // and the value is equal to true 
    // then set the completedAt time
    // else we set completed to false and completedAt to false
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
        body.completed = false;
    }
    
    // Update todo data
    // If succes will be returned updated data
    // else return empty data
    Todo
        .findByIdAndUpdate(id, {
            $set: body
        }, {
            new: true
        })
        .then((todo) => {
            if (!todo) {
                res
                    .status(404)
                    .send();
                return;
            }
            res
                .status(200)
                .send({todo});
            return;
        })
        .catch((err) => {
            res
                .status(400)
                .send();
            return;
        });
});

// POST /users
// Create a user
// When success server will return the object user: id, and email
// And also set the header token that has been generated by the server
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user
    .save()
    .then(() => {
        return user.generateAuthToken();
    })
    .then((token) => {
        res
            .header('x-auth', token)
            .send(user);
    })
    .catch((e) => {
        res
            .status(400)
            .send(e);
        return;
    });
});

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
    var user = req.user;
    res
        .send({user});
});

// Fire up the server on port 3000
if (!module.parent) {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

// Exporting app variable for testing needs
module.exports = { app };