const { Todo } = require('./../server/models/todo');
const { mongoose } = require('./../server/db/mongoose');

// Remove all todo records
// Todo
//     .remove({})
//     .then((res) => {
//         console.log(res);
//     });

// FindOneAndRemove remove a single todo
// and return an object that has been removed
// Todo
//     .findOneAndRemove('59621c6893b4c962e002c621')
//     .then((res) => {
//         console.log(res);
//     })

// FindByIdAndRemove remove a single todo
// and return and object that has been removed
Todo
    .findByIdAndRemove('59621c6893b4c962e002c621')
    .then((res) => {
        console.log(res);
    });