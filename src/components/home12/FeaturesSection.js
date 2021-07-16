import React from "react";
import DashboardImg from "../../assets/images/dashboard.png";
import { Container, Row, Col, Image } from "react-bootstrap";

const FeaturesSection = () => {
  return (
    <div className="features-section section_padding">
      <Container>
        <Row className="justify-content-center ">
          <Col md={6}>
            <div className="text-center mb-5">
              <h2>What Experience will you get ?</h2>
              <p className="head-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="feature-bg">
        <Container>
          <Row className="align-items-center justify-content-between mb-5">
            <Col md={6} sm={12}>
              <div>
                <h3>Manage Members</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua
                </p>
              </div>
            </Col>
            <Col md={5} sm={12}>
              <div>
                <Image src={DashboardImg} fluid />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="feature-bg-2">
        <Container>
          <Row className="align-items-center justify-content-between">
            <Col md={5} sm={12}>
              <div>
                <Image src={DashboardImg} fluid />
              </div>
            </Col>
            <Col md={6} sm={12}>
              <div>
                <h3>Attendence Tracking</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="feature-bg">
        <Container>
          <Row className="align-items-center justify-content-between mb-5">
            <Col md={6} sm={12}>
              <div>
                <h3>Event Management</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua
                </p>
              </div>
            </Col>
            <Col md={5} sm={12}>
              <div>
                <Image src={DashboardImg} fluid />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="feature-bg-2">
        <Container>
          <Row className="align-items-center justify-content-between">
            <Col md={5} sm={12}>
              <div>
                <Image src={DashboardImg} fluid />
              </div>
            </Col>
            <Col md={6} sm={12}>
              <div>
                <h3>Email Reminder</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default FeaturesSection;
