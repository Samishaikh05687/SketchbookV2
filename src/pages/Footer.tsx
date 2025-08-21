
export default function Footer() {
return (
<footer className="flex flex-col justify-center items-center bg-gradient-to-t from-orange-50 to-white">
<div className="w-full px-5  py-10 grid md:grid-cols-3 gap-20">
<div>
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-rose-400" />
<span className="text-lg font-bold">SketchBook</span>
</div>
<p className="mt-3 text-gray-600 max-w-sm">Real-time collaborative drawing for teams, classrooms, and creators. Brainstorm faster. Ship smarter.</p>
</div>
<div className="grid grid-cols-2 gap-6">
<div>
<h4 className="font-semibold text-gray-900">Product</h4>
<ul className="mt-3 space-y-2 text-gray-600">
<li><a href="#features" className="hover:text-orange-600">Features</a></li>
<li><a href="#steps" className="hover:text-orange-600">Workflow</a></li>
<li><a href="#pricing" className="hover:text-orange-600">Pricing</a></li>
</ul>
</div>
<div>
<h4 className="font-semibold text-gray-900">Company</h4>
<ul className="mt-3 space-y-2 text-gray-600">
<li><a href="#about" className="hover:text-orange-600">About</a></li>
<li><a href="/support" className="hover:text-orange-600">Support</a></li>
</ul>
</div>
</div>
<div className="text-gray-600">
<h4 className="font-semibold text-gray-900">Newsletter</h4>
<form className="mt-3 flex gap-2">
<input className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none" placeholder="Your email" />
<button className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600">Subscribe</button>
</form>
</div>
</div>
<div className="text-center text-sm text-gray-500 py-5">© {new Date().getFullYear()} SketchBook. All rights reserved.</div>
</footer>
);
}