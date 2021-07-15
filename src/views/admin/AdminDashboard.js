import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AdminNav } from "../../components";

const AdminDashboard = ({ history }) => {
  const { user } = useSelector(state => ({ ...state }))
  const [loading, setLoading] = useState(false)

  return (
    <div className="container-fluid admin-dashboard-div">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {
            loading ? <h1>..loading</h1> : (
              <>
                <h1 className="text-center">admin dahboard</h1>
                <button onClick={e=>history.push('/gym/add/member')} className="btn btn-primary">Add a new member</button>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
