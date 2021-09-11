import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllGyms } from "../../api/super-admin";

const SuperAdminDashboard = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [gyms, setGyms] = useState([]);

  useEffect(() => {
    getAllGyms(user.token)
      .then((res) => {
        setGyms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
      });
  }, []);

  return (
    <div className="container-fluid superadmin-dashboard-div">
      <div className="row">
        <div className="col-md-12">
          <Card>
            <Card.Body>
              <h2 className="mb-4">All Gyms</h2>
              <div className="all-gyms-div">
                {loading ? (
                  <h4>..loading</h4>
                ) : (
                  <Row>
                    {gyms && gyms.length ? (
                      gyms.map((each, i) => (
                        <Col md="4" key={i}>
                          <Card style={{ minHeight: "100%" }}>
                            <Card.Body>
                              <img
                                src={each.logo}
                                className="card-img-top"
                                alt={each.name}
                              />
                              <div className="card-body">
                                <h5 className="card-title">{each.name}</h5>
                                <p className="card-text">Phone: {each.phone}</p>
                                <p className="card-text">
                                  Total Members: {each.members.length}
                                </p>
                                <Link
                                  className="btn btn-primary"
                                  to={`/gym/${each._id}/statistics`}
                                >
                                  View Stats
                                </Link>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <h5>No gyms yet</h5>
                    )}
                  </Row>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
