const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

// beforeEach((done) => {
//     User
//         .remove({})
//         .then(() => {
//             return User.insertMany(users);
//         })
//         .then(() => {
//             done();
//         });
// });

// Testing POST /todos
describe('POST /todos', () => {
    // Success test case
    // sending a valid data
    // expect 201, right object todo, and exist in database
    it('should create new todo', (done) => {
        var text = 'Test todo';
        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo
                    .find({text})
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    // Failed test case
    // sending invalid data
    // expect 400, empty data in database
    it('should not create new todo with invalid body data', (done) => {
        var text = ' ';
        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo
                    .find({text})
                    .then((todos) => {
                        expect(todos.length).toBe(0);
                        done();
                    })
                    .catch((err) => done(err));
            })
    });
});

// Testing GET /todos
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

// Testing GET /todos/:id
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 if object id is not valid', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

// Testing DELETE /todos/:id
describe('DELETE /todos/:id', () => {
    it('should return deleted todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                // Check todo that just has been removed in database
                Todo
                    .findOne({_id: hexId})
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    }).catch((e) => {
                        done(e);
                    });
            });
    });
    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 if object id is not valid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

// Testing POST /todos
// describe('POST /users', () => {
//     // Success test case
//     // sending a valid user object
//     // expect 201, return a saved object, and exist in database
//     it('should save a user', (done) => {
//         var email = 'didi@example.com';
//         request(app)
//             .post('/users')
//             .send({
//                 email
//             })
//             .expect(201)
//             .expect((res) => {
//                 expect(res.body.email).toBe(email);
//             })
//             .end((err, res) => {
//                 if (err) {
//                     return done(err);
//                 }
//                 User
//                     .find({email})
//                     .then((users) => {
//                         expect(users.length).toBe(1);
//                         expect(users[0].email).toBe(email);
//                         done();
//                     })
//                     .catch((err) => done(err));
//             });
//     });

//     // Fail test case
//     // sending an invalid user object
//     // expect 400 and not exist in database
//     it('should failed saving a user', () => {
//         var email = ' ';
//         request(app)
//             .post('/users')
//             .send({
//                 email
//             })
//             .expect(400)
//             .end((err, res) => {
//                 if (err) {
//                     return done(err);
//                 }
//                 User
//                     .find({email})
//                     .then((users) => {
//                         expect(users.length).toBe(0);
//                         done();
//                     })
//                     .catch((err) => done(err));
//             })
//     });
// });