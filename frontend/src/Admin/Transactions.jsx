import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
const API_URL = "http://localhost:4001";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-transactions`);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);
  return (
    <div>
      <Navbar />
      <center>
        <h1>Transaction History</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User ID</th>
              <th>Rental ID</th>
              <th>Amount</th>
              <th>Transaction Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td>{transaction.transaction_id}</td>
                <td>{transaction.user_id}</td>
                <td>{transaction.rental_id}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.transaction_date}</td>
                <td>{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
}

export default Transactions;