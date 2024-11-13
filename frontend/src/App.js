import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Login/Login';
import SignUp from "./Login/SignUp";
import AdminLogin from "./Login/AdminLogin";
import AdminBikes from "./Admin/AdminBikes";
import AdminRentals from "./Admin/AdminRentals";
import Penalties from "./Admin/Penalties";
import RentalPayments from "./Admin/RentalPayments";
import Transactions from "./Admin/Transactions";
import Users from "./Admin/Users";
import Bikes from "./User/Bikes";
import UserInfo from "./User/UserInfo";
import Penalty from "./User/Penalty";
import Rent from "./User/Rent";
import Rentals from "./User/Rentals";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/admin/bikes" element={<AdminBikes />} />
      <Route path="/admin/rentals" element={<AdminRentals />} />
      <Route path="/admin/user-list" element={<Users />} />
      <Route path="/admin/penalties" element={<Penalties />} />
      <Route path="/admin/transactions" element={<Transactions />} />
      <Route path="/admin/rental-payments" element={<RentalPayments />} />
      <Route path="/user/bikes/:user_id" element={<Bikes />} />
      <Route path="/user/info/:user_id" element={<UserInfo />} />
      <Route path="/user/penalty/:user_id" element={<Penalty />} />
      <Route path="/user/rent/:user_id" element={<Rent />} />
      <Route path="/user/rentals/:user_id" element={<Rentals />} />
      </Routes>
    </Router>
  );
}

export default App;
