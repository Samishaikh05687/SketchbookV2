import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, Variants, Transition } from 'framer-motion';

function StepsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.6,
      } as Transition,
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' } as Transition,
    },
  };

  const steps = [
    {
      number: 1,
      title: 'Create Your Room',
      description: 'Jump into the dashboard, generate a unique room, and personalize your display name.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Invite Your Team',
      description: 'Share the room link and watch your teammates join instantly from any device.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Sketch Together',
      description: 'Unleash creativity with real-time drawing, live cursors, and collaborative tools.',
      icon: (
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="steps" className="py-40 rounded-3xl bg-orange-300 bg-opacity-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl  font-serif text-gray-900 "
          >
            Start Creating in 3 Bold Steps
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-6  text-lg sm:text-xl text-gray-600 max-w-xl mx-auto"
          >
            Transform ideas into reality with SketchBook’s seamless collaboration platform.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className=" grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="mt-10 relative p-8 rounded-2xl bg-white border border-orange-300 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1"
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-orange-500 text-white grid place-items-center font-bold text-lg">
                {step.number}
              </div>
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">{step.title}</h3>
              <p className="mt-3 text-sm text-gray-600 text-center">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        
      </div>
    </section>
  );
}

export default StepsSection;