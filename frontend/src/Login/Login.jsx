import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import background from "./background.jpg";
const API_URL = "http://localhost:4000";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      if (response.data.success) {
        const user_id = response.data.userID;
        navigate(`/user/bikes/${user_id}`);
      }
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="col-md-10 mx-auto col-lg-5" style={{ opacity: "0.94" }}>
        <form
          className="p-4 p-md-5 border rounded-3 bg-body-tertiary"
          onSubmit={handleSubmit}
        >
          <h1 style={{ color: "black", justifySelf: "center" }}>
            Welcome to MotoRent
          </h1>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              required="true"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              required="true"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="checkbox mb-3"></div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Login
          </button>
          <Link to={"/sign-up"}>
            <button className="w-100 btn btn-lg btn-dark my-1">Sign Up</button>
          </Link>
          <Link to={"/admin-login"}>
            <button className="w-100 btn btn-lg btn-dark my-1">
              Admin Login
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
