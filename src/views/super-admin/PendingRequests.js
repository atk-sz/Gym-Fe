import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getPendingReqs } from "../../api/super-admin";

const PendingRequests = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadPendingReqs();
  }, []);

  const loadPendingReqs = () => {
    getPendingReqs(user.token)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // setLoading(false);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
        console.log(err);
      });
  };
  return (
    <div className="container pending-reqs-div">
      <div className="row">
        <div className="col-md-10 text-center">
          {loading ? (
            <h4>..loading</h4>
          ) : (
            <>
              <div className="row justify-content-start">
                <div className="col-md-4">
                  {requests && requests.length ? (
                    requests.map((each, i) => {
                      return (
                        <div key={i} className="card">
                          <img
                            className="card-img-top"
                            src={each.logo}
                            alt={each.shop_name}
                          />
                          <div className="card-body">
                            <h5 className="card-title">{each.name}</h5>
                            <p className="card-text">{each.phone}</p>
                            <button
                              onClick={() =>
                                history.push(
                                  `/pending/request/${each._id}/details`
                                )
                              }
                              className="btn btn-primary"
                            >
                              View details
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h5>There are no pending requests</h5>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;
