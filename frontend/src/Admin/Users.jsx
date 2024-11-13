import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const API_URL = "http://localhost:4001";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <center>
      <h1>User Details</h1>
      <table className="table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
      </center>
    </div>
  );
}

export default Users;
