import React, { useEffect, useState, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser, KeepAliveServer } from "./api/auth";
import { LoadingOutlined } from "@ant-design/icons";
import { Switch } from "react-router-dom";
import AppRoute from "./components/routes/AppRoute";
import UserRoute from "./components/routes/UserRoute";
import MainLayout from "./layouts/MainLayout";
import { css } from "@emotion/react";
import RingLoader from "react-spinners/RingLoader";
import DashboardLayout from "./layouts/DashboardLayout";

import {
  ForgotPassword,
  Login,
  Register,
  RegisterComplete,
  UserDashboard,
  Registration,
  SuperAdminDashboard,
  PendingRequests,
  PendingRequest,
  AdminDashboard,
  Attendance,
  MemberDetails,
  AllMembers,
  CalenderEvents,
  GymStatistics,
  AddManager,
  HouseMembers,
  Scanner,
  Settings,
  AllManagers,
  ManagerRegister,
} from "./views";
import { AdminRoute, AdminManagerRoute, SuperAdminRoute } from "./components";
import GymStatAndMessage from "./views/super-admin/GymStatAndMessage";

const App = () => {
  const dispatch = useDispatch();
  // to check firebase auth state

  useEffect(() => {
    // setInterval(async () => {
    //   console.log(await (await KeepAliveServer()).data);
    // }, [3000]);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                token: idTokenResult.token,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });

    // cleanup
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div style={{ position: "fixed", left: "45vw", top: "45vh" }}>
          __ P
          <LoadingOutlined />M __
        </div>
      }
    >
      <ToastContainer />
      <Switch>
        {/* approutes */}

        <AppRoute exact path="/" component={Login} layout={MainLayout} />
        <AppRoute
          exact
          path="/register"
          component={Register}
          layout={MainLayout}
        />
        <AppRoute
          exact
          path="/register/complete"
          component={RegisterComplete}
          layout={MainLayout}
        />
        <AppRoute
          exact
          path="/forgot/password"
          component={ForgotPassword}
          layout={MainLayout}
        />
        <AppRoute
          exact
          path="/register/manager"
          component={ManagerRegister}
          layout={MainLayout}
        />
        <AppRoute
          exact
          path="/gym/registration/:token"
          component={Registration}
          layout={MainLayout}
        />

        {/*UserRoutes*/}
        <UserRoute
          exact
          path="/user/dashboard"
          component={UserDashboard}
          layout={DashboardLayout}
        />
        {/* admin routes */}
        <AdminManagerRoute
          exact
          path="/admin/dashboard"
          component={AdminDashboard}
          layout={DashboardLayout}
        />
        <AdminManagerRoute
          exact
          path="/admin/attendance"
          component={Attendance}
          layout={DashboardLayout}
        />
        <AdminManagerRoute
          exact
          path="/admin/scanner"
          component={Scanner}
          layout={DashboardLayout}
        />
        <AdminManagerRoute
          exact
          path="/gym/member/:mid"
          component={MemberDetails}
          layout={DashboardLayout}
        />
        <AdminManagerRoute
          exact
          path="/gym/members/all"
          component={AllMembers}
          layout={DashboardLayout}
        />
        <AdminManagerRoute
          exact
          path="/gym/calender-of-events"
          component={CalenderEvents}
          layout={DashboardLayout}
        />
        <AdminRoute
          exact
          path="/gym/add/manager"
          component={AddManager}
          layout={DashboardLayout}
        />
        <AdminRoute
          exact
          path="/gym/managers"
          component={AllManagers}
          layout={DashboardLayout}
        />
        <AdminManagerRoute
          exact
          path="/admin/house/:hid/members"
          component={HouseMembers}
          layout={DashboardLayout}
        />
        <AdminRoute
          exact
          path="/settings"
          component={Settings}
          layout={DashboardLayout}
        />
        {/* super-admin routes */}
        <SuperAdminRoute
          exact
          path="/super-admin/dashboard"
          layout={DashboardLayout}
          component={SuperAdminDashboard}
        />
        <SuperAdminRoute
          exact
          path="/super-admin/pending-requests"
          layout={DashboardLayout}
          component={PendingRequests}
        />
        <SuperAdminRoute
          exact
          path="/pending/request/:id/details"
          layout={DashboardLayout}
          component={PendingRequest}
        />
        <SuperAdminRoute
          exact
          path="/gym/:gym_id/statistics"
          layout={DashboardLayout}
          component={GymStatistics}
        />
        <SuperAdminRoute
          exact
          path="/gym/:gym_id/statistics/message"
          layout={DashboardLayout}
          component={GymStatAndMessage}
        />
      </Switch>
    </Suspense>
  );
};

export default App;
