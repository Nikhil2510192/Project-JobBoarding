import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import Button from '../common/Button'
import { Link } from "react-router-dom";

interface CardItem {
  icon: string;
  title: string;
  count: string;
}

const cardItems: CardItem[] = [
  { icon: '🚀', title: 'Startups', count: '10K+' },
  { icon: '💼', title: 'Tech Jobs', count: '150K+' },
  { icon: '🎯', title: 'Candidates', count: '10M+' },
];

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-200/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Where <span className="text-gradient">Startups</span> and{' '}
            <span className="text-gradient">Job Seekers</span> Connect
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Discover amazing opportunities at innovative companies. Your dream job is just a click away.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/signup/company">
              <Button size="lg" className="group">
                Find Your Next Hire
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </Link>
            <Link to="/signup/user">
              <Button variant="outline" size="lg" className="group">
                Find Your Next Job
                <Search className="inline ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>

          {/* Animated Cards Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {cardItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 card-hover"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{item.count}</h3>
                  <p className="text-gray-600 font-medium">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary-600 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-primary-600 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
