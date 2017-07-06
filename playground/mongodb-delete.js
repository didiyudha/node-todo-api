const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Mongodb server. ', err);
    }
    console.log('Connected to Mongodb server');
    // Delete Many
    // db.collection('Todos')
    //     .deleteMany({text: 'Task 1'})
    //     .then((result) => {
    //         console.log('Delete many was success');
    //         console.log(result);
    //     }, (err) => {
    //         console.log('Unable to perform delete many. ', err);
    //     });
    // Delete One
    // db.collection('Todos')
    //     .deleteOne({text: 'Task 2'})
    //     .then((res) => {
    //         console.log('Delete one was success');
    //         console.log(res);
    //     }, (err) => {
    //         console.log('Unable to perform delete one. ', err);
    //     });
    // Find one and delete
    // db.collection('Todos')
    //     .findOneAndDelete({completed: true})
    //     .then((res) => {
    //         console.log('Find one and delete was success');
    //         console.log(res);
    //     }, (err) => {
    //         console.log('Unable to perform FindOneAndDelete. ', err);
    //     });
    // Delete by id
    db.collection('Users')
        .findOneAndDelete({_id: new ObjectID('595e162c77bd317304e36ed7')})
        .then((res) => {
            console.log('Delete user by ID was success');
            console.log(res);
        }, (err) => {
            console.log('Unable to perform delete user by ID. ', err);
        });
    db.close();
});