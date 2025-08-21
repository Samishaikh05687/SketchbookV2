import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      Transition: {
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, Transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const pricingPlans = [
    {
      name: 'Free',
      price: 'Rs.0',
      period: '/month',
      description: 'Perfect for individual creators and small projects.',
      features: [
        'Unlimited collaborative rooms',
        'Basic drawing tools (pen, shapes, text)',
        'Real-time synchronization',
        'Up to 5 users per room',
        'Community support',
      ],
      cta: 'Get Started',
      link: '/dashboard',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: 'Rs.999',
      period: '/month',
      description: 'Advanced tools for professional designers and creators.',
      features: [
        'All Free features',
        'Advanced tools (brushes, layers, mini-map)',
        'Export to PNG, SVG, and PDF',
        'Custom color themes',
        'Priority email support',
      ],
      cta: 'Choose Pro',
      link: '/dashboard',
      highlighted: true,
    },
    {
      name: 'Team',
      price: 'Rs.1999',
      period: '/month',
      description: 'Built for teams with enhanced collaboration and management.',
      features: [
        'All Pro features',
        'Team dashboard with user management',
        'Role-based access control',
        'Unlimited users per room',
        '24/7 priority support',
      ],
      cta: 'Choose Team',
      link: '/dashboard',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className=" z-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2
            variants={cardVariants}
            className="text-2xl sm:text-5xl font-serif text-gray-900"
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            variants={cardVariants}
            className="mt-4 text-lg text-gray-600 max-w-xl mx-auto"
          >
            Choose the plan that fits your creative needs. Start collaborating with SketchBook today.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className=" z-0 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              className={`p-8 rounded-xl  border border-gray-200 bg-white ${
                plan.highlighted ? 'shadow-lg border-orange-300 scale-105' : 'shadow'
              } hover:shadow-md transition-shadow`}
            >
              <h3 className="text-xl font-semibold text-orange-600">{plan.name}</h3>
              <div className="mt-2 flex items-baseline justify-center">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-base text-gray-600">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-gray-600 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={plan.link}
                className={`mt-6 inline-block w-full text-center rounded-md px-5 py-2 font-medium transition-colors ${
                  plan.highlighted
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;