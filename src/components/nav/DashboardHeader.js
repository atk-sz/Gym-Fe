import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "./DashboardHeader.css";

const DashboardHeader = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const handleLogout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };

  return (
    <nav id="header" className="navbar navbar-expand-md bg-light navbar-light">
      <div className="container">
        <div className="collapse navbar-collapse " id="navmenu">
          <ul className="navbar-nav ms-auto align-items-center">
            <div className="nav-item btn-group">
              <button
                type="button"
                className="btn dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="nav-link"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;
