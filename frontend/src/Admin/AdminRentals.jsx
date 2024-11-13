import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
const API_URL = "http://localhost:4001";

function AdminRentals() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-rentals`);
        setRentals(response.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchRentals();
  }, []);
  return (
    <div>
      <Navbar />
      <center>
        <h1>Rental History</h1>
        <table className="table">
          <thead>
            <tr>
            <th>Rental ID</th>
            <th>User ID</th>
            <th>Bike ID</th>
              <th>Rental Start Date</th>
              <th>Rental End Date</th>
              <th>Rental Status</th>
              <th>Rental Location</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.rental_id}>
                <td>{rental.rental_id}</td>
                <td>{rental.user_id}</td>
                <td>{rental.bike_id}</td>
                <td>{rental.rental_start_time}</td>
                <td>{rental.rental_end_time}</td>
                <td>{rental.rental_status}</td>
                <td>{rental.rental_location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
}

export default AdminRentals;