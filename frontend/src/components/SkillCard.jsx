import React from 'react';
import { Link } from 'react-router-dom';
import { getYouTubeThumbnail, timeAgo, levelBadgeClass, categoryColors } from '../utils/helpers';

const StarIcon = ({ filled }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke={filled ? '#f59e0b' : '#6b7280'} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function SkillCard({ skill }) {
  const thumbnail = getYouTubeThumbnail(skill.videoUrl);
  const catClass = categoryColors[skill.category] || categoryColors.Other;

  return (
    <Link to={`/skill/${skill._id}`} className="card-hover block group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-surface overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={skill.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-secondary">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="#374151" stroke="none" />
            </svg>
          </div>
        )}
        {/* Level badge overlay */}
        <span className={`absolute top-2 left-2 badge ${levelBadgeClass[skill.level] || 'badge-green'} text-[10px]`}>
          {skill.level}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border ${catClass} mb-2`}>
          {skill.category}
        </span>

        {/* Title */}
        <h3 className="font-display font-semibold text-white text-sm leading-snug line-clamp-2 mb-2 group-hover:text-brand-300 transition-colors">
          {skill.title}
        </h3>

        {/* Creator */}
        <p className="text-xs text-gray-500 mb-3">
          by <span className="text-gray-400">{skill.creator?.name || 'Unknown'}</span>
          <span className="mx-1.5">·</span>
          <span>{timeAgo(skill.createdAt)}</span>
        </p>

        {/* Rating + Views */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} filled={i <= Math.round(skill.averageRating)} />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {skill.averageRating > 0 ? skill.averageRating.toFixed(1) : 'No ratings'}
            </span>
          </div>
          {skill.ratingCount > 0 && (
            <span className="text-xs text-gray-600">({skill.ratingCount})</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Skeleton card for loading state
export function SkillCardSkeleton() {
  return (
    <div className="card">
      <div className="aspect-video skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
