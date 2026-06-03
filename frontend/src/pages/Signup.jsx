import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password);
      navigate(`/profile/${user._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-brand-500 rounded-2xl items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 18 18" fill="none">
              <path d="M3 14L9 4L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 10H12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Join SkillBridge</h1>
          <p className="text-gray-500 mt-1 text-sm">Start learning and teaching today</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-900/30 border border-red-800/50 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-display text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                className="input"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-display text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-display text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                className="input"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
