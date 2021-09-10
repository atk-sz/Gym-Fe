import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Row, Col, Image, Card } from "react-bootstrap";

import { getGymStats, superAdminSendMailToMember } from "../../api/super-admin";

const GymStatAndMessage = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [message, setMessage] = useState("");
  const [memberDetails, setMemberDetails] = useState({});
  const [gym, setGym] = useState({});
  const { gym_id } = useParams();
  useEffect(() => {
    getGymStats(user.token, gym_id)
      .then((res) => {
        setGym(res.data);
        setMemberDetails(res.data.members[0]);
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          err.response
            ? err.response.data
            : "Some error occured please try later"
        );
      });
  }, []);

  const selectMemberDetails = async (memberID) => {
    const foundMember = gym.members.find((element) => element._id === memberID);
    setMemberDetails(foundMember);
  };

  const handleSendMail = async (e) => {
    e.preventDefault();
    try {
      const res = await superAdminSendMailToMember(
        user.token,
        message,
        memberDetails.email
      );
      setMessage("");
      toast.success(res.data);
    } catch (err) {
      toast.error(
        err.response ? err.response.data : "Some error occured please try later"
      );
      console.log(err);
    }
  };

  return (
    <div>
      <div className="gym-stats-overview">
        <Card>
          <Card.Body>
            <Row className="super-admin-gym-member-check align-items-start justify-content-between">
              <Col
                md="3"
                className="card super-admin-gym-members"
                style={{
                  maxHeight: "600px",
                  overflow: "auto",
                }}
              >
                <div className="card-header text-center">
                  <h5>MEMBERS</h5>
                </div>
                <ul className="list-group list-group-flush">
                  {gym.members && gym.members.length
                    ? gym.members.map((each, i) => (
                        <li
                          key={i}
                          onClick={() => selectMemberDetails(each._id)}
                          className="list-group-item text-center"
                          style={{ cursor: "pointer" }}
                        >
                          {each.fname} {each.lname}
                        </li>
                      ))
                    : ""}
                </ul>
              </Col>
              <Col md="8" className="super-admin-member-details">
                <Card>
                  <Card.Body>
                    <Row className="align-items-start">
                      <Col md="6" className="super-admin-member-details">
                        <div className="member-details">
                          <h3>
                            {memberDetails.fname} {memberDetails.lname}
                          </h3>
                          <h6>Email: {memberDetails.email}</h6>
                          <h6>Phone: {memberDetails.phone}</h6>
                          <h6>Card Id: {memberDetails.card_id}</h6>
                        </div>
                        <form
                          onSubmit={handleSendMail}
                          className="super-send-mail-member"
                        >
                          <textarea
                            style={{ resize: "none", width: "100%" }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="5"
                            required
                          ></textarea>
                          <button className="btn btn-primary btn-block w-100">
                            Send
                          </button>
                        </form>
                      </Col>
                      <Col md="6" className="super-admin-member-photo">
                        <Image
                          fluid
                          style={{ textAlign: "center", maxHeight: "400px" }}
                          src={memberDetails.profile}
                          alt={`${memberDetails.fname} ${memberDetails.lname}`}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default GymStatAndMessage;
