import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Footer from "./Footer";
import { ArrowRight, SparklesIcon } from "lucide-react";
import Navbar from "./Navbar";
import  AboutSection  from "./AboutSection";
import { Button } from "../components/ui/button";


export default function LandingPage() {
    return (
        <div className="h-screen flex flex-col ">
         
         <Navbar/>


            {/* Hero */}
            <main className="w-full  flex flex-col justify-center items-center rounded-3xl bg-gradient-to-b  from-gray-200 via-orange-100 to-rose-300 mx-auto px-6 pt-20 pb-10 text-center">
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
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="mt-14 rounded-[22px] border border-orange-200/70 shadow-2xl overflow-hidden bg-white">
                        <img src="/assets/landing-dashboard.png" alt="SketchBook collaborative canvas preview" className="w-full" />
                    </motion.div>

                {/* Logos */}
                <div className="mt-10 opacity-80 flex flex-wrap items-center justify-center gap-10">
                    {['amazon', 'atlassian', 'github', 'launchdarkly', 'netflix', 'medium'].map((n) => (
                        <img key={n} src={`/assets/logos/${n}.svg`} className="h-6" alt={n} />
                    ))}
                </div>
                </section>

            </main>

            {/* About */}
           <AboutSection/>

            {/* Features */}
            <section id="features" className="py-24 bg-gradient-to-b from-white to-orange-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything you need to think visually</h2>
                    <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Real‑time Sync", desc: "Edits appear instantly across devices with presence cursors." },
                            { title: "Pro Toolset", desc: "Pen, shapes, arrows, text, sticky notes, and smart align." },
                            { title: "Share & Invite", desc: "Create a room link and collaborate in seconds—no sign‑up." },
                            { title: "Export & History", desc: "PNG/SVG export, versioning, and activity timeline." }
                        ].map((f, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-orange-200 bg-white shadow hover:shadow-lg transition">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-rose-400 mx-auto" />
                                <h3 className="mt-4 font-semibold text-lg text-gray-900">{f.title}</h3>
                                <p className="mt-2 text-gray-600">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps / How it works */}
            <section id="steps" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900">Get started in 3 simple steps</h2>
                    <div className="mt-12 grid md:grid-cols-3 gap-8">
                        {[{ n: 1, t: "Create a room", d: "Open the dashboard, generate a room, and set your display name." }, { n: 2, t: "Invite collaborators", d: "Share the room link. Teammates join from any device." }, { n: 3, t: "Sketch together", d: "Draw, diagram, and iterate in real time with comments and cursors." }].map((s) => (
                            <div key={s.n} className="relative p-8 rounded-2xl border border-orange-200 bg-orange-50">
                                <div className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-gray-900 text-white grid place-items-center font-bold">{s.n}</div>
                                <h3 className="mt-2 text-xl font-semibold text-gray-900">{s.t}</h3>
                                <p className="mt-2 text-gray-600">{s.d}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/canvas" className="rounded-full px-6 py-3 bg-orange-500 text-white hover:bg-orange-600">Open the Canvas</Link>
                    </div>
                </div>
            </section>

            {/* Pricing (optional quick section) */}
            <section id="pricing" className="py-24 bg-gradient-to-b from-white to-orange-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple, transparent pricing</h2>
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Free", price: "$0", items: ["Unlimited rooms", "Basic toolkit", "Real‑time sync"] },
                            { name: "Pro", price: "$9/mo", items: ["Advanced tools", "Export options", "Custom themes"] },
                            { name: "Team", price: "$29/mo", items: ["Team dashboard", "Roles & access", "Priority support"] }
                        ].map((p) => (
                            <div key={p.name} className="p-8 rounded-2xl border border-orange-200 bg-white shadow hover:shadow-xl">
                                <h3 className="text-xl font-semibold text-orange-600">{p.name}</h3>
                                <div className="mt-2 text-3xl font-extrabold text-gray-900">{p.price}</div>
                                <ul className="mt-4 space-y-2 text-gray-600">
                                    {p.items.map(i => <li key={i}>✔ {i}</li>)}
                                </ul>
                                <a href="#" className="mt-6 inline-block rounded-xl px-5 py-2 bg-gray-900 text-white hover:bg-gray-800">Choose</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

           <section className='h-auto  bg-gradient-to-r from-white via-orange-100 to-rose-200 text-white py-20 px-44 rounded-3xl text-center'>
       <div className="flex flex-col justify-start items-center gap-10 "> 

       <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block  rounded-xl px-5 py-2 text-base font-semibold tracking-wider bg-white text-gray-700 border border-gray-200">
                      <div className="flex gap-2 ">
                        <SparklesIcon className="text-orange-400"/>  Simplify Your Life
                        </div>
                        
                    </motion.p>
      <h2 className='text-7xl font-medium text-black text-opacity-70'>Want to know more <br/>
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