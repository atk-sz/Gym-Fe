import React from "react";
import "./Home.css";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import BannerImg from "../assets/images/banner.jpg";
import DashboardImg from "../assets/images/dashboard.png";
import Gym1 from "../assets/images/gym1logo.png";
import Gym2 from "../assets/images/gym2logo.png";
import Gym3 from "../assets/images/gym3logo.png";
import Gym4 from "../assets/images/gym4logo.png";
import ClientImg from "../assets/images/banner.jpg";
import ClientImg2 from "../assets/images/user2.jpg";
import { Carousel } from "antd";
import FaqAccordion from "../components/Faq/FaqAccordion";

const Home = () => {
  return (
    <div id="home" className="home">
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
      <div className="features-section section_padding">
        <Container>
          <Row className="justify-content-center ">
            <Col md={6}>
              <div className="text-center mb-5">
                <h2>What Experience will you get ?</h2>
                <p className="head-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
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
                    aliquaLorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua
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
                    aliquaLorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua
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
                    aliquaLorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua
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
                    aliquaLorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <div>
        <Carousel className="testimonals-carousel section_padding">
          <div className="testimonal">
            <Container>
              <Row className="align-items-center justify-content-between">
                <Col md={6}>
                  <div>
                    <p className="testimonial-text">
                      “It easily manages everything about the gym members which
                      includes attendence, payment and their activiies. Also we
                      can manage events also”
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
                      “This is an amazing software which easily manages your gym
                      in a very efficient way also it reduced my 90% workload”
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
      </div>
      <div className="faq-section section_padding">
        <Container>
          <div className="text-center mb-4">
            <h2>Frequently Asked Questions</h2>
          </div>
          <Row className="justify-content-center">
            <Col md={10}>
              <FaqAccordion
                header="How does it helps managing members of the gym?"
                key="1"
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua "
              />
              <FaqAccordion
                header="How does it helps managing members of the gym?"
                key="2"
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua"
              />
              <FaqAccordion
                header="How does it helps managing members of the gym?"
                key="3"
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua"
              />
              <FaqAccordion
                header="How does it helps managing members of the gym?"
                key="4"
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                do eiusmod tempor incididunt ut labore et dolore magna aliqua"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
