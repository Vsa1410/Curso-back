# Curso-back


It is a Backend application to be used with a course application.
The pourpose of this, is make a the connection between the database and the frontend website or app, and connect both with the images server.

# Basic CRUD

The Users are divided in 3 roles:

* User(user and default users),
* Teachers (Can make new courses),
* Admin

#Register

To register a new User you need provide some information:

    POST REQUEST

    SERVERURL/users

    name,
    email,
    password,
    birthday,  (DD/MM/YYYY format)
    role       (must be provide UPPERCASED)

Login

    POST REQUEST 

    SERVERURL/login

    email,
    password,

