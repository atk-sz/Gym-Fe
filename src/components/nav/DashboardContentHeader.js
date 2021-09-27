import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./DashboardContentHeader.css";
import { getGymDetails } from "../../api/gym";
import { createOrDisplayAttendance } from "../../api/attendance";
import { getMemberCount } from "../../api/attendance";
import { loadAllEvents } from "../../api/event";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

const DashboardContentHeader = () => {
  const [members, setMembers] = useState(true);
  const [loading, setLoading] = useState(true);
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
      const gymDetails = await getGymDetails(user.token);
      const attendanceResponse = await createOrDisplayAttendance(
        user.token,
        dateToday
      );
      const memberResponse = await getMemberCount(
        user.token,
        attendanceResponse.data._id
      );
      const events = await loadAllEvents(user.token);
      setMembers(gymDetails.data.members);
      setAttendedMembers(attendanceResponse.data.present);
      setActiveMembers(memberResponse);
      setTotalEvents(events.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-top-head">
      <Container>
        <Row>
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Total Members</div>
                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {members.length}</>
                    )}
                  </div>
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
                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {attendedMembers.length}</>
                    )}
                  </div>
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
                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {activeMembers.data}</>
                    )}
                  </div>
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
                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {totalEvents.length}</>
                    )}
                  </div>
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
