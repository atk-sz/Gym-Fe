import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./DashboardContentHeader.css";
import { getAllGymMembers } from "../../api/gym";
import { createOrDisplayAttendance } from "../../api/attendance";
import { getMemberCount } from "../../api/attendance";
import { loadAllEvents } from "../../api/event";
import { useSelector } from "react-redux";

const DashboardContentHeader = () => {
  const [members, setMembers] = useState(true);
  const [activeMembers, setActiveMembers] = useState(true);
  const [attendedMembers, setAttendedMembers] = useState(true);
  const [totalEvents, setTotalEvents] = useState(true);
  const { user } = useSelector((state) => ({ ...state }));
  const dateToday = new Date(new Date().setHours(0, 0, 0, 0));

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const res = await getAllGymMembers(user.token);
      const response = await createOrDisplayAttendance(user.token, dateToday);
      const respons = await getMemberCount(user.token, response.data._id);
      const events = await loadAllEvents(user.token);
      setMembers(res.data);
      setAttendedMembers(response.data.present);
      setActiveMembers(respons);
      setTotalEvents(events.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(members);
  return (
    <div className="dashboard-top-head">
      <Container>
        <Row>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Total Members</div>
                  <div className="content">{members.length}</div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Members attended today</div>
                  <div className="content">{attendedMembers.length}</div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Active Members</div>
                  <div className="content">{activeMembers.data}</div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Total Events</div>
                  <div className="content">{totalEvents.length}</div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardContentHeader;
