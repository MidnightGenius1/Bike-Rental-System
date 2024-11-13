import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
const API_URL = "http://localhost:4000";

function UserInfo() {
  const { user_id } = useParams();
  const [userInfo, setUserInfo] = useState({
    name: "",
    address: "",
    phone_numbers: [],
    emails: [],
  });
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [newPhone, setNewPhone] = useState({
    phone_number: "",
    phone_type: "",
  });
  const [newEmail, setNewEmail] = useState({ email: "", email_type: "" });
  const [newAddress, setNewAddress] = useState("");
  
  // eslint-disable-next-line
  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/user-info/${user_id}`);
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  const handleAddPhone = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/add-phno/${user_id}`,
        newPhone
      );
      if (response.data.success) {
        console.log(response);
        alert("hello");
        getUserInfo();
        setNewPhone({ phone_number: "", phone_type: "" });
        setIsAddingPhone(false);
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding phone number:", error);
    }
  };

  const handleAddEmail = async () => {
    try {
      await axios.post(`${API_URL}/add-email/${user_id}`, newEmail);
      getUserInfo(); // Re-fetch data after adding
      setNewEmail({ email: "", email_type: "" });
      setIsAddingEmail(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding email:", error);
    }
  };

  const handleRemovePhone = async (index) => {
    if (userInfo.phone_numbers.length <= 1) {
      alert("User needs to have at least one phone number");
      return;
    }
    const phoneToRemove = userInfo.phone_numbers[index];
    try {
      await axios.delete(`${API_URL}/remove-phno/${user_id}`, {
        data: phoneToRemove,
      });
      getUserInfo();
      window.location.reload();
    } catch (error) {
      console.error("Error removing phone number:", error);
    }
  };

  const handleRemoveEmail = async (index) => {
    if (userInfo.emails.length <= 1) {
      alert("User needs to have at least one email");
      return;
    }
    const emailToRemove = userInfo.emails[index];
    try {
      await axios.delete(`${API_URL}/remove-email/${user_id}`, {
        data: emailToRemove,
      });
      getUserInfo();
      window.location.reload();
    } catch (error) {
      console.error("Error removing email:", error);
    }
  };

  const handleUpdateAddress = async () => {
    try {
      await axios.patch(`${API_URL}/update-address/${user_id}`, {
        new_address: newAddress,
      });
      getUserInfo();
      window.location.reload();
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  useEffect(() => {
    setNewAddress(userInfo.address);
  }, [userInfo.address]);

  return (
    <div>
      <Navbar user_id={user_id} />
      <div style={{ marginLeft: "2rem" }}>
        <h2>User Information</h2>
        <h4>Name: {userInfo.name}</h4>
        <h4>Address: {userInfo.address}</h4>
        
        {isEditingAddress ? (
          <div>
            <input
              type="text"
              defaultValue={userInfo.address}
              onChange={(e) => {
                setNewAddress(e.target.value);
              }}
            />
            <button
              style={{ marginLeft: "0.5rem" }}
              onClick={handleUpdateAddress}
            >
              Update Address
            </button>{" "}
            <button
              onClick={() => {
                setIsEditingAddress(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            style={{ margin: "0.5rem" }}
            onClick={() => {
              setIsEditingAddress(true);
            }}
          >
            Edit address
          </button>
        )}
        <h4>Phone Numbers:</h4>
        <ul>
          {userInfo.phone_numbers.map((phone, index) => (
            <li key={phone.phone_number}>
              {phone.phone_type.charAt(0).toUpperCase() +
                phone.phone_type.slice(1)}
              : {phone.phone_number}
              <button
                style={{ margin: "0.5rem" }}
                onClick={() => handleRemovePhone(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {isAddingPhone ? (
          <div>
            <input
              type="number"
              placeholder="Phone Number"
              value={newPhone.phone_number}
              onChange={(e) =>
                setNewPhone({ ...newPhone, phone_number: e.target.value })
              }
              required
              style={{ margin: "0.5rem" }}
            />
            <input
              type="text"
              placeholder="Phone Type (e.g., work, personal)"
              value={newPhone.phone_type}
              onChange={(e) =>
                setNewPhone({ ...newPhone, phone_type: e.target.value })
              }
              required
              style={{ margin: "0.5rem" }}
            />
            <button
              onClick={handleAddPhone}
              disabled={!newPhone.phone_number || !newPhone.phone_type}
              style={{ margin: "0.5rem" }}
            >
              Add
            </button>
            <button
              style={{ margin: "0.5rem" }}
              onClick={() => setIsAddingPhone(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setIsAddingPhone(true)}>
            Add Phone Number
          </button>
        )}

        <h4 style={{ marginTop: "1rem" }}>Emails:</h4>
        <ul>
          {userInfo.emails.map((email, index) => (
            <li key={email.email}>
              {email.email_type.charAt(0).toUpperCase() +
                email.email_type.slice(1)}
              : {email.email}
              <button
                style={{ margin: "0.5rem" }}
                onClick={() => handleRemoveEmail(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {isAddingEmail ? (
          <div>
            <input
              type="email"
              placeholder="Email"
              value={newEmail.email}
              onChange={(e) =>
                setNewEmail({ ...newEmail, email: e.target.value })
              }
              required
              style={{ margin: "0.5rem" }}
            />
            <input
              type="text"
              placeholder="Email Type (e.g., work, personal)"
              value={newEmail.email_type}
              onChange={(e) =>
                setNewEmail({ ...newEmail, email_type: e.target.value })
              }
              required
              style={{ margin: "0.5rem" }}
            />
            <button
              onClick={handleAddEmail}
              disabled={!newEmail.email || !newEmail.email_type}
              style={{ margin: "0.5rem" }}
            >
              Add
            </button>
            <button
              style={{ margin: "0.5rem" }}
              onClick={() => setIsAddingEmail(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setIsAddingEmail(true)}>Add Email</button>
        )}
      </div>
    </div>
  );
}

export default UserInfo;
