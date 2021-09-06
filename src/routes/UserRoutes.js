import React from "react";
import { UserRoute } from "../components";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  NewTeacher,
  AddInstitue,
  UserDashboard,
  MyClasses,
  MyClassroom,
  MyClass,
} from "../views";

const UserRoutes = () => {
  return (
    <>
      <UserRoute
        exact
        path="/add-my-institute"
        component={AddInstitue}
        layout={DashboardLayout}
      />
      <UserRoute
        exact
        path="/teacher/:token/form"
        component={NewTeacher}
        layout={DashboardLayout}
      />
      <UserRoute
        exact
        path="/user/dashboard"
        component={UserDashboard}
        layout={DashboardLayout}
      />
      <UserRoute
        exact
        path="/user/classes"
        component={MyClasses}
        layout={DashboardLayout}
      />
      <UserRoute
        exact
        path="/my/:id/classroom"
        component={MyClassroom}
        layout={DashboardLayout}
      />
      <UserRoute
        exact
        path="/my/:id/class"
        component={MyClass}
        layout={DashboardLayout}
      />
    </>
  );
};

export default UserRoutes;
