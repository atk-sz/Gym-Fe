import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import ClientImg from "../../assets/images/banner.jpg";
import ClientImg2 from "../../assets/images/user2.jpg";
import { Carousel } from "antd";

const TestimonialsCarousel = () => {
  return (
    <Carousel className="testimonals-carousel section_padding">
      <div className="testimonal">
        <Container>
          <Row className="align-items-center justify-content-between">
            <Col md={6}>
              <div>
                <p className="testimonial-text">
                  “It easily manages everything about the gym members which
                  includes attendence, payment and their activiies. Also we can
                  manage events also”
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="testimonial-details">
                <div className="text-center">
                  <Image src={ClientImg} fluid />
                  <div className="testimonial-details-text mt-4">
                    <h5>Rahul Singh</h5>
                    <h6>Owner : Fitness Club</h6>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="testimonal">
        <Container>
          <Row className="align-items-center justify-content-between">
            <Col md={6}>
              <div>
                <p className="testimonial-text">
                  “This is an amazing software which easily manages your gym in
                  a very efficient way also it reduced my 90% workload”
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="testimonial-details">
                <div className="text-center">
                  <Image src={ClientImg2} fluid />
                  <div className="testimonial-details-text mt-4">
                    <h5>Natasha</h5>
                    <h6>Owner : Fitness Club</h6>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Carousel>
  );
};

export default TestimonialsCarousel;
