# Bike-Rental-System

## REQUIREMENTS
You will need MySQL and node to run this application. To start off the application with intended functionality you will need to insert into the bike table through your MySQL database. The commands to create it are also given. 

## HOW TO RUN PROJECT

- Open three terminals
- They should be opened for **admin_backend** and **user_backend** folders in the **backend** folder
- These can be accessed by ***cd .\backend\admin_backend\*** and ***cd .\backend\user_backend\*** respectively
- Run **npm i** in both terminals to download and install the required libraries
- Run **node index.js** or **nodemon index.js**, depending on whether you have installed **nodemon** library, in both terminals
- The third terminal should be used to run the frontend, which can be accessed by ***cd .\frontend\***
- Run the application by **npm start**
- This should start the complete web application, assuming you have completed the above requirements to set up the backend

## Description
A bike rental system where users can rent bikes, make payments, and track their rental history. The system manages user information, rental details, payments, penalties, and transactions.

## Features
- User registration and login
- Rent bikes and track rental status
- Payment processing and transaction logging
- Track penalties and rental history
- Manage bike availability and locations

## Tech Stack
- **Backend**: MySQL for database management
- **Frontend**: (ReactJS, HTML, CSS)
- **Server**: (Express.js, Node.js)
- **Version Control**: GitHub for source code management

## Database Schema
The system uses the following database tables:
- `User`: Stores user details (e.g., name, password, role)
- `PhoneNumber`: Stores user phone numbers
- `Email`: Stores user emails
- `Bike`: Stores bike details (e.g., name, status, price)
- `Location`: Stores location information
- `Rental`: Stores rental details (e.g., rental start/end time, status)
- `Payment`: Stores payment details for rentals
- `Penalty`: Stores penalty information
- `Transaction`: Stores transaction details for each payment
- `images`: Stores images related to bikes

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MidnightGenius1/Bike-Rental-System.git
