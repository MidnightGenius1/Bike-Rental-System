import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import payment from "../Payment.jpg";

const API_URL = "http://localhost:4000";

function Rent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);
  const { bike_id, bike_name, bike_price } = location.state;
  const [duration, setDuration] = useState("");
  const [rentLocation, setRentLocation] = useState("");
  const [rentPrice, setRentPrice] = useState(0);
  const { user_id } = useParams();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`${API_URL}/image/${bike_id}`);
        setImageData(response.data);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, [bike_id]);

  const handlePayment = async (e) => {
    e.preventDefault();
    const user_id_int = parseInt(user_id);
    const duration_int = parseInt(duration);
    try {
      const response = await axios.post(`${API_URL}/make-rental`, {
        bike_id,
        user_id_int,
        duration_int,
        rent_location: rentLocation,
        rent_price: rentPrice,
        date: new Date().toISOString().slice(0, 10)
      });
      if (response) {
        setDuration("");
        setRentLocation("");
        setRentPrice(0);

        navigate(`/user/bikes/${user_id}`);
      }
    } catch (error) {
      console.error("Error making rental:", error);
      alert("Failed to complete rental. Please try again.");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div>
      <Navbar user_id={user_id} />
      <center>
        <h2>Name: {bike_name}</h2>
        <h3>Price per day: ₹{bike_price}</h3>
        {imageData && <img src={imageData} alt={bike_name} />}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifySelf: "center",
          }}
        >
          <button
            type="button"
            className="btn btn-success my-2 mx-2"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Rent
          </button>
          <button
            type="button"
            className="btn btn-danger my-2 mx-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Rental Details & Payment
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <img src={payment} alt="upi-qr" height={"350px"} />
                <form>
                  <div className="form-group mt-3">
                    <label>Duration of Rental (Days)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={duration}
                      onChange={(e) => {
                        const newDuration = e.target.value;
                        setDuration(newDuration);
                        setRentPrice(newDuration * bike_price);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Rental Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={rentLocation}
                      onChange={(e) => setRentLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Rental Price: {rentPrice}</label>
                  </div>
                </form>
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

export default Rent;
