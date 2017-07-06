// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

var objId = new ObjectID();
console.log(objId);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Can not connect to Mongodb server');
	}
	console.log('Connected to Mongodb server');
	// db.collection('Todos').insertOne({
	// 	text: 'Something todo',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });
	// db.collection('Users').insertOne({
	// 	name: 'Marshanda',
	// 	age: 26,
	// 	location: 'Jakarta'
	// }, (err, usr) => {
	// 	if (err) {
	// 		return console.log('Unable to insert user', err);
	// 	}
	// 	console.log(usr.ops[0]._id.getTimestamp());
	// });
	db.close();
});

