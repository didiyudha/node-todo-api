const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Mongodb server. ', err);
    }
    console.log('Connected to Mongodb server');
    db.collection('Todos').find().toArray().then((todoDocs) => {
        console.log('List Todo');
        console.log(JSON.stringify(todoDocs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch Todo. ', err);
    });
    db.collection('Todos')
        .find({completed: false})
        .toArray()
        .then((ncomplTodos) => {
            console.log('Not completed Todos');
            console.log(JSON.stringify(ncomplTodos, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch not completed Todo. ', err);
        });
    db.collection('Todos').find({_id: new ObjectID('595e0c1c5c9fff719d6e8deb')})
        .toArray()
        .then((res) => {
            console.log('Find todos by id: 595e0c1c5c9fff719d6e8deb');
            console.log(JSON.stringify(res, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch Todo by ID. ', err);
        });
    db.collection('Todos')
        .find()
        .count()
        .then((count) => {
            console.log(`Count Todos: ${count}`);
        }, (err) => {
            console.log('Unable to count todo. ', err);
        });
    db.collection('Users')
        .find({name: 'Raisa Andriana'})
        .toArray()
        .then((res) => {
            console.log('Fetch user with name Raisa Andriana');
            console.log(JSON.stringify(res, undefined, 2));
        }, (err) => {   
            console.log('Unable to fetch user by name. ', err);
        });
    db.close();
});