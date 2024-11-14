import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
const API_URL = "http://localhost:4001";

function AdminBikes() {
  const [bikes, setBikes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [rentalDetails, setRentalDetails] = useState(null);
  const [isEndingRental, setIsEndingRental] = useState(false);
  const [penaltyDetails, setPenaltyDetails] = useState({ amount: "", reason: "" });

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(`${API_URL}/bike-status`);
        console.log(response);
        setBikes(response.data);
      } catch (error) {
        console.error("Error fetching bike list:", error);
      }
    };
    fetchBikes();
  }, []);

  const handleRowClick = async (bike) => {
    if (bike.status === "unavailable") {
      try {
        const response = await axios.get(`${API_URL}/rental-details/${bike.bike_id}`);
        setRentalDetails(response.data);
        setSelectedBike(bike);
        setShowModal(true);
      } catch (error) {
        console.error("Error fetching rental details:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBike(null);
    setIsEndingRental(false);
  };

  const handleEndRentalClick = () => {
    setIsEndingRental(true);
  };

  const handlePenaltyChange = (e) => {
    const { name, value } = e.target;
    setPenaltyDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEndRental = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/end-rental`, {
        bike_id: selectedBike.bike_id,
        penalty_amount: penaltyDetails.amount,
        penalty_reason: penaltyDetails.reason,
      });
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Error ending rental:", error);
      alert("Failed to end rental");
    }
  };

  return (
    <div>
      <Navbar />
      <center>
        <h1>Bike Offered</h1>
        <table className="table table-hover" style={{ width: "100%" }}>
          <thead>
            <tr style={{ width: "5%" }}>
              <th style={{ width: "5%" }}>Bike Name</th>
              <th style={{ width: "5%" }}>Price per day (₹)</th>
              <th style={{ width: "5%" }}>Current Location</th>
              <th style={{ width: "25px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr
                key={bike.bike_id}
                onClick={() => handleRowClick(bike)}
                style={{ cursor: "pointer" }}
              >
                <td style={{ width: "5%" }}>{bike.bike_name}</td>
                <td style={{ width: "5%" }}>{bike.price}</td>
                <td style={{ width: "5%" }}>{bike.address}</td>
                <td
                  style={{ width: "0.5%" }}
                  className={
                    bike.status === "available" ? "table-success" : "table-danger"
                  }
                >
                  {bike.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>

      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ justifyContent: "center" }}>
                  Rental Details of {selectedBike?.bike_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {rentalDetails ? (
                  <div>
                    <p><strong>User Name:</strong> {rentalDetails.user_name}</p>
                    <p><strong>Start Time:</strong> {new Date(rentalDetails.rental_start_time).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(rentalDetails.rental_end_time).toLocaleString()}</p>
                    <p><strong>Status:</strong> {rentalDetails.rental_status}</p>
                    <p><strong>Location:</strong> {rentalDetails.rental_location}</p>
                    {rentalDetails.image && (
                      <div>
                        <strong>Image:</strong>
                        <img
                          src={rentalDetails.image}
                          alt="Bike"
                          style={{ width: "100%", maxHeight: "300px", marginTop: "10px" }}
                        />
                      </div>
                    )}
                    {!isEndingRental && (<button className="btn btn-danger mt-3" onClick={handleEndRentalClick}>
                      End Rental
                    </button>)}
                    

                    {isEndingRental && (
                      <form onSubmit={handleSubmitEndRental} className="mt-3">
                        <div className="mb-3">
                          <label>Penalty Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={penaltyDetails.amount}
                            onChange={handlePenaltyChange}
                          />
                        </div>
                        <div className="mb-3">
                          <label>Penalty Reason</label>
                          <input
                            type="text"
                            className="form-control"
                            name="reason"
                            value={penaltyDetails.reason}
                            onChange={handlePenaltyChange}
                          />
                        </div>
                        <button type="submit" className="btn btn-success">
                          Confirm End Rental
                        </button>
                        <button className="btn btn-secondary mx-1" onClick={()=>{setIsEndingRental(false)}}>Cancel</button>
                      </form>
                    )}
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBikes;
