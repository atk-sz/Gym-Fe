import React from "react";
import "./Home.css";
import {
  ClientsSection,
  FeaturesSection,
  HeroBanner,
  TestimonialsCarousel,
} from "../components";
import FaqSection from "../components/home12/FaqSection";

const Home = () => {
  return (
    <div id="home" className="home">
      <HeroBanner />
      <ClientsSection />
      <FeaturesSection />
      <TestimonialsCarousel />
      <FaqSection />
    </div>
  );
};

export default Home;
