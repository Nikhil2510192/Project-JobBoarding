import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'TechStartup Inc.',
      image: '👩‍💻',
      quote: 'I found my dream job at a startup through Job Boarding Platform. The process was seamless and I connected directly with the founders!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'InnovateCo',
      image: '👨‍💼',
      quote: 'Best platform for startup jobs. No middlemen, transparent salary info, and amazing companies. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'DesignHub',
      image: '👩‍🎨',
      quote: 'The culture fit feature helped me find a company that truly aligns with my values. Couldn\'t be happier!',
      rating: 5,
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            What Our <span className="text-gradient">Users Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from people who found their dream opportunities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative card-hover"
            >
              <Quote className="absolute top-6 right-6 text-primary-200" size={48} />
              
              <div className="flex items-center mb-6">
                <div className="text-5xl mr-4">{testimonial.image}</div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-primary-600 font-medium">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
