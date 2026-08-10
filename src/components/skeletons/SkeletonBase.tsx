import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div
      className={`skeleton-box rounded-xl ${className}`}
      style={style}
    />
  );
};

export const SkeletonText: React.FC<{ className?: string; lines?: number }> = ({ className = 'h-4 w-full', lines = 1 }) => {
  if (lines === 1) {
    return <Skeleton className={className} />;
  }
  return (
    <div className="space-y-2.5 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`${className} ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCircle: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return <Skeleton className={`rounded-full shrink-0 ${className}`} />;
};

export const SkeletonButton: React.FC<{ className?: string }> = ({ className = 'h-11 w-36 rounded-full' }) => {
  return <Skeleton className={className} />;
};
