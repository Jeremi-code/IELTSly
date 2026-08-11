"use client";

import React from 'react'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Steps from './components/Steps';
import Footer from './components/Footer';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <Footer />
    </div>
  )
}

export default HomePage;
