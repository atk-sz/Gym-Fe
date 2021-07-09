import React from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "../LoadingToRedirect";

const UserRoute = ({ component: Component, layout: Layout, ...restProps }) => {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <>
      {user && user.token ? (
        <Route
          {...restProps}
          render={(props) => (
            <Layout>
              <Component {...props} />
            </Layout>
          )}
        />
      ) : (
        <LoadingToRedirect />
      )}
    </>
  );
};

export default UserRoute;
