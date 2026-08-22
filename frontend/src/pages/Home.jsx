import React from 'react';
import { useOutletContext } from 'react-router-dom';
import HomeHero from '../components/sections/HomeHero';
import HomeStory from '../components/sections/HomeStory';
import HomeMenu from '../components/sections/HomeMenu';
import HomeGallery from '../components/sections/HomeGallery';
import HomeCTA from '../components/sections/HomeCTA';

const Home = () => {
  const context = useOutletContext();
  const introFinished = context?.introFinished ?? true;

  return (
    <main className="bg-caveno-black text-caveno-cream min-h-screen">
      {/* 1. Kinetic Hero with Scroll-Zoom Video Mask */}
      <HomeHero introFinished={introFinished} />

      {/* 2. Asymmetrical Magazine Story & Parallax */}
      <HomeStory />

      {/* 3. Interactive Spotlight Accordion Menu Preview */}
      <HomeMenu />

      {/* 4. Pinned Horizontal Gallery with 3D Inner Parallax */}
      <HomeGallery />

      {/* 5. Luxury Velvet Reservation CTA with Quick-Picker */}
      <HomeCTA />
    </main>
  );
};

export default Home;
