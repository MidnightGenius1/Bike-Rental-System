import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
const API_URL = "http://localhost:4000";

function Rentals() {
  const { user_id } = useParams();
  const [rentals, setRentals] = useState([]);
  useEffect(() => {
    const getRentals = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-rentals/${user_id}`);
        setRentals(response.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    getRentals();
  }, [user_id]);
  return (
    <div>
      <Navbar user_id={user_id} />
      <center>
        <h1>Current Rentals</h1>
        {rentals.length > 0 ? (
          <table className="table" style={{ width: "100%", marginTop: "2rem" }}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Rental ID</th>
                <th>Bike Name</th>
                <th>Rental Start Time</th>
                <th>Rental End Time</th>
                <th>Rental Location</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.rental_id}>
                  <td>{rental.user_id}</td>
                  <td>{rental.rental_id}</td>
                  <td>{rental.bike_name}</td>
                  <td>
                    {new Date(rental.rental_start_time)
                      .toLocaleString()
                      .slice(0, 10)}
                  </td>
                  <td>
                    {new Date(rental.rental_end_time)
                      .toLocaleString()
                      .slice(0, 10)}
                  </td>
                  <td>{rental.rental_location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No rentals found for this user.</p>
        )}
      </center>
    </div>
  );
}

export default Rentals;
