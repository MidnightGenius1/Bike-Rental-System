import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import cors from "cors";
import env from "dotenv";
import bcrypt from "bcrypt";

const app = express();
const port = 4000;
env.config();

const saltRounds = 10;

const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const loginPassword = req.body.password;

  try {
    const [rows] = await db.query(`
      SELECT u.user_id, u.password_hash 
      FROM user u 
      JOIN email e ON u.user_id = e.user_id 
      WHERE e.email = ?`,
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const storedHashedPassword = user.password_hash;

      const match = await bcrypt.compare(loginPassword, storedHashedPassword);

      if (match) {
        res.json({ success: true, userID: user.user_id });
      } else {
        res.status(401).json({ success: false, message: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/sign-up", async (req, res) => {
  const { name, phno, email, addr, password } = req.body;
  if (name.toLowerCase() == "admin") {
    return res.status(400).send({ success: false, message: "User cannot be admin" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await db.beginTransaction();

    const [userResult] = await db.query(
      "INSERT INTO `User` (name, password_hash, role, address, supervisor_id) VALUES (?, ?, ?, ?, ?)",
      [name, passwordHash, "user", addr, 1]
    );

    const userId = userResult.insertId;

    await db.query(
      "INSERT INTO `PhoneNumber` (phone_number, user_id, phone_type) VALUES (?, ?, ?)",
      [phno, userId, "personal"]
    );

    await db.query(
      "INSERT INTO `Email` (email, user_id, email_type) VALUES (?, ?, ?)",
      [email, userId, "personal"]
    );

    await db.commit();

    res.status(201).send({ success: true, message: "User registered successfully" });
  } catch (err) {
    await db.rollback();

    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).send({ success: false, message: "User already exists" });
    } else {
      console.error("Database error:", err);
      res.status(500).send({ success: false, message: "An error occurred during registration" });
    }
  }
});

app.get("/bike-list", async (req, res) => {
  const [bikes] = await db.query("SELECT * FROM bike");
  res.send(bikes);
});

app.get("/image/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT image FROM images WHERE image_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Image not found');
    }
    const imageData = rows[0].image;
    const base64Image = `data:image/jpeg;base64,${Buffer.from(imageData).toString('base64')}`;
    res.send(base64Image);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching image');
  }
});

function calculateNextDate(dateString, daysToAdd) {
  if (!dateString || isNaN(daysToAdd)) {
    console.error("Invalid input for calculateNextDate:", { dateString, daysToAdd });
    return null;
  }

  const date = new Date(dateString);
  date.setDate(date.getDate() + daysToAdd);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

app.post("/make-rental", async (req, res) => {
  try {
    const { bike_id, user_id_int, duration_int, rent_location, rent_price, date } = req.body;
    const duration = duration_int;
    const user_id = user_id_int;
    const end_date = calculateNextDate(date, duration);
    await db.beginTransaction();

    const [rentalResult] = await db.query("INSERT INTO `rental` (user_id, bike_id, rental_start_time, rental_end_time, rental_status, rental_location) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, bike_id, date, end_date, "active", rent_location]);

    const rentalId = rentalResult.insertId;

    await db.query("INSERT INTO `payment` (user_id, rental_id, amount, payment_date) VALUES (?, ?, ?, ?)",
      [user_id, rentalId, rent_price, date]);

    await db.query("UPDATE `location` SET address = ? WHERE location_id = ?", [rent_location, bike_id]);

    await db.query("UPDATE `bike` SET status = ? WHERE bike_id = ?", ["unavailable", bike_id]);

    await db.commit();

    res.send("success");
  } catch (err) {
    console.error("Error in /make-rental:", err);
    await db.rollback();
    res.status(500).send("Error making rental");
  }
});

app.get("/get-rentals/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rentals] = await db.query("SELECT * FROM `rental` WHERE user_id = ? and rental_status=?", [user_id, "active"]);

    if (rentals.length === 0) {
      return res.status(404).send("No rentals found for the specified user.");
    }

    const bikeNames = await Promise.all(
      rentals.map(async (rent) => {
        const [bike] = await db.query("SELECT bike_name FROM `bike` WHERE bike_id = ?", [rent.bike_id]);
        return bike[0]?.bike_name || "Unknown";
      })
    );

    const rentalsWithBikeNames = rentals.map((rent, index) => ({
      ...rent,
      bike_name: bikeNames[index]
    }));

    res.status(200).send(rentalsWithBikeNames);

  } catch (err) {
    console.error("Error fetching rentals:", err);
    res.status(500).send("An error has occurred");
  }
});

