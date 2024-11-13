import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
const API_URL = "http://localhost:4001";

function Penalties() {
  const [penalties, setPenalties] = useState([]);

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-penalties`);
        setPenalties(response.data);
      } catch (error) {
        console.error("Error fetching penalties:", error);
      }
    };
    fetchPenalties();
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <Navbar />
      <center>
        <h1>Penalties</h1>
        {penalties.length !== 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Rental ID</th>
                <th>User ID</th>
                <th>Penalty Amount</th>
                <th>Reason</th>
                <th>Penalty Date</th>
              </tr>
            </thead>
            <tbody>
              {penalties.map((penalty) => (
                <tr key={penalty.rental_id}>
                  <td>{penalty.rental_id}</td>
                  <td>{penalty.user_id}</td>
                  <td>{penalty.penalty_amount}</td>
                  <td>{penalty.reason}</td>
                  <td>{penalty.penalty_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No penalties found for this user. </p>
        )}
      </center>
    </div>
  );
}

export default Penalties;
