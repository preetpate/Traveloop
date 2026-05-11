import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Map, Wallet, Package, Compass, ArrowRight, CheckCircle,
  Star, Globe, Plane, Shield, Zap, Users, ChevronRight
} from 'lucide-react';

const CITIES = [
  { name: 'Paris',     country: 'France',  img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { name: 'Tokyo',     country: 'Japan',   img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { name: 'New York',  country: 'USA',     img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
  { name: 'Bali',      country: 'Indonesia',img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { name: 'Dubai',     country: 'UAE',     img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { name: 'Rome',      country: 'Italy',   img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
];

const FEATURES = [
  { icon: Map,     title: 'Smart Itineraries',  desc: 'Day-by-day plans with intelligent scheduling and stop management.',       color: 'from-blue-500 to-cyan-500' },
  { icon: Wallet,  title: 'Budget Tracking',    desc: 'Real-time expense monitoring with category breakdowns and charts.',       color: 'from-violet-500 to-purple-500' },
  { icon: Package, title: 'Packing Lists',      desc: 'Never forget essentials — smart checklists with progress tracking.',      color: 'from-emerald-500 to-teal-500' },
  { icon: Compass, title: 'Discover Places',    desc: 'Explore trending destinations and add them to your trips instantly.',     color: 'from-orange-500 to-rose-500' },
  { icon: Globe,   title: 'Share Itineraries',  desc: 'Generate a public link and share your trip with friends & family.',      color: 'from-pink-500 to-fuchsia-500' },
  { icon: Shield,  title: 'Secure & Private',   desc: 'Your travel data is protected with JWT auth and encrypted storage.',     color: 'from-amber-500 to-yellow-500' },
];

const STATS = [
  { value: '10K+', label: 'Trips Planned' },
  { value: '150+', label: 'Destinations' },
  { value: '4.9★', label: 'User Rating' },
  { value: 'Free', label: 'Forever' },
];

const TESTIMONIALS = [
  { name: 'Priya S.',   role: 'Solo Traveler',    text: 'Traveloop made my Europe trip so easy to plan. The budget tracker saved me from overspending!',   avatar: 'P' },
  { name: 'Rahul M.',   role: 'Family Vacationer', text: 'Best travel planning app I have used. The packing list feature is a lifesaver for family trips.', avatar: 'R' },
  { name: 'Ananya K.',  role: 'Backpacker',        text: 'I love how I can share my itinerary with friends. The UI is gorgeous and super easy to use.',     avatar: 'A' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1020]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Traveloop</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-white/70 hover:text-white font-medium text-sm transition">
              Login
            </Link>
            <Link to="/signup" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold text-sm hover:scale-105 transition-transform shadow-lg shadow-blue-500/25">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMXY1OGg1OFYxSDF6IiBmaWxsPSIjZmZmZmZmMDUiLz48L2c+PC9zdmc+')] opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 mb-8 backdrop-blur-md">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Smart Travel Planning Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] mb-6 tracking-tight">
              Travel Smarter,
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Live Better
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Plan perfect trips with smart itineraries, budget tracking, packing lists,
              and destination discovery — all in one beautiful app.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-blue-500/30"
              >
                Start Planning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/explore-cities"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
              >
                <Globe className="w-5 h-5" />
                Explore Destinations
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md"
                >
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-white/50 text-sm mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CITY CARDS ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Explore the World
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Discover stunning destinations and add them to your next trip
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CITIES.map((city, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
              >
                <img
                  src={city.img}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-bold text-white text-sm leading-tight">{city.name}</p>
                  <p className="text-white/60 text-xs">{city.country}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/explore-cities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition backdrop-blur-md"
            >
              View All Destinations <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Everything You Need
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Powerful tools to make every trip perfect
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">How It Works</h2>
            <p className="text-white/50 text-lg">Plan your dream trip in 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create a Trip',      desc: 'Add your destination, travel dates, and cover photo to get started.',       icon: Plane },
              { step: '02', title: 'Plan Your Stops',    desc: 'Add cities, activities, and build your day-by-day itinerary with ease.',    icon: Map },
              { step: '03', title: 'Travel & Share',     desc: 'Track your budget, pack smart, and share your itinerary with friends.',     icon: Globe },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-500/20">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-extrabold text-white/5 mb-2">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3 -mt-8">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Loved by Travelers</h2>
            <p className="text-white/50 text-lg">See what our users are saying</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-md"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-white/70 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 sm:p-16 text-center shadow-2xl shadow-blue-500/20"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm mb-6 backdrop-blur-md">
                <Users className="w-4 h-4" /> Join thousands of travelers
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                Ready for Your Next Adventure?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                Create your free account and start planning your dream trip today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition backdrop-blur-md"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white">Traveloop</span>
          </div>
          <p className="text-white/30 text-sm">© 2025 Traveloop. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
