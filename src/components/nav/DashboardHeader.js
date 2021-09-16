import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "./DashboardHeader.css";
import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";
import { Menu } from "antd";
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
        <div className="logo-area ">
          <Link to="/">Logo</Link>
        </div>
        <div className="collapse navbar-collapse " id="navmenu">
          <ul className="navbar-nav align-items-center w-100">
            <div className="nav-item btn-group d-flex justify-content-between w-100">
              {user.role == "admin" ? (
                <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
                  <Menu.Item key="1" icon={<AiIcons.AiOutlineDashboard />}>
                    <Link to="/admin/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2" icon={<AiIcons.AiOutlineCalendar />}>
                    <Link to="/admin/attendance" className="nav-link">
                      Attendance
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="4" icon={<FiIcons.FiUsers />}>
                    <Link to="/gym/members/all" className="nav-link">
                      All Members
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="5" icon={<AiIcons.AiOutlineCalendar />}>
                    <Link to="/gym/calender-of-events" className="nav-link">
                      Events
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="6" icon={<AiIcons.AiOutlineUserAdd />}>
                    <Link to="/gym/add/manager" className="nav-link">
                      Managers
                    </Link>
                  </Menu.Item>
                </Menu>
              ) : user.role == "super-admin" ? (
                <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
                  <Menu.Item key="1" icon={<AiIcons.AiOutlineDashboard />}>
                    <Link to="/super-admin/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2" icon={<AiIcons.AiOutlineFieldTime />}>
                    <Link
                      to="/super-admin/pending-requests"
                      className="nav-link"
                    >
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
