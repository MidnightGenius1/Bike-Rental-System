import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import payment from "../Payment.jpg";
const API_URL = "http://localhost:4000";

function Penalties() {
  const [penalties, setPenalties] = useState([]);
  const [selectedPenalty, setSelectedPenalty] = useState(null);
  const [totalPenalty, setTotalPenalty] = useState(0);
  const { user_id } = useParams();

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-penalties/${user_id}`);
        setPenalties(response.data);
        console.log(penalties.length);
      } catch (error) {
        console.error("Error fetching penalties:", error);
      }
    };
    fetchPenalties();
    // eslint-disable-next-line
  }, [user_id]);

  useEffect(() => {
    const fetchTotalPenalty = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/get-total-penalty/${user_id}`
        );
        setTotalPenalty(response.data);
      } catch (error) {
        console.error("Error fetching total penalty:", error);
      }
    };
    fetchTotalPenalty();
  }, [user_id]);

  const handlePayment = async () => {
    if (selectedPenalty) {
      const { rental_id, user_id, penalty_amount } = selectedPenalty;

      try {
        // eslint-disable-next-line
        const response = await axios.post(`${API_URL}/penalty-payment`, {
          rental_id,
          user_id,
          penalty_amount,
        });

        window.location.reload();
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    }
  };

  return (
    <div>
      <Navbar user_id={user_id} />
      <center>
        <h1>Penalties</h1>
        {penalties.length !== 0 ? (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Rental ID</th>
                  <th>User ID</th>
                  <th>Penalty Amount</th>
                  <th>Reason</th>
                  <th>Penalty Date</th>
                  <th></th>
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
                    <td>
                      <button
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#paymentModal"
                        onClick={() => setSelectedPenalty(penalty)}
                      >
                        Pay Penalty
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Total Penalty: {totalPenalty}</h4>
          </div>
        ) : (
          <p>No penalties found for this user. </p>
        )}

        <div
          className="modal fade"
          id="paymentModal"
          tabIndex="-1"
          aria-labelledby="paymentModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="paymentModalLabel">
                  Penalty Payment
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div>
                  <label>
                    Penalty Amount: {selectedPenalty?.penalty_amount}
                  </label>
                </div>
                <img src={payment} alt="upi-qr" height="350px" />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePayment}
                  data-bs-dismiss="modal"
                >
                  Payment Done
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </center>
    </div>
  );
}

export default Penalties;
