import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "./Header.css";

const Header = () => {
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

  const goToDahboard = () => {
    if (user.role === "admin" || user.role === "manager")
      history.push('/admin/dashboard');
    else if (user.role === "super-admin")
      history.push('/super-admin/dashboard')
    else
      history.push('/user/dashboard');
  }

  return (
    <nav id="header" className="navbar navbar-expand-md shadow">
      <div className="container">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <span className="navbar-brand">Home</span>
            </Link>
          </li>
        </ul>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navmenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <div className="nav-item btn-group">
                <button
                  type="button"
                  className="btn btn-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button onClick={(e) => {
                      e.preventDefault();
                      goToDahboard();
                    }}
                      className='btn btn-light'>
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                      className='btn btn-light'>
                      {/* <Link
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLogout();
                        }}
                        className="nav-link"
                      > */}
                      Logout
                      {/* </Link> */}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
