import React from 'react'
import Navbar from '../components/common/Navbar'
import Hero from '../components/welcome/Hero'
import Features from '../components/welcome/Features'
import Stats from '../components/welcome/Stats'
import Testimonials from '../components/welcome/Testimonials'
import CTASection from '../components/welcome/CTASection'
import Footer from '../components/common/Footer'

const Welcome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  )
}

export default Welcome
