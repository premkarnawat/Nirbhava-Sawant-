'use client';
import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import ScrollProgress from '@/components/ScrollProgress';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import ProjectsSection from '@/components/ProjectsSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import ResumeSection from '@/components/sections/ResumeSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('splash_seen');
    if (!seen) { setShowSplash(true); } else { setReady(true); }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splash_seen', '1');
    setShowSplash(false);
    setReady(true);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div style={{ opacity:ready?1:0, transition:'opacity 0.6s ease', pointerEvents:ready?'auto':'none' }}>
        <ScrollProgress />
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ExperienceSection />
          <EducationSection />
          <ProjectsSection />
          <CertificationsSection />
          <ResumeSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
