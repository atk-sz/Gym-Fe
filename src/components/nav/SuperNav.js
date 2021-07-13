import React from 'react';
import { Link } from "react-router-dom";

const SuperNav = () => {
  return (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/super-admin/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/super-admin/pending/gyms" className="nav-link">
            Pending
          </Link>
        </li>
{/* 
        <li className="nav-item">
          <Link to="/user/password" className="nav-link">
            Password
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/partner/request" className="nav-link">
            Partner with us
          </Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default SuperNav;