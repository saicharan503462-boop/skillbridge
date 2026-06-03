import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import SkillCard, { SkillCardSkeleton } from '../components/SkillCard';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Coding', 'Chess', 'Business', 'DIY', 'Music', 'Art', 'Language', 'Fitness', 'Cooking'];

const CategoryPill = ({ name, emoji }) => (
  <Link
    to={`/explore?category=${name}`}
    className="flex flex-col items-center gap-2 p-4 card-hover rounded-2xl text-center min-w-[80px] group"
  >
    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{emoji}</span>
    <span className="text-xs font-mono text-gray-400 group-hover:text-gray-100 transition-colors">{name}</span>
  </Link>
);

const categoryEmojis = {
  Coding: '💻', Chess: '♟️', Business: '📈', DIY: '🔧',
  Music: '🎵', Art: '🎨', Language: '🗣️', Fitness: '🏋️', Cooking: '🍳',
};

export default function Home() {
  const { user } = useAuth();
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, recentRes] = await Promise.all([
          api.get('/skills/trending'),
          api.get('/skills/recent'),
        ]);
        setTrending(trendingRes.data);
        setRecent(recentRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(to right, #22c55e 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative page-container pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-900/40 border border-brand-800/50 px-3 py-1.5 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-brand-400">Learn skills. Teach the world.</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Connecting generations<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">
              through shared skills 
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 font-body">
            Upload your expertise. Discover structured tutorials. Rate what's truly valuable.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/explore" className="btn-primary text-base px-8 py-3">
              Explore Skills
            </Link>
            {!user && (
              <Link to="/signup" className="btn-secondary text-base px-8 py-3">
                Start Teaching
              </Link>
            )}
            {user && (
              <Link to="/upload" className="btn-secondary text-base px-8 py-3">
                Upload a Skill
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-container pt-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Browse by Category</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <CategoryPill key={cat} name={cat} emoji={categoryEmojis[cat]} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="page-container py-8 border-t border-surface-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">🔥 Trending</h2>
            <p className="text-sm text-gray-500">Highest-rated skills this week</p>
          </div>
          <Link to="/explore?sort=top_rated" className="text-sm text-brand-400 hover:text-brand-300 font-display font-medium transition-colors">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkillCardSkeleton key={i} />)
            : trending.map((skill) => <SkillCard key={skill._id} skill={skill} />)
          }
          {!loading && trending.length === 0 && (
            <p className="text-gray-500 col-span-3 py-8 text-center">No skills yet. Be the first to upload!</p>
          )}
        </div>
      </section>

      {/* Recent */}
      <section className="page-container py-8 border-t border-surface-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">✨ Recently Added</h2>
            <p className="text-sm text-gray-500">Fresh from the community</p>
          </div>
          <Link to="/explore?sort=newest" className="text-sm text-brand-400 hover:text-brand-300 font-display font-medium transition-colors">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkillCardSkeleton key={i} />)
            : recent.map((skill) => <SkillCard key={skill._id} skill={skill} />)
          }
          {!loading && recent.length === 0 && (
            <p className="text-gray-500 col-span-4 py-8 text-center">No skills yet.</p>
          )}
        </div>
      </section>

      {/* CTA banner */}
      {!user && (
        <section className="page-container py-12">
          <div className="card bg-gradient-to-br from-brand-900/40 to-surface-card border-brand-800/40 p-10 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Ready to share your skills?</h2>
            <p className="text-gray-400 mb-6">Join thousands of creators teaching what they know best.</p>
            <Link to="/signup" className="btn-primary px-10 py-3 text-base">Create Free Account</Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-surface-border mt-8">
        <div className="page-container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-500 rounded flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 14L9 4L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 10H12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display text-sm text-gray-400">SkillBridge</span>
          </div>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} SkillBridge. Built to bridge knowledge gaps.</p>
        </div>
      </footer>
    </div>
  );
}
