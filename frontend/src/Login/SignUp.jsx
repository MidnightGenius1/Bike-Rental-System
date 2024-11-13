import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import background from "./background.jpg";

const API_URL = "http://localhost:4000";

function SignUp() {
  const [name, setName] = useState("");
  const [phno, setPhno] = useState("");
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/sign-up`, {
        name,
        phno,
        email,
        addr,
        password,
      });
      if (response.data.success) {
        setErrorMessage("");
        navigate("/login");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
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
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="col-md-10 mx-auto col-lg-5" style={{ opacity: "0.94" }}>
        <form
          className="p-4 p-md-5 border rounded-3 bg-body-tertiary"
          onSubmit={handleSubmit}
        >
          <h1 style={{ color: "black", justifySelf: "center" }}>
            Welcome to MotoRent
          </h1>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              required="true"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="123456789"
              minLength={10}
              maxLength={10}
              required="true"
              name="phno"
              value={phno}
              onChange={(e) => {
                setPhno(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">Phone Number</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
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
              type="text"
              className="form-control"
              placeholder="Address"
              required="true"
              name="addr"
              value={addr}
              onChange={(e) => {
                setAddr(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">Address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
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
            {/*for now. later validate new user creation through database and then navigate back to login*/}
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Sign Up
            </button>
          <Link to={"/"}>
            {/*for now. later validate new user creation through database and then navigate back to login*/}
            <button className="w-100 btn btn-lg btn-dark my-1">Cancel</button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
