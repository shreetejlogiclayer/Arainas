import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import BrandStatement from './components/BrandStatement/BrandStatement';
import WhyAraina from './components/WhyAraina/WhyAraina';
import ProductShowcase from './components/ProductShowcase/ProductShowcase';
import HealthOpportunity from './components/HealthOpportunity/HealthOpportunity';
import OurStory from './components/OurStory/OurStory';
import OurPurpose from './components/OurPurpose/OurPurpose';
import MissionVision from './components/MissionVision/MissionVision';
import Values from './components/Values/Values';
import JoinUsComingSoon from './components/JoinUsComingSoon/JoinUsComingSoon';
import FinalCTA from './components/FinalCTA/FinalCTA';
import Footer from './components/Footer/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'purpose', 'product', 'why-araina', 'join-us', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-araina-white text-araina-black font-unbounded selection:bg-araina-pink/20 selection:text-araina-pink">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main>
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
      </main>

      <Footer setActiveSection={setActiveSection} />
    </div>
  );
}

export default App;
