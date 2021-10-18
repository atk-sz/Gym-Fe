import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./DashboardContentHeader.css";
import { getGymDetails } from "../../api/gym";
import { createOrDisplayAttendance } from "../../api/attendance";
import { getMemberCount } from "../../api/attendance";
import { loadEventsPerWeek } from "../../api/event";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

const DashboardContentHeader = ({ att, totalCount, presentCount }) => {
  const [loading, setLoading] = useState(false);
  const [activeMembers, setActiveMembers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const events = await loadEventsPerWeek(user.token);
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
                  <div className="sub-head">
                    <p>Total Members</p>
                  </div>

                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {totalCount}</>
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
                  <div className="sub-head">
                    <p>Members attended today</p>
                  </div>

                  <div className="content">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 0 }} />
                    ) : (
                      <> {presentCount}</>
                    )}
                  </div>
                </div>
                <div className="icon-section"></div>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="sub-head">
                    <p>Active Members</p>
                  </div>

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
          </Col> */}
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="sub-head">
                    <p>Events this week</p>
                  </div>

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
