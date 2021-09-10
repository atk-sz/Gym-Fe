import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./DashboardContentHeader.css";
import { getAllGyms } from "../../api/super-admin";
import { useSelector } from "react-redux";

const DashboardSupertHeader = () => {
  const [members, setMembers] = useState(true);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const res = await getAllGyms(user.token);
      setMembers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-top-head">
      <Container>
        <Row className="justify-content-start">
          <Col md="3">
            <Card className="dashboard-head-item-card">
              <Card.Body>
                <div className="header-content">
                  <div className="head">Total Gyms</div>
                  <div className="content">{members.length}</div>
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

export default DashboardSupertHeader;
