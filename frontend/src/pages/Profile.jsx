import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import SkillCard from '../components/SkillCard';
import StarRating from '../components/StarRating';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [error, setError] = useState('');

  const isOwn = currentUser && currentUser._id === id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setData(res.data);
        setFollowerCount(res.data.stats.followerCount);
        if (currentUser) {
          setFollowing(res.data.user.followers?.map(f => f.toString()).includes(currentUser._id));
        }
      } catch (err) {
        setError('User not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      const res = await api.post(`/users/${id}/follow`);
      setFollowing(res.data.following);
      setFollowerCount(res.data.followerCount);
    } catch (err) {}
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center gap-5 mb-8">
          <div className="skeleton w-20 h-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-6 w-40 rounded" />
            <div className="skeleton h-4 w-56 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="card"><div className="aspect-video skeleton" /><div className="p-4 space-y-2"><div className="skeleton h-4 w-3/4 rounded" /></div></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container text-center py-24">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="font-display text-2xl text-white mb-2">{error}</h2>
        <Link to="/" className="btn-primary mt-4">Go Home</Link>
      </div>
    );
  }

  const { user, skills, stats } = data;

  return (
    <div className="page-container animate-fade-in">
      {/* Profile header */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-brand-900 border-2 border-brand-700 flex items-center justify-center shrink-0">
            <span className="font-display text-3xl font-bold text-brand-300">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold text-white mb-1">{user.name}</h1>
            <p className="text-sm text-gray-500 mb-3">{user.email}</p>
            {user.bio && <p className="text-sm text-gray-400 leading-relaxed max-w-lg">{user.bio}</p>}
          </div>

          {/* Actions */}
          <div className="shrink-0">
            {!isOwn && currentUser && (
              <button
                onClick={handleFollow}
                className={following ? 'btn-secondary' : 'btn-primary'}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
            {!currentUser && (
              <Link to="/login" className="btn-primary">Follow</Link>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-surface-border">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">{stats.skillCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Skills</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="font-display text-2xl font-bold text-white">
                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—'}
              </span>
            </div>
            <p className="text-xs text-gray-500">Avg. Rating</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">{followerCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">{stats.followingCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Following</p>
          </div>
        </div>
      </div>

      {/* Skills section */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">
          {isOwn ? 'Your Skills' : `Skills by ${user.name}`}
        </h2>
        {isOwn && (
          <Link to="/upload" className="btn-primary py-2 px-4 text-sm">
            + Upload New
          </Link>
        )}
      </div>

      {skills.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="font-display text-lg text-gray-300 mb-2">No skills uploaded yet</h3>
          {isOwn && (
            <Link to="/upload" className="btn-primary mt-3 inline-block">
              Upload Your First Skill
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <SkillCard key={skill._id} skill={{ ...skill, creator: user }} />
          ))}
        </div>
      )}

      {/* Rating summary */}
      {stats.avgRating > 0 && (
        <div className="card p-5 mt-8 flex items-center gap-4">
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-white">{stats.avgRating.toFixed(1)}</p>
            <StarRating value={Math.round(stats.avgRating)} readonly size={16} />
            <p className="text-xs text-gray-500 mt-1">Overall rating</p>
          </div>
          <div className="text-sm text-gray-500">
            Average across {stats.skillCount} skill{stats.skillCount !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
