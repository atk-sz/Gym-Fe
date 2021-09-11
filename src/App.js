import React, { useEffect, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./api/auth";
import { LoadingOutlined } from "@ant-design/icons";
import { Switch } from "react-router-dom";
import AppRoute from "./components/routes/AppRoute";
import UserRoute from "./components/routes/UserRoute";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import {
  ForgotPassword,
  Home,
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
  AddMember,
  MemberDetails,
  AllMembers,
  CalenderEvents,
  GymStatistics,
  AddManager,
  HouseMembers,
} from "./views";
import { AdminRoute, AdminManagerRoute, SuperAdminRoute } from "./components";
import GymStatAndMessage from "./views/super-admin/GymStatAndMessage";

const App = () => {
  const dispatch = useDispatch();

  // to check firebase auth state

  useEffect(() => {
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
        <AppRoute exact path="/" component={Home} layout={MainLayout} />
        <AppRoute exact path="/login" component={Login} layout={MainLayout} />
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
          path="/gym/add/member"
          component={AddMember}
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
        <AdminManagerRoute
          exact
          path="/admin/house/:hid/members"
          component={HouseMembers}
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
