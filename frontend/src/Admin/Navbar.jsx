import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <header className="p-3 text-bg-dark">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <a href="/admin/bikes" className="nav-link px-2 text-white">
                  Bike Status
                </a>
              </li>
              <li>
                <a href="/admin/rentals" className="nav-link px-2 text-white">
                  Rentals
                </a>
              </li>
              <li>
                <a href="/admin/user-list" className="nav-link px-2 text-white">
                  Users
                </a>
              </li>
              <li>
                <a href="/admin/penalties" className="nav-link px-2 text-white">
                  Penalties
                </a>
              </li>
              <li>
                <a href="/admin/transactions" className="nav-link px-2 text-white">
                  Transaction History
                </a>
              </li>
              <li>
                <a href="/admin/rental-payments" className="nav-link px-2 text-white">
                  Rental Payments
                </a>
              </li>
            </ul>

            <div className="text-end">
              <Link to={"/"}>
                <button type="button" className="btn btn-danger">
                  Logout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
