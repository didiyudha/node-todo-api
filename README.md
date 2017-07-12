# node-todo-api
Todo Application using NodeJS and MongoDB

Stack:
- NodeJS (middleware)
- Express (framework)
- MongoDB (nosql database)
- Mongoose (ORM for mongodb)
- JWT token (authentication)
- Bcryptjs (encrypting password)
- Heroku (deploy)
- Mocha (testing)
- Supertest (testing)
- Expect (testing)

Assume that you are already installed MongoDB and MongoDB server is started.

Step:
1. Clone this project
2. run npm install
3. run npm test
4. run npm start

Models:
1. Todo
2. User

Routes:
1. GET /todos
2. POST /todos
3. GET /todos/:id
4. PATCH /todos/:id
5. DELETE /todos/:id
6. POST /users
7. GET /users/me
8. DELETE /users/me/token
9. POST /users/login
