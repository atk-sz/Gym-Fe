import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FaqAccordion from "../../components/Faq/FaqAccordion";

const FaqSection = () => {
  return (
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
  );
};

export default FaqSection;
