import React from 'react'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stat from './components/Stat';
import Features from './components/Features';
import Steps from './components/Steps';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stat />
      <Features />
      <Steps />
    </div>
  )
}

export default HomePage;
