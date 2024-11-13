import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = "http://localhost:4000";

function Bikes() {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const { user_id } = useParams();
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get(`${API_URL}/bike-list`);
        setBikes(response.data);
      } catch (error) {
        console.error("Error fetching bike list:", error);
      }
    };
    fetchBikes();
  }, []);

  return (
    <div>
      <Navbar user_id={user_id}/>
      <center>
        <h1>Bike Offered</h1>
        <table className="table table-hover" style={{ width: "100%" }}>
          <thead>
            <tr style={{ width: "5%" }}>
              <th style={{ width: "5%" }}>Bike Name</th>
              <th style={{ width: "5%" }}>Price per day (₹)</th>
              <th style={{ width: "25px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr
                key={bike.bike_id}
                onClick={() => {
                  bike.status === "available"
                    ? navigate(`/user/rent/${user_id}`, {
                      state: {
                        bike_id: bike.bike_id,
                        bike_name: bike.bike_name,
                        bike_price: bike.price,
                      }
                    })
                    : console.log("not available");
                }}
              >
                <td style={{ width: "5%" }}>{bike.bike_name}</td>
                <td style={{ width: "5%" }}>{bike.price}</td>
                <td
                  style={{ width: "0.5%" }}
                  className={
                    bike.status === "available"
                      ? "table-success"
                      : "table-danger"
                  }
                >
                  {bike.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
}

export default Bikes;