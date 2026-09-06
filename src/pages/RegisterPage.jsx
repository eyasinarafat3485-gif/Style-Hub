import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { triggerGoogleSignIn } from '../utils/googleAuth';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !password || !confirmPassword) {
      const msg = 'Please fill in all the required fields.';
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please verify and try again.';
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    setIsSubmitting(true);
    const res = await register(name, email, password);
    setIsSubmitting(false);

    if (res.success) {
      toast.success('Account created successfully! Welcome to StyleHub 🎉');
      navigate('/dashboard', { replace: true });
    } else {
      const errorText = res.error || 'Registration failed. Please try again.';
      setErrorMessage(errorText);
      toast.error(errorText);
    }
  };

  const handleGoogleRegisterClick = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Triggers official Google OAuth account selector popup
      const googleResult = await triggerGoogleSignIn();

      const res = await loginWithGoogle(googleResult.credential, googleResult.userInfo);
      setIsSubmitting(false);

      if (res.success) {
        toast.success('Account registered with Google successfully! 🎉');
        navigate('/dashboard', { replace: true });
      } else {
        const errorText = res.error || 'Google registration failed.';
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err.message && !err.message.includes('popup_closed_by_user')) {
        const errorText = err.message || 'Google authentication could not be completed.';
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50/60 to-white selection:bg-[#ff2056] selection:text-white">
      <div className="max-w-md w-full">

        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xl shadow-gray-200/40 p-6 sm:p-9 space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#ff2056] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join StyleHub Club</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 tracking-tight">
              Create Account<span className="text-[#ff2056]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Sign up today for member-exclusive offers, early access & faster checkout
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-[#ff2056] text-xs font-semibold animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-in Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleRegisterClick}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-gray-50 text-slate-700 text-xs sm:text-sm font-bold rounded-lg border border-gray-300/90 shadow-xs hover:shadow transition-all cursor-pointer group"
            >
              {/* Google G Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest absolute">
              or fill details
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056] focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056] focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Password (min. 6 chars)</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50/70 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056] focus:ring-2 focus:ring-rose-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#ff2056] focus:ring-2 focus:ring-rose-100 transition-all"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="w-4 h-4 mt-0.5 accent-[#ff2056] rounded cursor-pointer"
                />
                <span className="text-[11px] text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-[#ff2056] font-semibold underline">Terms of Service</span> and{' '}
                  <span className="text-[#ff2056] font-semibold underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 sm:py-3 bg-[#ff2056] hover:bg-[#d6103e] active:bg-[#b80830] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-rose-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link: Go to Login */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#ff2056] hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>

        {/* Security Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#ff2056]" />
            <span>Secure Registration</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff2056]" />
            <span>Instant Membership</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
