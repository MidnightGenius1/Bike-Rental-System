import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
const API_URL = "http://localhost:4001";

function RentalPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-payments`);
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, []);
  return (
    <div>
      <Navbar />
      <center>
        <h1>Rental Payments</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>User ID</th>
              <th>Rental ID</th>
              <th>Amount</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.payment_id}>
                <td>{payment.payment_id}</td>
                <td>{payment.user_id}</td>
                <td>{payment.rental_id}</td>
                <td>{payment.amount}</td>
                <td>{payment.payment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
}

export default RentalPayments;