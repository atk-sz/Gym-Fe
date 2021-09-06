import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminNav = () => {
  const { user } = useSelector(state => ({ ...state }))
  return (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/attendance" className="nav-link">
            Attendance
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/gym/members/all" className="nav-link">
            All members
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/gym/calender-of-events" className="nav-link">
            Events
          </Link>
        </li>
        {
          user.role === 'admin' && (
            <li className="nav-item">
              <Link to="/gym/add/manager" className="nav-link">
                Managers
              </Link>
            </li>
          )
        }
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

export default AdminNav;