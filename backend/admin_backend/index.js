import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import cors from "cors";
import env from "dotenv";
import bcrypt from "bcrypt";

const app = express();
const port = 4001;
env.config();

const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.post("/admin-login", async (req, res) => {
    const { name, password } = req.body;
    try {
        const [result] = await db.query("SELECT * FROM user WHERE name = ?", [name]);
        if (result.length > 0) {
            const adminDetails = result[0];
            const storedHashedPassword = adminDetails.password_hash;
            const match = await bcrypt.compare(password, storedHashedPassword);
            if (match) {
                res.status(200).send({ success: true })
            } else {
                res.status(401).send({ success: false, message: "Incorrect Password" });
            }
        } else {
            res.status(404).send({ success: false, message: "Admin not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
});

app.get("/bike-status", async (req, res) => {
    const [bikes] = await db.query("SELECT * FROM bike");
    res.send(bikes);
});

app.get("/rental-details/:bike_id", async (req, res) => {
    try {
        const { bike_id } = req.params;
        const [image] = await db.execute('SELECT image FROM images WHERE image_id = ?', [bike_id]);
        if (image.length === 0) {
            return res.status(404).send('Image not found');
        }
        const imageData = image[0].image;
        const base64Image = `data:image/jpeg;base64,${Buffer.from(imageData).toString('base64')}`;

        const [rentalDetails] = await db.execute(`SELECT r.*, 
        (SELECT u.name FROM user u WHERE u.user_id = r.user_id) AS user_name FROM rental r WHERE r.bike_id = ?`, [bike_id]);

        if (rentalDetails.length === 0) {
            return res.status(404).send('Rental details not found');
        }

        res.status(200).json({
            ...rentalDetails[0],
            image: base64Image
        });

    } catch (error) {
        console.error("An error has occurred:", error);
        res.status(500).send(error);
    }
});

app.post("/end-rental", async (req, res) => {
    try {
        const { bike_id, penalty_amount, penalty_reason } = req.body;
        const [rentalResult] = await db.query("SELECT user_id, rental_id FROM rental WHERE bike_id = ?", [bike_id]);
        const { user_id, rental_id } = rentalResult[0];

        if (penalty_amount && penalty_amount > 0) {
            const penaltyDate = new Date().toISOString().split("T")[0];
            await db.query(
                "INSERT INTO penalty (rental_id, user_id, penalty_amount, reason, penalty_date) VALUES (?, ?, ?, ?, ?)",
                [rental_id, user_id, penalty_amount, penalty_reason, penaltyDate]
            );
        }

        await db.query("CALL endRentalActions(?)", [bike_id]);
        res.status(200).send("Successfully ended rental");
    } catch (error) {
        console.error("Error ending rental:", error);
        res.status(500).send(error);
    }
});

app.get("/get-rentals", async (req, res) => {
    try {
        const [rentals] = await db.query("SELECT * FROM `rental`");
        res.status(200).send(rentals);
    } catch (error) {
        console.error("Error fetching rentals:", error);
        res.status(500).send(error);
    }    
});

app.get("/get-users", async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM `user`");
        res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send(error);
    }
});

app.get("/get-penalties", async (req, res) => {
    try {
        const [penalties] = await db.query("SELECT * FROM `penalty`");
        res.status(200).send(penalties);
    } catch (error) {
        console.error("Error fetching penalties:", error);
        res.status(500).send(error);
    }
});

app.get("/get-transactions", async (req, res) => {
    try {
        const [transactions] = await db.query("SELECT * FROM `transaction`");
        res.status(200).send(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).send(error);
    }
});

app.get("/get-payments", async (req, res) => {
    try {
        const [payments] = await db.query("SELECT * FROM `payment`");
        res.status(200).send(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).send(error);
    }
});

app.get("/get-user-count", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT getUserCount() AS user_count");
        const userCount = rows[0].user_count;
        res.status(200).json({ userCount });
    } catch (error) {
        console.error("Error fetching number of users:", error);
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})