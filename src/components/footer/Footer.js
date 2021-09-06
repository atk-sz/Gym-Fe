import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPaperPlane,
} from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="section_padding">
      <Container>
        <Row>
          <Col lg={3} md={6}>
            <p className="font-italic">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt.
            </p>
            <ul className="d-flex mt-4 social-links">
              <li className="list-inline-item">
                <Link to="#" target="_blank" title="twitter">
                  <FaFacebookF />
                </Link>
              </li>

              <li className="list-inline-item">
                <Link to="#" target="_blank" title="instagram">
                  <FaInstagram />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="#" target="_blank" title="Twitter">
                  <FaTwitter />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="#" target="_blank" title="LinkedIn">
                  <FaLinkedinIn />
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="text-uppercase font-weight-bold mb-4">
              Usefull Links
            </h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="#" className="text-white">
                  Link
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white">
                  Link
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white">
                  Link
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white">
                  Links
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="text-uppercase font-weight-bold mb-4">Company</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="#" className="text-white">
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white">
                  Register
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white">
                  Wishlist
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white">
                  Our Products
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h6 className="text-uppercase font-weight-bold mb-4">Newsletter</h6>
            <p className="text-white mb-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. At
              itaque temporibus.
            </p>
            <div className="p-1 rounded border">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  aria-describedby="button-addon1"
                  className="form-control border-0 shadow-0"
                />
                <div className="input-group-append">
                  <button
                    id="button-addon1"
                    type="submit"
                    className="btn btn-link"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
