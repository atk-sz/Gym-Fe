import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Row, Col, Card } from "react-bootstrap";
import {
  approvePendingGym,
  getPendingGym,
  rejectPendingGym,
} from "../../api/super-admin";

const PendingRequest = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState({});
  const [displayImage, setDisplayImage] = useState("");

  useEffect(() => {
    loadPendingGymDetails();
  }, []);

  const loadPendingGymDetails = () => {
    getPendingGym(id, user.token)
      .then((res) => {
        console.log(res.data);
        setRequest(res.data);
        setDisplayImage(res.data.logo);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
        console.log(err);
      });
  };

  const handleClick = (e) => {
    setDisplayImage(e.target.src);
  };

  const handleApprove = () => {
    setLoading(true);
    approvePendingGym(id, user.token)
      .then((res) => {
        toast.success(res.data);
        // setLoading(false)
        history.push("/super-admin/pending-requests");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
        console.log(err);
      });
  };

  const handleReject = () => {
    const confirm = window.prompt();
    if (confirm && confirm.trim()) {
      setLoading(true);
      rejectPendingGym(id, user.token, confirm)
        .then((res) => {
          toast.success(res.data);
          // setLoading(false)
          history.push("/super-admin/pending-requests");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(
            err.response3
              ? err.response.data
              : "Some error occured please try later"
          );
          console.log(err);
        });
    }
  };

  return (
    <div className="pending-gym-detail-div">
      <Row>
        <Col md="10">
          <Card>
            <Card.Body>
              {loading ? (
                <h1>...loading</h1>
              ) : (
                <Row>
                  <Col md="9">
                    <div className="gym-details">
                      <h1>{request.name}</h1>
                    </div>
                  </Col>
                  <Col md="3" className="images-docs">
                    <div className="preview-images">
                      {request.images.map((each, i) => (
                        <img
                          onClick={handleClick}
                          style={{
                            height: "5rem",
                            width: "7rem",
                            margin: "0 10px 50px 10px",
                          }}
                          key={i}
                          src={each}
                          alt={request.name}
                        />
                      ))}
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="images-pending-gym">
                      <div className="display-image text-center">
                        <img
                          style={{
                            marginBottom: "50px",
                          }}
                          src={displayImage}
                          alt={request.name}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col md="12">
                    <div className="docs-pending-gym text-center">
                      {request.docs.map((each, i) => (
                        <embed key={i} src={each} type="application/pdf" />
                      ))}
                    </div>
                  </Col>
                  <Col md="12" className="mt-5">
                    <Row>
                      <Col md="6">
                        <button
                          onClick={handleReject}
                          className="btn btn-danger btn-block w-100"
                        >
                          Reject
                        </button>
                      </Col>
                      <Col md="6">
                        <button
                          onClick={handleApprove}
                          className="btn btn-success btn-block w-100"
                        >
                          Approve
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PendingRequest;
