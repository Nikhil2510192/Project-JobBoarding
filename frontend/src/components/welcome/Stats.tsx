import React, { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface AnimatedCounterProps {
  end: number;
  suffix: string;
}

const AnimatedCounter: FC<AnimatedCounterProps> = ({ end, suffix }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const Stats: FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const stats: StatItem[] = [
    { value: 8, suffix: "M+", label: "Matches Made" },
    { value: 150, suffix: "K+", label: "Tech Jobs" },
    { value: 10, suffix: "M+", label: "Startup Ready Candidates" },
    { value: 25, suffix: "K+", label: "Companies Hiring" },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Trusted by Millions</h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Join the largest community of startup talent and innovative companies
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl sm:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-white">
                {inView && <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
              </div>
              <p className="text-lg text-primary-100 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
