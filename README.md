## API Documentation for Course Management System

## Overview
This API provides a system for managing users, courses, and modules with features such as user authentication, role-based access control, course enrollment, and module management.

### Base URL
```
http://localhost:3000
```

## Authentication
- **Token-based authentication** using JWT (JSON Web Tokens).
- Pass the token in the `Authorization` header as:
```
Authorization: Bearer <token>
```

## Endpoints

### Users

#### Get All Users
**GET** `/users`
- **Description**: Retrieves a list of all users.
- **Response**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "birthday": "1990-01-01T00:00:00.000Z",
    "role": "USER"
  }
]
```

#### Register a New User
**POST** `/users`
- **Description**: Creates a new user.
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "birthday": "01/01/1990",
  "role": "USER"
}
```
- **Response**:
```json
{
  "newUser": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "birthday": "1990-01-01T00:00:00.000Z",
    "role": "USER"
  },
  "message": "Usuario registrado com sucesso"
}
```

#### Update User
**PUT** `/users`
- **Description**: Updates the authenticated user's information.
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "newpassword123",
  "birthday": "02/02/1992",
  "role": "USER"
}
```
- **Response**:
```json
{
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "birthday": "1992-02-02T00:00:00.000Z",
    "role": "USER"
  },
  "message": "Usuario atualizado com sucesso"
}
```

#### Login
**POST** `/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "token": "<jwt-token>",
  "message": "Sucessful Login"
}
```

#### Get User Profile
**GET** `/users/me`
- **Description**: Retrieves the profile of the authenticated user.
- **Response**:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "birthday": "1990-01-01T00:00:00.000Z",
  "role": "USER",
  "courses": []
}
```

### Courses

#### Get All Courses
**GET** `/course`
- **Description**: Retrieves all available courses.
- **Response**:
```json
[
  {
    "id": 1,
    "title": "Course Title",
    "description": "Course Description",
    "category": "Category",
    "creatorId": 1
  }
]
```

#### Create a Course
**POST** `/course`
- **Description**: Allows teachers or administrators to create a new course.
- **Request Body**:
```json
{
  "title": "Course Title",
  "description": "Course Description",
  "category": "Category"
}
```
- **Response**:
```json
{
  "id": 1,
  "title": "Course Title",
  "description": "Course Description",
  "category": "Category",
  "creatorId": 1
}
```

#### Update a Course
**PUT** `/course/:id`
- **Description**: Updates the details of an existing course.
- **Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "category": "Updated Category"
}
```
- **Response**:
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated Description",
  "category": "Updated Category"
}
```

#### Delete a Course
**DELETE** `/course/:id`
- **Description**: Deletes a course and its associated data.
- **Response**:
```json
{
  "success": true,
  "message": "Curso excluído com sucesso."
}
```

#### Get Modules of a Course
**GET** `/courses/:courseId/modules`
- **Description**: Retrieves all modules of a specified course.
- **Response**:
```json
[
  {
    "id": 1,
    "title": "Module 1",
    "content": "Content of Module 1",
    "courseId": 1
  }
]
```

#### Enroll in a Course
**POST** `/course/:courseId/enrollments`
- **Description**: Enrolls the authenticated user in a course.
- **Response**:
```json
{
  "message": "Sucess!!",
  "enrollment": {
    "id": 1,
    "userId": 1,
    "courseId": 1
  }
}
```

#### Get Enrolled Courses
**GET** `/mycourses`
- **Description**: Retrieves all courses the authenticated user is enrolled in.
- **Response**:
```json
[
  {
    "id": 1,
    "title": "Course Title",
    "description": "Course Description",
    "category": "Category",
    "creatorId": 1
  }
]
```

#### Get Created Courses
**GET** `/createdCourses`
- **Description**: Retrieves all courses created by the authenticated user.
- **Response**:
```json
[
  {
    "id": 1,
    "title": "Course Title",
    "description": "Course Description",
    "category": "Category",
    "creatorId": 1
  }
]
```

### Modules

#### Create a Module
**POST** `/module`
- **Description**: Creates a new module for a course.
- **Request Body**:
```json
{
  "title": "Module Title",
  "content": "Module Content",
  "courseId": 1
}
```
- **Response**:
```json
{
  "id": 1,
  "title": "Module Title",
  "content": "Module Content",
  "courseId": 1
}
```

#### Update a Module
**PUT** `/module/:id`
- **Description**: Updates an existing module.
- **Request Body**:
```json
{
  "title": "Updated Module Title",
  "content": "Updated Module Content"
}
```
- **Response**:
```json
{
  "id": 1,
  "title": "Updated Module Title",
  "content": "Updated Module Content",
  "courseId": 1
}
```

#### Get All Modules
**GET** `/module`
- **Description**: Retrieves all modules.
- **Response**:
```json
[
  {
    "id": 1,
    "title": "Module Title",
    "content": "Module Content",
    "courseId": 1
  }
]
```

#### Get a Module by ID
**GET** `/module/:id`
- **Description**: Retrieves details of a specific module by ID.
- **Response**:
```json
{
  "id": 1,
  "title": "Module Title",
  "content": "Module Content",
  "courseId": 1
}
```

#### Delete a Module
**DELETE** `/module/:id`
- **Description**: Deletes a module by ID.
- **Response**:
```json
{
  "id": 1,
  "title": "Module Title",
  "content": "Module Content",
  "courseId": 1
}
```

---

## Error Handling
### Common Response Format for Errors:
```json
{
  "error": "Error message"
}
```



