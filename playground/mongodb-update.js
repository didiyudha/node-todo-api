const { MongoClient, ObjectID } = require('mongodb');

// Create connection to Mongodb server
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Can not connect to Mongodb server');
	}
	console.log('Connected to Mongodb server');
	// Update Todo By ID using set operator from MongoDB
	db.collection('Todos')
		.findOneAndUpdate({
			_id: new ObjectID('595e7c6c9f2b4975a6b90385')	
		}, {
			$set: {
				completed: true
			}
		}, {
			// By returning original equal to false, 
			// We will get updated object from Mongodb server
			returnOriginal: false
		}).then((res) => {
			console.log('Data was successfully updated');
			// Display updated data
			console.log(JSON.stringify(res.value, undefined, 2));
		}, (err) => {
			console.log('Unable to update data. ', err);
		});
	// Update users by ID using set and inc operator from MongoDB
	db.collection('Users')
		.findOneAndUpdate({
			_id: new ObjectID('595e0dc5bd209971d2d53e5f')
		}, {
			$inc: {
				// Increment the original age by 3
				age: 3
			}, 
			$set: {
				// Set updated name
				name: 'Raisa Yaya'
			}
		}, {
			// By returning original equal to false, 
			// We will get updated object from Mongodb server
			returnOriginal: false
		}).then((res) => {
			console.log('Successfully updated data');
			// Display updated data
			console.log(JSON.stringify(res.value, undefined, 2));
		}, (err) => {
			console.log('Unable to update data. ', err);
		});
	// Close the connection to MongoDB server
	db.close();
});

