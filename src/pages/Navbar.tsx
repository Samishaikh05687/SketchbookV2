
import { Link } from "react-router-dom";


export default function Navbar() {
    return (
        <header className="w-full fixed top-4 z-50 pt-5 ">
            <div className="max-w-4xl  mx-auto rounded-full bg-[#1a1818] backdrop-blur-md border-b border-orange-100 px-1 py-1 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-rose-400" />
                    <span className="text-2xl font-sans text-white">SketchBook</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-lg text-white font-normal">
                    <a href="#home" className="hover:text-orange-600">Home</a>
                    <a href="#about" className="hover:text-orange-600">About</a>
                   
                    <a href="#steps" className="hover:text-orange-600">How it works</a>
                    <Link to="/" className="hover:text-orange-600">Support</Link>
                </nav>
                <div className="flex items-center gap-3">

                    <Link to="/dashboard" className="rounded-full px-6 py-2.5 bg-white text-lg font-medium text-black transition shadow">
                        Login
                    </Link>
                </div>
            </div>
        </header>
    );
}