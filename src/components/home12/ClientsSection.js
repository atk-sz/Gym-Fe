import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import Gym1 from "../../assets/images/gym1logo.png";
import Gym2 from "../../assets/images/gym2logo.png";
import Gym3 from "../../assets/images/gym3logo.png";
import Gym4 from "../../assets/images/gym4logo.png";

const ClientsSection = () => {
  return (
    <div className="clients-section section_padding bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="text-center">
              <h2>Our Clients</h2>
              <p className="head-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </p>
            </div>
          </Col>
        </Row>
        <Row className="align-items-center justify-content-around">
          <Col md={2}>
            <Image src={Gym1} fluid />
          </Col>
          <Col md={2}>
            <Image src={Gym2} fluid />
          </Col>
          <Col md={2}>
            <Image src={Gym3} fluid />
          </Col>
          <Col md={2}>
            <Image src={Gym4} fluid />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClientsSection;
