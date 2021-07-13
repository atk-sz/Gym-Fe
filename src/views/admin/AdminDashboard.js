import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AdminNav } from "../../components";

const AdminDashboard = () => {
  const { user } = useSelector(state => ({ ...state }))
  const [loading, setLoading] = useState(false)

  return (
    <div className="container-fluid admin-dashboard-div">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10 text-center">
          {
            loading ? <h1>..loading</h1> : (
              <>
                <h1>Super admin dahboard</h1>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
