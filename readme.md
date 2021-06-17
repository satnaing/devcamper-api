# DevCampers API

Backend RESTful API built with NodeJS, ExpressJS, MongoDB and Mongoose. Besides CRUD functionalities, this API covers authentication, authorization, image uploads and security preventions.

## Usages

Rename "config/renamethis.env" to "config/config.env" and update your credentials in there.

## Install Dependencies

```
npm install
```

## Run the App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Indices

- [Authentication](#authentication)

  - [Forgot Password](#1-forgot-password)
  - [Get Logged in User](#2-get-logged-in-user)
  - [Login User](#3-login-user)
  - [Logout User](#4-logout-user)
  - [Register User](#5-register-user)
  - [Reset Password](#6-reset-password)
  - [Update Password](#7-update-password)
  - [Update User Details](#8-update-user-details)

- [Bootcamps](#bootcamps)

  - [Create New Bootcamp](#1-create-new-bootcamp)
  - [Delete Bootcamp](#2-delete-bootcamp)
  - [Get All Bootcamps](#3-get-all-bootcamps)
  - [Get Single Bootcamp](#4-get-single-bootcamp)
  - [Update Bootcamp](#5-update-bootcamp)
  - [Upload Photo](#6-upload-photo)

- [Courses](#courses)

  - [Create Course](#1-create-course)
  - [Delete Course](#2-delete-course)
  - [Get Courses for Bootcamp](#3-get-courses-for-bootcamp)
  - [Get all courses](#4-get-all-courses)
  - [Get single course](#5-get-single-course)
  - [Update Course](#6-update-course)

- [Users](#users)

  - [Get all Users](#1-get-all-users)

---

## Authentication

Routes for authentication including register, login, reset password etc

### 1. Forgot Password

Generate password token and send email

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/forgotpassword
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "email": "john@gmail.com"
}
```

### 2. Get Logged in User

Get current user via token

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/auth/me
```

### 3. Login User

Login user using email and password

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/login
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "email": "admin@gmail.com",
    "password": "123456"
}
```

### 4. Logout User

Clear token cookies

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/auth/logout
```

### 5. Register User

Add user to db with encrypted password

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/register
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "name": "Publisher Account",
	"email": "pub@gmail.com",
	"password": "123456",
    "role": "publisher"
}
```

### 6. Reset Password

Reset Password via generated token

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/resetpassword/009af8aa0f20eb56cf4912b2611c3819b75617f3
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "password": "1234567890"
}
```

### 7. Update Password

Update logged in user password, send in the body currentpassword and password

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/updatepassword
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "currentpassword": "1234567890",
    "password": "123456"
}
```

### 8. Update User Details

Update user name and email

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/updatedetails
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "name": "John Doe",
    "email": "john@gmail.com"
}
```

## Bootcamps

Bootcamps CRUD functionality

### 1. Create New Bootcamp

Add new bootcamp to database. Must be authenticated and must be publisher or admin

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "name": "Devcentral Bootcamp NEW",
		"description": "Is coding your passion? Codemasters will give you the skills and the tools to become the best developer possible. We specialize in front end and full stack web development",
		"website": "https://devcentral.com",
		"phone": "(444) 444-4444",
		"email": "enroll@devcentral.com",
		"address": "45 Upper College Rd Kingston RI 02881",
		"careers": [
			"Mobile Development",
			"Web Development",
			"Data Science",
			"Business"
		],
		"housing": false,
		"jobAssistance": true,
		"jobGuarantee": true,
		"acceptGi": true
}
```

### 2. Delete Bootcamp

Delete bootcamp from database

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URL}}/api/v1/bootcamps/60c5d59baaf0d053967af896
```

### 3. Get All Bootcamps

Fetch all bootcamps from database. Includes pagination, filtering etc

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps
```

**_Query params:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| limit | 2     |             |
| page  | 2     |             |

### 4. Get Single Bootcamp

Get single bootcamp by id

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/60be3c40d1dd1ff2d26b71cd
```

### 5. Update Bootcamp

Update single bootcamp and database

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "housing": false
}
```

### 6. Upload Photo

Route to upload a bootcamp photo

**_Endpoint:_**

```bash
Method: PUT
Type: FORMDATA
URL: {{URL}}/api/v1/bootcamps/5d725a1b7b292f5f8ceff788/photo
```

**_Body:_**

| Key  | Value | Description |
| ---- | ----- | ----------- |
| file |       |             |

## Courses

Create, read, update and delete courses

### 1. Create Course

Create course with bootcampId

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5d713995b721c3bb38c1f5d0/courses
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "title": "Kevin Course",
		"description": "This course will provide you with all of the essentials to become a successful frontend web developer. You will learn to master HTML, CSS and front end JavaScript, along with tools like Git, VSCode and front end frameworks like Vue",
		"weeks": 8,
		"tuition": 8000,
		"minimumSkill": "beginner",
		"scholarhipsAvailable": true
}
```

### 2. Delete Course

Delete course with id

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URL}}/api/v1/courses/60c20b506cf961abf5f50e59
```

### 3. Get Courses for Bootcamp

Get the specific course for a bootcamp

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/5d713995b721c3bb38c1f5d0/courses
```

### 4. Get all courses

Get all courses in the database

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/courses
```

### 5. Get single course

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/courses/5d725cb9c4ded7bcb480eaa1
```

### 6. Update Course

Update course with course id

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/courses/60c20b506cf961abf5f50e59
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "title": "HAHA Update Development"
}
```

## Users

### 1. Get all Users

Get all users with Admin acess

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/users
```

---

[Back to top](#devcampers-api)

> Made with &#9829; by [thedevsaddam](https://github.com/thedevsaddam) | Generated at: 2021-06-15 16:05:38 by [docgen](https://github.com/thedevsaddam/docgen)
