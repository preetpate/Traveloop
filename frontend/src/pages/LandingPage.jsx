import { Link } from 'react-router-dom';
import { Map, Wallet, Package, Compass, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const features = [
    {
      icon: Map,
      title: 'Smart Itineraries',
      description: 'Plan your trips with intelligent suggestions and day-by-day schedules',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Wallet,
      title: 'Budget Tracking',
      description: 'Keep your expenses in check with real-time budget monitoring',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Package,
      title: 'Packing Lists',
      description: 'Never forget essentials with smart packing checklists',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Compass,
      title: 'Discover Places',
      description: 'Explore trending destinations and hidden gems worldwide',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const benefits = [
    'Smart itinerary suggestions',
    'Real-time budget tracking',
    'Collaborative trip planning',
    'Offline access to your plans',
    'Share trips with friends',
    'Mobile-friendly interface',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Traveloop
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-text-secondary hover:text-text-primary transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform shadow-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Plan Your Dream Trip
              </span>
              <br />
              <span className="text-text-primary">With Smart Planning Tools</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Create smart itineraries, track budgets, and discover amazing destinations.
              Everything you need for the perfect journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform shadow-large flex items-center gap-2"
              >
                Start Planning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/explore-cities"
                className="px-8 py-4 bg-white border border-gray-200 rounded-xl text-text-primary font-semibold hover:border-blue-300 hover:shadow-medium transition"
              >
                Explore Destinations
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-large p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-gray-100">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Travel Smart
            </h2>
            <p className="text-xl text-text-secondary">
              Powerful features to make trip planning effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-large transition-all group"
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-text-primary mb-6">
                Why Choose Traveloop?
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                Join thousands of travelers who trust Traveloop to plan their perfect adventures.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-text-primary">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform shadow-large"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 border border-gray-200 shadow-large">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 text-center shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join Traveloop today and plan your next trip in minutes
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:scale-105 transition-transform shadow-large"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">Traveloop</span>
            </div>
            <p className="text-text-secondary text-sm">
              © 2024 Traveloop. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-text-secondary">
              <a href="#" className="hover:text-blue-600 transition">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                Terms
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