app.get("/user-info/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [info] = await db.query("SELECT name, address FROM `user` WHERE user_id = ? ORDER BY ? ASC", [user_id, user_id]);
    const [phnos] = await db.query("SELECT phone_number, phone_type FROM `phonenumber` WHERE user_id = ? ORDER BY ? ASC", [user_id, user_id]);
    const [emails] = await db.query("SELECT email, email_type FROM `email` WHERE user_id = ? ORDER BY ? ASC", [user_id, user_id]);

    const userInfo = {
      name: info[0]?.name || "Unknown",
      address: info[0]?.address || "Unknown",
      phone_numbers: phnos,
      emails: emails,
    };

    res.status(200).json(userInfo);
  } catch (err) {
    console.error("Error fetching user information:", err);
    res.status(500).send("An error has occurred");
  }
});

app.post("/add-phno/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { phone_number, phone_type } = req.body;

    await db.query("INSERT INTO `phonenumber` (phone_number, user_id, phone_type) VALUES (?, ?, ?)", [phone_number, user_id, phone_type], (error, results) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).send({ success: false, message: `The phone number ${phone_number} is already added.` });
        } else {
          console.error(error);
          return res.status(500).send({ success: false, message: "An error has occurred while adding the phone number." });
        }
      }
      res.status(200).send({ success: true, message: "Phone number added successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error has occurred");
  }
});

app.delete("/remove-phno/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { phone_number } = req.body;

    await db.query("DELETE FROM `phonenumber` WHERE phone_number = ?", [phone_number], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("An error has occurred while removing the phone number.");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send(`Error: The phone number ${phone_number} does not exist for user ${user_id}.`);
      }
      res.status(200).send("Phone number removed successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error has occurred");
  }
});

app.post("/add-email/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { email, email_type } = req.body;

    await db.query("INSERT INTO `email` (email, user_id, email_type) VALUES (?, ?, ?)", [email, user_id, email_type], (error, results) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).send(`Error: The email ${email} already exists.`);
        }
        console.error(error);
        return res.status(500).send("An error has occurred while adding the email.");
      }
      res.status(200).send("Email added successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error has occurred");
  }
});

app.delete("/remove-email/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { email } = req.body;

    await db.query("DELETE FROM `email` WHERE email = ?", [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send("An error has occurred while removing the email.");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send(`Error: The email ${email} does not exist for user ${user_id}.`);
      }
      res.status(200).send("Email removed successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error has occurred");
  }
});

app.patch("/update-address/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { new_address } = req.body;

    await db.query("UPDATE `user` SET address = ? WHERE user_id = ?", [new_address, user_id]);
    res.status(200).send("Email removed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An unexpected error has occurred");
  }
});

app.get("/get-penalties/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [penalties] = await db.query("SELECT * FROM `penalty` WHERE user_id = ?", [user_id]);
    res.status(200).send(penalties);
  } catch (error) {
    console.error("Error fetching penalties:", error);
    res.status(500).send(error);
  }
});

app.get("/get-total-penalty/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const [rows] = await db.query("SELECT SUM(penalty_amount) AS total_penalty FROM `penalty` WHERE user_id = ?",[user_id]);
    const totalPenalty = rows[0].total_penalty || 0; 
    res.status(200).send(totalPenalty);
  } catch (error) {
    console.error("Error fetching total penalty:", error);
    res.status(500).send(error);
  }
});

app.post("/penalty-payment", async (req, res) => {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const transaction_date = `${year}-${month}-${day}`;
    const { rental_id, user_id, penalty_amount } = req.body
    await db.query("INSERT INTO `transaction` (user_id, rental_id, amount, transaction_date, description) VALUES (?, ?, ?, ?, ?)", [user_id, rental_id, penalty_amount, transaction_date, "penalty payment"]);
    await db.query("DELETE FROM `penalty` WHERE rental_id = ?", [rental_id]);
    res.status(200).send("Penalty payment completed");
  } catch (error) {
    console.error("Error completing penalty payment:", error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});