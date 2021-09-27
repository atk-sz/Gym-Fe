import React from "react";
import DashboardHeader from "../components/nav/DashboardHeader";
import "./Dashboard.css";
import { useSelector } from "react-redux";
import DashboardSupertHeader from "../components/nav/DashboardSuperHeader";

const DashboardLayout = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <div>
      <header>
        <DashboardHeader />
      </header>
      <div className="site-layout-background">
        {user.role == "admin" ? null : user.role == "super-admin" ? (
          <DashboardSupertHeader />
        ) : null}
        <div
          className="content-area"
          style={{
            margin: "24px 16px",
            padding: 24,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
