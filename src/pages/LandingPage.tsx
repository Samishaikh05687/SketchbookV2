import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Footer from "./Footer";
import { ArrowRight, SparklesIcon } from "lucide-react";
import Navbar from "./Navbar";
import AboutSection from "./AboutSection";
import { Button } from "../components/ui/button";
import PricingSection from "./PricingSection";
import StepsSection from "./StepsSection";


export default function LandingPage() {
    return (
        <div className="h-screen flex flex-col m-5 ">

            <Navbar />
            {/* Hero */}
            <main className="w-full h-[140vh]   flex flex-col justify-center items-center rounded-3xl bg-gradient-to-b  from-gray-200 via-orange-100 to-rose-300 mx-auto px-6 pt-48 text-center">
                <section id="home" className="max-w-5xl mt-20">

                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block rounded-full px-6 py-2 text-base font-semibold tracking-wider bg-white/70 text-gray-700 border border-orange-200">
                        UNLEASH YOUR CREATIVITY
                    </motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-4 text-4xl md:text-6xl font-semibold text-black text-opacity-90 ">
                        Collaborate on Your Ideas with
                        <br className="hidden md:block" />
                        <span className="text-black text-opacity-90 bg-clip-text  "> Real‑Time Drawing</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mt-5 max-w-xl mx-auto text-xl font-medium text-gray-600">
                        SketchBook helps teams brainstorm, diagram, and present—in one shared canvas. No installs. Just a link.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-7 flex items-center justify-center gap-4">
                        <Link to="/dashboard" className="rounded-full flex gap-2 px-3 py-3 font-semibold bg-orange-500 text-white hover:bg-orange-600 shadow">Get Started <ArrowRight /> </Link>
                        <a href="#features" className="rounded-full px-7 py-3 border border-orange-300 text-orange-600 bg-white hover:bg-orange-50">Learn More</a>
                    </motion.div>


                </section>
                     
                        <img src="/image.png" alt="SketchBook collaborative canvas preview"  className="w-[90%]  h-auto   translate-y-[10%] " />
                  

            </main>

            {/* About */}
            <AboutSection />


            {/* Steps / How it works */}
            <StepsSection />


            {/* Pricing (optional quick section) */}
            <PricingSection />


            <section className='h-auto  bg-gradient-to-r from-white via-orange-100 to-rose-200 text-white py-20 px-44 rounded-3xl text-center'>
                <div className="flex flex-col justify-start items-center gap-10 ">

                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block  rounded-xl px-5 py-2 text-base font-semibold tracking-wider bg-white text-gray-700 border border-gray-200">
                        <div className="flex gap-2 ">
                            <SparklesIcon className="text-orange-400" />  Simplify Your Life
                        </div>

                    </motion.p>
                    <h2 className='text-6xl font-serif  text-black text-opacity-70'>Want to know more <br />
                        about <span className="text-orange-600">Sketchbook ?</span></h2>
                    <p className='px-60  text-lg font-normal  text-black text-opacity-70'>Book a free demo and learn more about Knolens.it's offerings and use-cases. We would love to help you with all your queries.</p>
                    <div className="flex gap-5 my-10">

                        <Button className="bg-orange-500 text-lg hover:bg-orange-600 px-10 py-6  rounded-full shadow-2xl">Book a demo  </Button>
                        <Button className="bg-white text-lg text-gray-600 shadow-2xl border px-10 py-6 hover:bg-gray-100 border-gray-200 rounded-full">Start a free trail   </Button>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}