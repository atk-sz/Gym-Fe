import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./DashboardContentHeader.css";
import { loadEventsPerWeek } from "../../api/event";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

const DashboardContentHeader = ({ att, totalCount, presentCount }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const events = await loadEventsPerWeek(user.token);
      setEvents(events.data);
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
                      <> {events.length}</>
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
