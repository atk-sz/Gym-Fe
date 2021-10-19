import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "./DashboardHeader.css";
import { getGymDetails } from "../../api/gym";
import { Menu } from "antd";
import { ScaleLoader } from "react-spinners";

const DashboardHeader = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const [gymDetail, setGymDetail] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogoandGymName();
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/");
  };

  const getLogoandGymName = async () => {
    try {
      const res = await getGymDetails(user.token);
      setGymDetail(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <nav id="header" className="navbar navbar-expand-md bg-light">
      <div className="container">
        {loading ? (
          <div style={{ textAlign: "center" }} colSpan="5">
            <ScaleLoader />
          </div>
        ) : (
          <div className="d-flex justify-content-between align-items-center w-100">
            {user.role == "admin" || user.role == "manager" ? (
              <>
                <div className="logo-area d-flex align-items-center">
                  <Link to="/" style={{ marginRight: "20px" }}>
                    <img src={gymDetail.logo} style={{ maxHeight: "60px" }} />
                  </Link>
                  <div className="gym-name-area">{gymDetail.name}</div>
                </div>
                <Menu className="d-flex " defaultSelectedKeys={["1"]}>
                  <Menu.Item key="1">
                    <Link to="/admin/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/admin/attendance" className="nav-link">
                      Attendance
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="4">
                    <Link to="/gym/members/all" className="nav-link">
                      All Members
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link to="/gym/calender-of-events" className="nav-link">
                      Events
                    </Link>
                  </Menu.Item>
                </Menu>
              </>
            ) : user.role == "super-admin" ? (
              <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1">
                  <Link to="/super-admin/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/super-admin/pending-requests" className="nav-link">
                    Pending Request
                  </Link>
                </Menu.Item>
              </Menu>
            ) : null}
            <button
              type="button"
              className="btn dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.name}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {user.role === "admin" && (
                <li>
                  <Link to="/settings" className="nav-link">
                    Settings
                  </Link>
                </li>
              )}
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
        )}
      </div>
    </nav>
  );
};

export default DashboardHeader;
