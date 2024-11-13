# Bike-Rental-System

# REQUIREMENTS:
You will need MySQL and node to run this application. To start off the application with intended functionality you will need to insert into the bike table through your MySQL database. The commands to create it are also given. 

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
- **Frontend**: (Optional: React, HTML, CSS, or other technologies you are using)
- **Server**: (Optional: Node.js, Python, etc.)
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
