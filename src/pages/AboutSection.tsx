import {  useRef } from 'react';
import { motion, useInView } from 'framer-motion'; // For animations
import { HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="about" className="bg-white flex justify-between  items-center mt-32 py-28 ">
 
        <div className='text-start'>
         <div className='inline-block  text-sm font-semibold rounded-lg text-gray-700 mb-5 border border-gray-300'>
          <div className='flex items-center gap-1 px-2 py-1 '>
            <HomeIcon className='w-4 h-4' />Home/<span className='text-black'>About</span>
          </div>
         </div>
         <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-serif text-gray-900  text-start "
          >
            Built for<span className='text-orange-400'> Speed,</span> <br/>Designed for Teams
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-8 text-xl text-start text-gray-600 max-w-6xl mx-auto"
          >
            SketchBook redefines collaborative creativity with a lightning-fast whiteboard experience. Draw, annotate, and co-create in real-time with your team, anywhere, anytime.
          </motion.p>
        </motion.div>
        <Button className='bg-orange-500 text-white rounded-xl shadow-2xl text-base font-normal hover:bg-orange-600'>Explore Now</Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {/* Feature Cards */}
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate={isInView ? "visible" : "hidden"}
    className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 px-10"
  >
    {[
      {
        title: "Real-Time Collaboration",
        description: "See live cursors with names and colors, enabling seamless teamwork across the globe and enhancing productivity.",
        icon: (
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        ),
      },
      {
        title: "Versatile Tools",
        description: "Use sticky notes, shapes, connectors, text, and image uploads for ultimate flexibility.",
        icon: (
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        ),
      },
      {
        title: "Precision Control",
        description: "Navigate with a mini-map, manage layers, and fine-tune with the style panel.",
        icon: (
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
      },
      {
        title: "Cross-Platform Sync",
        description: "Work on any device with seamless synchronization and responsive design.",
        icon: (
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4-4-4-4m16 4l-4 4 4 4" />
          </svg>
        ),
      },
    ].map((feature, index) => (
      <motion.div
        key={index}
        variants={itemVariants}
        className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-orange-100 ${
          index === 0 || index === 3 ? "sm:col-span-2 lg:col-span-1 lg:h-72" : "lg:h-48 "
        }`}
      >
        <div className="flex items-center mb-4">
          {feature.icon}
          <h3 className="ml-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
        </div>
        <p className="text-gray-600">{feature.description}</p>
      </motion.div>
    ))}
  </motion.div>
</div>

       
      
    </section>
  );
}

