import React from "react";
import {
  FaBuilding,
  FaSmile,
  FaClock,
  FaHeadset,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import CountUp from "react-countup";
import "./Stats.css";

const Stats = () => {
  return (
    /* Stats */

    <Container className="hero-stats-container mt-5">
      <Row className="hero-stats justify-content-center">
        <Col xs={6} md={3} className="text-center mb-4">
          <FaBuilding size={32} color="#ffc107" className="mb-2" />
          <h3>
            <CountUp end={500} duration={2} />+
          </h3>
          <p className="text-white">Projects Listed</p>
        </Col>
        <Col xs={6} md={3} className="text-center mb-4">
          <FaSmile size={32} color="#ffc107" className="mb-2" />
          <h3>
            <CountUp end={1000} duration={2} />+
          </h3>
          <p className="text-white">Happy Clients</p>
        </Col>
        <Col xs={6} md={3} className="text-center mb-4">
          <FaClock size={32} color="#ffc107" className="mb-2" />
          <h3>
            <CountUp end={10} duration={2} />+
          </h3>
          <p className="text-white">Years Experience</p>
        </Col>
        <Col xs={6} md={3} className="text-center mb-4">
          <FaHeadset size={32} color="#ffc107" className="mb-2" />
          <h3>24x7</h3>
          <p className="text-white">Support</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;
