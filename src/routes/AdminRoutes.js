import React from "react";
import { Switch } from "react-router";
import { AdminRoute } from "../components";
import { AdminDashboard } from "../views";

const AdminRoutes = () => {
  return (
    <Switch>
      <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
    </Switch>
  );
};

export default AdminRoutes;
