const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var id = '5961298f23c93809f6223188';
var userId = '5961295a38f01f09ec383b34';

if (!ObjectID.isValid(id)) {
    console.log('ID is not valid');
}

// Find as a default will return array of object
// although search criteria is an unique ID
// Todo
//     .find({_id: id})
//     .then((todos) => {
//         console.log(JSON.stringify(todos, undefined, 2));
//     }, (err) => {
//         console.log(err);
//     });

// FindOne will return a single object not an array
// Todo
//     .findOne({_id: id})
//     .then((todo) => {
//         console.log(JSON.stringify(todo, undefined, 2));
//     }, (err) => {
//         console.log(err);
//     });

// FindById refers to the ID directly
// return a single object not an array
// Todo
//     .findById(id)
//     .then((todo) => {
//         if (!todo) {
//             return console.log('Id not found');
//         }
//         console.log(JSON.stringify(todo, undefined, 2));
//     }, (err) => {
//         console.log(err);
//     }).catch((e) => {
//         console.log(e);
//     });

User
    .findById(userId)
    .then((user) => {
        if (!user) {
            return console.log('User not found');
        }
        console.log(JSON.stringify(user, undefined, 2));
    }).catch((e) => {
        console.log(e);
    });