import React from "react";
import { Route } from "react-router-dom";
const UserRoute = ({ component: Component, layout: Layout, ...restProps }) => {
  return (
    <>
      <Route
        {...restProps}
        render={(props) => (
          <Layout>
            <Component {...props} />
          </Layout>
        )}
      />
    </>
  );
};

export default UserRoute;
