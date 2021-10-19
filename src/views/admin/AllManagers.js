import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getManagers } from "../../api/admin";

const AllManagers = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [managers, setMangers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      setLoading(true);
      const res = await getManagers(user.token);
      setMangers(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  return (
    <div>
      {loading ? (
        <h1>loading...</h1>
      ) : (
        <div>
          <h1>All managers</h1>
          <div className="add-manager-div">
            <Link to="/gym/add/manager" className="nav-link">
              <button className="btn btn-primary">Add Manager</button>
            </Link>
          </div>
          <div className="all-managers">
            {managers.length ? (
              managers.map((each, i) => {
                return (
                  <div key={i} className="each-manager">
                    <h4>
                      {each.fname} {each.lname}
                    </h4>
                    <hr />
                  </div>
                );
              })
            ) : (
              <h3>No managersyet</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllManagers;
