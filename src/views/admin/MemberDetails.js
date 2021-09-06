import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { memberDetails } from "../../api/member";
import { BarCode } from "../../components";
import "./styles/members.css";
import { Card, Row, Col, Container, Image } from "react-bootstrap";

const MemberDetails = () => {
  const { mid } = useParams();
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState({});

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
      <Row justifyContent="center">
        <Col md="8">
          <Card>
            <Card.Body>
              {loading ? (
                <h4>loading</h4>
              ) : (
                <Row className="member-details">
                  <Col md={6} className="profile-barcode">
                    <Image fluid src={member.profile} alt={member.card_id} />
                    <BarCode card_id={member.card_id} />
                  </Col>
                  <Col md={6} className="member-details-area">
                    <div className="details-text-member">
                      <div className="left-title">
                        <div className="details-label-text">Name</div>
                      </div>
                      <div className="details-info">
                        {member.fname} {member.lname}
                      </div>
                    </div>
                    <div className="details-text-member">
                      <div className="left-title">
                        <div className="details-label-text">Card Id</div>
                      </div>
                      <div className="details-info">{member.card_id}</div>
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
                    <div className="details-text-member">
                      <div className="left-title">
                        <div className="details-label-text">Age</div>
                      </div>
                      <div className="details-info">
                        {timeSince(member.DOB)}
                      </div>
                    </div>
                    <div className="details-text-member">
                      <div className="left-title">
                        <div className="details-label-text">Member Since</div>
                      </div>
                      <div className="details-info">
                        {timeSince(member.join)}
                      </div>
                    </div>
                    <div className="details-text-member">
                      <div className="left-title">
                        <div className="details-label-text">Valid Till</div>
                      </div>
                      <div className="details-info">
                        {`${new Date(member.expire).getDate()}/${new Date(
                          member.expire
                        ).getMonth()}/${new Date(member.expire).getFullYear()}`}
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MemberDetails;
