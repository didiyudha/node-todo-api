const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

// Test update todo
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var updatedTodo = {
            _id: id,
            text: 'First test todo updated',
            completed: true
        };
        request(app)
            .patch(`/todos/${id}`)
            .send(updatedTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedTodo.text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });
    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var updatedTodo = {
            text: 'Second todo update',
            completed: false
        };
        request(app)
            .patch(`/todos/${id}`)
            .send(updatedTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedTodo.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

// Testing GET /users/me
describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.user._id).toBe(users[0]._id.toHexString());
                expect(res.body.user.email).toBe(users[0].email);
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

// Testing POST /users
describe('POST /users', () => {
    it('should create a user', (done) => {
        var newUser = {
            email: 'usertest1@example.com',
            password: 'usertes1password'
        };
        request(app)
            .post('/users')
            .send(newUser)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(newUser.email);
            })
            .end((err) => {
                if (err) {
                    console.log('Error.', err);
                    done(err);
                }
                User
                    .find({email: newUser.email})
                    .then((user) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(newUser.password);
                        done();
                    })
            });
            
    });
    it('should return validation if request is invalid', (done) => {
        var email = 'didi';
        var password = '123';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.message).toExist();
            })
            .end(done);
    });
    it('should create a user if email is in use', (done) => {
        var email = users[0].email;
        var password = '123456';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errmsg).toExist();
            })
            .end(done);
    });
});