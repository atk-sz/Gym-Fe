import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import BannerImg from "../../assets/images/banner.jpg";

const HeroBanner = () => {
  return (
    <div className="hero-banner section_padding">
      <Container>
        <Row className="align-items-center">
          <Col md={6} sm={12}>
            <div className="banner-head ">
              <h1 className="banner-heading">Gym Management Software</h1>
              <h4 className="head-description">
                Manage your gym with our gym software management
              </h4>
              <div className="my-4">
                <Button className="theme-button">Get a demo</Button>
              </div>
            </div>
          </Col>
          <Col md={6} sm={12}>
            <Image src={BannerImg} fluid />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroBanner;
