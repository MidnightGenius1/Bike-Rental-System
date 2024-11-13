CREATE USER 'user'@'localhost' IDENTIFIED BY 'varunvarun';
GRANT SELECT, INSERT, UPDATE, DELETE ON bike_rental_system.rental TO 'user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON bike_rental_system.bike TO 'user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON bike_rental_system.phonenumber TO 'user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON bike_rental_system.email TO 'user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON bike_rental_system.images TO 'user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON bike_rental_system.location TO 'user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON bike_rental_system.payment TO 'user'@'localhost';
GRANT SELECT ON bike_rental_system.penalty TO 'user'@'localhost';
GRANT TRIGGER ON bike_rental_system.* TO 'user'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE `User` (
  `user_id` int PRIMARY KEY,
  `name` varchar(255),
  `password_hash` varchar(255),
  `role` varchar(255),
  `address` varchar(255),
  `supervisor_id` int
);

CREATE TABLE `PhoneNumber` (
  `phone_number` varchar(255) PRIMARY KEY,
  `user_id` int,
  `phone_type` varchar(255)
);

CREATE TABLE `Email` (
  `email` varchar(255) PRIMARY KEY,
  `user_id` int,
  `email_type` varchar(255)
);

CREATE TABLE `Bike` (
  `bike_id` int PRIMARY KEY,
  `bike_name` varchar(255),
  `status` varchar(255),
  `location_id` int,
  `price` int
);

CREATE TABLE `Location` (
  `location_id` int PRIMARY KEY,
  `address` varchar(255)
);

CREATE TABLE `Rental` (
  `rental_id` int PRIMARY KEY,
  `user_id` int,
  `bike_id` int,
  `rental_start_time` datetime,
  `rental_end_time` datetime,
  `rental_status` varchar(255),
  `rental_location` varchar(255)
);

CREATE TABLE `Payment` (
  `payment_id` int PRIMARY KEY,
  `user_id` int,
  `rental_id` int,
  `amount` decimal,
  `payment_date` datetime
);

CREATE TABLE `Penalty` (
  `rental_id` int,
  `user_id` int,
  `penalty_amount` decimal,
  `reason` varchar(255),
  `penalty_date` datetime
);

CREATE TABLE `Transaction` (
  `transaction_id` int PRIMARY KEY,
  `user_id` int,
  `rental_id` int,
  `amount` decimal,
  `transaction_date` datetime,
  `description` varchar(255)
);

CREATE TABLE images (
    image_id INT ,
    image LONGBLOB
);

ALTER TABLE `User` ADD FOREIGN KEY (`supervisor_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `PhoneNumber` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Email` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Bike` ADD FOREIGN KEY (`location_id`) REFERENCES `Location` (`location_id`);

ALTER TABLE `Rental` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Rental` ADD FOREIGN KEY (`bike_id`) REFERENCES `Bike` (`bike_id`);

ALTER TABLE `Rental` ADD FOREIGN KEY (`pickup_location_id`) REFERENCES `Location` (`location_id`);

ALTER TABLE `Rental` ADD FOREIGN KEY (`dropoff_location_id`) REFERENCES `Location` (`location_id`);

ALTER TABLE `Payment` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Payment` ADD FOREIGN KEY (`rental_id`) REFERENCES `Rental` (`rental_id`);

ALTER TABLE `Penalty` ADD FOREIGN KEY (`rental_id`) REFERENCES `Rental` (`rental_id`);

ALTER TABLE `Penalty` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Transaction` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Transaction` ADD FOREIGN KEY (`rental_id`) REFERENCES `Rental` (`rental_id`);

ALTER TABLE `images` ADD FOREIGN KEY (`image_id`) REFERENCES `Bike` (`bike_id`);

GRANT FILE ON *.* TO 'root'@'localhost';

FLUSH PRIVILEGES;

DELIMITER //

CREATE TRIGGER after_payment_insert
AFTER INSERT ON payment
FOR EACH ROW
BEGIN
    INSERT INTO transaction (user_id, rental_id, amount, transaction_date, description)
    VALUES (NEW.user_id, NEW.rental_id, NEW.amount, NEW.payment_date, 'rental payment');
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE endRentalActions(IN input_bike_id INT)
BEGIN
    -- Step 1: Update bike status to "available"
    UPDATE bike 
    SET status = 'available'
    WHERE bike_id = input_bike_id;

    -- Step 2: Update location to "Jayanagar" in the location table
    UPDATE location 
    SET address = 'Jayanagar'
    WHERE location_id = input_bike_id;

    -- Step 3: Update the rental table
    UPDATE rental
	SET status = 'completed'
	WHERE bike_id = input_bike_id;
END //

DELIMITER ;

DELIMITER //

CREATE FUNCTION getUserCount()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE user_count INT;
    
    SELECT COUNT(*) INTO user_count FROM `user`;
    
    RETURN user_count;
END //

DELIMITER ;
