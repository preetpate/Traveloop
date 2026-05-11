import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Plane, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd]   = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())                                    e.name = 'Name is required';
    if (!formData.email)                                          e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))               e.email = 'Invalid email';
    if (!formData.password)                                       e.password = 'Password is required';
    else if (formData.password.length < 8)                        e.password = 'Min 8 characters';
    if (!formData.confirmPassword)                                e.confirmPassword = 'Confirm your password';
    else if (formData.password !== formData.confirmPassword)      e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to create account' });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (err) =>
    `w-full px-4 py-3.5 bg-white/5 border ${err ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`;

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">

        {/* LEFT */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white">Traveloop</span>
          </Link>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
            Start Your
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Adventure!
            </span>
          </h1>
          <p className="text-white/50 text-lg mb-10">Join thousands of travelers planning smarter trips.</p>
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-7">
            <h3 className="text-xl font-bold text-white mb-5">Why Traveloop?</h3>
            <ul className="space-y-3">
              {['Plan unlimited trips for free', 'Track budgets & expenses', 'Discover new destinations', 'Share trips with friends'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white">Traveloop</span>
          </Link>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-3xl font-extrabold text-white mb-1">Create Account</h2>
            <p className="text-white/40 mb-7">Fill in your details to get started</p>

            {errors.submit && (
              <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{errors.submit}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`${inputCls(errors.name)} pl-12`} />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={`${inputCls(errors.email)} pl-12`} />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input name="password" type={showPwd ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Min 8 characters" className={`${inputCls(errors.password)} pl-12 pr-12`} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition">
                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                  <input name="confirmPassword" type={showCPwd ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={`${inputCls(errors.confirmPassword)} pl-12 pr-12`} />
                  <button type="button" onClick={() => setShowCPwd(!showCPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition">
                    {showCPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                ) : (
                  <>Create Account <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center"><span className="px-4 text-white/30 text-sm">Already have an account?</span></div>
            </div>

            <Link to="/login" className="block w-full py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-center hover:bg-white/10 transition">
              Sign In
            </Link>
            <div className="text-center mt-5">
              <Link to="/" className="text-sm text-white/30 hover:text-white/60 transition">← Back to Home</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
