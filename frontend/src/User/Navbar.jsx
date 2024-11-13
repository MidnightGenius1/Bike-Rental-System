import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user_id }) {
  return (
    <div>
      <header className="p-3 text-bg-dark">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li>
                <a href={`/user/bikes/${user_id}`} className="nav-link px-2 text-white">
                  Bikes Offered
                </a>
              </li>
              <li>
                <a href={`/user/rentals/${user_id}`} className="nav-link px-2 text-white">
                  Current Rentals
                </a>
              </li>
              <li>
                <a href={`/user/info/${user_id}`} className="nav-link px-2 text-white">
                  User Info
                </a>
              </li>
              <li>
                <a href={`/user/penalty/${user_id}`} className="nav-link px-2 text-white">
                  Penalties
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
