import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "../LoadingToRedirect";
import { currentAdminOrManager } from "../../api/auth";

const AdminManagerRoute = ({
  component: Component,
  layout: Layout,
  ...restProps
}) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdminOrManager(user.token)
        .then((result) => {
          setOk(true);
        })
        .catch((error) => {
          setOk(false);
          console.log(error);
        });
    }
  }, [user]);

  return (
    <>
      {ok && user.token ? (
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

export default AdminManagerRoute;
