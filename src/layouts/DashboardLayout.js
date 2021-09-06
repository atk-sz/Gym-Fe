import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/nav/DashboardHeader";
import "./Dashboard.css";
import DashboardContentHeader from "../components/nav/DashboardContentHeader";
import { useSelector } from "react-redux";
import DashboardSupertHeader from "../components/nav/DashboardSuperHeader";

const { Sider, Content, Header } = Layout;

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { user } = useSelector((state) => ({ ...state }));

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="sm">
        <div className="logo text-center py-3">
          <span className="navbar-brand">Logo</span>
        </div>
        {user.role == "admin" ? (
          <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
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
            <Menu.Item key="3" icon={<AiIcons.AiOutlineUserAdd />}>
              <Link to="/gym/add/member" className="nav-link">
                Add Member
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
              <Link to="/super-admin/pending-requests" className="nav-link">
                Pending Request
              </Link>
            </Menu.Item>
          </Menu>
        ) : null}
      </Sider>
      <Layout className="site-layout">
        <Header className="d-flex">
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <DashboardHeader />
        </Header>
        <Content className="site-layout-background">
          {user.role == "admin" ? (
            <DashboardContentHeader />
          ) : user.role == "super-admin" ? (
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
