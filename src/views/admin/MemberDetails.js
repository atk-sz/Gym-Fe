import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { memberDetails } from "../../api/member";
import { BarCode } from "../../components";
import "./styles/members.css";
import { Card, Row, Col, Container, Image } from "react-bootstrap";
import { css } from "@emotion/react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { CloseOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import canvasToImage from "canvas-to-image";

const IDCard = ({ member, setDisplay }) => {
  const printableAreaRef = React.useRef();

  const handleDownload = () => {
    html2canvas(printableAreaRef.current).then((canvas) => {
      canvasToImage(canvas, {
        name: "myImage",
        type: "jpg",
        quality: 1,
      });
    });
  };

  return (
    <div
      style={{
        left: "0",
        top: "0",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        zIndex: "2",
        backgroundColor: "rgba(23,23,23,0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="id-card-div"
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "white",
          height: "80%",
          width: "90%",
        }}
        className="id-card"
      >
        <CloseOutlined
          style={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={() => setDisplay(false)}
        />
        <div
          style={{
            height: "90%",
            width: "90%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
          ref={printableAreaRef}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
            className="div-a"
          >
            <div className="img-div">
              <img src={member.profile} alt={member.card_id} />
            </div>
            <div className="name-div">
              <h3>
                {member.fname} {member.lname}
              </h3>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
            className="div-b"
          >
            <div className="barcode-div">
              <BarCode card_id={member.card_id} />
            </div>
            <div className="expire-div">
              <p>
                Expires:{" "}
                {`${new Date(member.expire).getDate()}/${new Date(
                  member.expire
                ).getMonth()}/${new Date(member.expire).getFullYear()}`}
              </p>
            </div>
          </div>
        </div>

        <button
          style={{ position: "absolute", bottom: "20px", left: "50%" }}
          className="btn btn-info"
          onClick={handleDownload}
        >
          Download
        </button>
      </div>
    </div>
  );
};

const MemberDetails = () => {
  const { mid } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState({});
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const res = await memberDetails(user.token, mid);
      setMember(res.data);
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

  const timeSince = (dateString) => {
    var seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  };

  return (
    <Container className="member-detail-div">
      <Row>
        <Col md="12">
          <Card>
            <Card.Body>
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "200px", width: "100%" }}
                >
                  <ScaleLoader />
                </div>
              ) : (
                <>
                  {member && display ? (
                    <IDCard member={member} setDisplay={setDisplay} />
                  ) : (
                    ""
                  )}
                  <Row className="member-details">
                    <Col md={6} className="profile-barcode">
                      <Image fluid src={member.profile} alt={member.card_id} />
                      <BarCode card_id={member.card_id} />
                    </Col>
                    <Col md={6} className="member-details-area">
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="details-text-member">
                            <h2>
                              {member.fname} {member.lname}
                            </h2>
                          </div>
                          <div className="details-text-member">
                            <h4>{member.card_id}</h4>
                          </div>
                          <hr />
                          <div className="info-category mt-5">
                            <p>
                              <small className="text-secondary">
                                Personal Details
                              </small>
                            </p>
                          </div>
                          <div className="details-text-member">
                            <div className="left-title">
                              <div className="details-label-text">Age</div>
                            </div>
                            <div className="details-info">
                              {timeSince(member.DOB)}
                            </div>
                          </div>
                          <div className="info-category mt-5">
                            <p>
                              <small className="text-secondary">
                                Membership Details
                              </small>
                            </p>
                          </div>
                          <div className="details-text-member">
                            <div className="left-title">
                              <div className="details-label-text">House Id</div>
                            </div>
                            <div className="member-detail-house-id">
                              {member.house_id}
                              <div>
                                <Link
                                  to={`/admin/house/${member.house_id}/members`}
                                >
                                  View all
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="details-text-member">
                            <div className="left-title">
                              <div className="details-label-text">
                                Member Since
                              </div>
                            </div>
                            <div className="details-info">
                              {timeSince(member.join)}
                            </div>
                          </div>
                          <div className="details-text-member">
                            <div className="left-title">
                              <div className="details-label-text">
                                Valid Till
                              </div>
                            </div>
                            <div className="details-info">
                              {`${new Date(member.expire).getDate()}/${new Date(
                                member.expire
                              ).getMonth()}/${new Date(
                                member.expire
                              ).getFullYear()}`}
                            </div>
                          </div>
                          <div className="info-category mt-5">
                            <p>
                              <small className="text-secondary">
                                Contact Details
                              </small>
                            </p>
                          </div>
                          <div className="details-text-member">
                            <div className="left-title">
                              <div className="details-label-text">Email</div>
                            </div>
                            <div className="details-info">{member.email}</div>
                          </div>
                          <div className="details-text-member">
                            <div className="left-title">
                              <div className="details-label-text">Phone No</div>
                            </div>
                            <div className="details-info">{member.phone}</div>
                          </div>
                          <div className="details-text-member">
                            <div className="left-title">
                              <div className="details-label-text">Address</div>
                            </div>
                            <div className="details-info">
                              <div>{member.address.first_line}</div>
                              <div>{member.address.second_line}</div>
                              <div>
                                {member.address.city} - {member.address.pincode}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setDisplay(true);
                            }}
                            className="btn btn-primary float-end"
                          >
                            Generate ID
                          </button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MemberDetails;
