import React from 'react'
import { motion, easeOut } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, Zap, Shield, TrendingUp, Heart, Award } from 'lucide-react'

type FeatureItem = {
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
  title: string;
  description: string;
  color: string;
};

const Features: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features: FeatureItem[] = [
    {
      icon: Users,
      title: 'Direct Connections',
      description: 'Connect directly with founders at top startups - no third party recruiters.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Fast Applications',
      description: 'One click to apply and you\'re done. Say goodbye to cover letters.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Transparent Info',
      description: 'View salary, stock options, and benefits before you apply.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Join fast-growing companies where your impact matters from day one.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Heart,
      title: 'Culture Match',
      description: 'Find companies that align with your values and work style.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Award,
      title: 'Top Opportunities',
      description: 'Access exclusive opportunities from funded startups and tech giants.',
      color: 'from-indigo-500 to-blue-500',
    },
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  }

  return (
    <section className="py-24 bg-white" id="discover">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why <span className="text-gradient">Job Seekers</span> Love Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to find your dream job and connect with innovative companies
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 card-hover group"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
