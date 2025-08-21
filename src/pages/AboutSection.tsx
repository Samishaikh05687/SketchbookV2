import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion'; // For animations

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
    <section id="about" className="bg-gradient-to-b from-white to-orange-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-700"
          >
            Built for Speed, Designed for Teams
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            SketchBook redefines collaborative creativity with a lightning-fast whiteboard experience. Draw, annotate, and co-create in real-time with your team, anywhere, anytime.
          </motion.p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {[
              {
                title: "Real-Time Collaboration",
                description: "See live cursors with names and colors, enabling seamless teamwork across the globe.",
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
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-orange-100"
              >
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="ml-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Illustration / Visual */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative lg:col-span-1"
          >
            <div className="bg-orange-100 rounded-2xl p-6 h-full flex items-center justify-center overflow-hidden">
              {/* Fallback SVG illustration if image is unavailable */}
              <svg
                className="w-full h-auto max-h-96"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="200" height="200" rx="20" fill="url(#grad1)" />
                <path
                  d="M50 150C75 125 125 125 150 150"
                  stroke="#F97316"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="80" r="30" fill="#fff" stroke="#F97316" strokeWidth="4" />
                <circle cx="80" cy="70" r="5" fill="#F97316" />
                <circle cx="120" cy="70" r="5" fill="#F97316" />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFEDD5', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FDBA74', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* Optional overlay for visual effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent rounded-2xl"></div>
          </motion.div>
        </div>

       
      </div>
    </section>
  );
}

