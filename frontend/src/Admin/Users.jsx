import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const API_URL = "http://localhost:4001";

function Users() {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-user-count`);
        setUserCount(response.data.userCount);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUsers();
    fetchUserCount();
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
        <h4>Number of Users: {userCount}</h4>
      </center>
    </div>
  );
}

export default Users;
