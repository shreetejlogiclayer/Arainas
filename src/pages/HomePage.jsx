import React, { useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import BrandStatement from '../components/BrandStatement/BrandStatement';
import WhyAraina from '../components/WhyAraina/WhyAraina';
import ProductShowcase from '../components/ProductShowcase/ProductShowcase';
import HealthOpportunity from '../components/HealthOpportunity/HealthOpportunity';
import OurStory from '../components/OurStory/OurStory';
import OurPurpose from '../components/OurPurpose/OurPurpose';
import MissionVision from '../components/MissionVision/MissionVision';
import Values from '../components/Values/Values';
import JoinUsComingSoon from '../components/JoinUsComingSoon/JoinUsComingSoon';
import FinalCTA from '../components/FinalCTA/FinalCTA';

const HomePage = () => {
  useEffect(() => {
    document.title = "Araina | Empowering To Rise - Feminine Hygiene & Wellness";
  }, []);

  return (
    <>
      <Hero />
      <BrandStatement />
      <WhyAraina />
      <ProductShowcase />
      <HealthOpportunity />
      <OurStory />
      <OurPurpose />
      <MissionVision />
      <Values />
      <JoinUsComingSoon />
      <FinalCTA />
    </>
  );
};

export default HomePage;
