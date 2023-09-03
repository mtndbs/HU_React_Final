# BuisCase App

# Dynamic Advertising Buisness Application

This is a dynamic application for advertising businesses that provides full CRUD functionality and a RESTful API. It is built using React TypeScript Template with Material-UI for the frontend, Node.js with Express for the backend, and MongoDB as the database.

## Features

- Create, read, update, and delete (CRUD) operations for managing advertisements
- RESTful API for accessing and manipulating advertisement data
- User-friendly interface with a modern and responsive design by MUI componenets
- Integration with MongoDB for data storage
- Multy-users Favorite and my cards abilities
- BackEnd and FrontEnd RouteGuard , Adapted to three types of users : User , Buisness , Admin
- Admin Area with users console
- Login limiter for 3 failure tries , blocking for the next 24 hours

---

## Technologies Used

- React: A JavaScript library for building user interfaces - Using TypeScript template.
- Material-UI: A popular React UI framework that provides pre-designed components and styling.
- Node.js: A runtime environment for executing JavaScript code on the server-side.
- Express: A minimalist web application framework for Node.js.
- MongoDB: A document-oriented NoSQL database for storing application data.

## Project Restrictions: (As of the time of writing)

- Phone validator , validate only Israely phone number
- Running the server provides hardcoded buisnesses to the database , reprovide only when then array is empty.
- Buisness user cannot provide by him self latitude and longtitude for the buisness.
- User will be blocked for 24 hours reference to the email and not the api, only when login fails 3 times in succession.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- MongoDB
- Installation:
  - 1 Clone the repository:
  - 2 Install the dependencies:
- run: npm Install at both Client and Server directories
  - Server port at 7800
  - React development port at 3000
- Start the development server at Server directory: npm start.
- Open your browser and visit http://localhost:3000 to access the application.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Contact
If you have any questions or suggestions, feel free to contact the project maintainer at mtndbs@gmail.com .
