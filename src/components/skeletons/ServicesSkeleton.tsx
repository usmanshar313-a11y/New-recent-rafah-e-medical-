import React from 'react';
import { Skeleton, SkeletonText, SkeletonCircle } from './SkeletonBase';

export const ServicesSkeleton: React.FC = () => {
  return (
    <div className="bg-[#F5F1E8] min-h-screen py-8 sm:py-10 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Top Hero Banner Skeleton */}
        <div className="bg-[#0B6B4E]/90 text-white rounded-3xl p-7 sm:p-12 space-y-4">
          <Skeleton className="h-6 w-48 rounded-full bg-white/20" />
          <Skeleton className="h-10 w-3/4 sm:w-1/2 rounded-xl bg-white/20" />
          <Skeleton className="h-4 w-full sm:w-2/3 rounded-lg bg-white/20" />
        </div>

        {/* Search & Filter Bar Skeleton */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-900/10 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Skeleton className="h-11 w-full sm:w-2/3 rounded-xl" />
          <Skeleton className="h-11 w-full sm:w-44 rounded-xl" />
        </div>

        {/* Results Counter Skeleton */}
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Department Cards List Skeleton */}
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-emerald-900/15 p-6 sm:p-7 flex flex-col lg:flex-row gap-6 justify-between items-center"
            >
              {/* Left Column */}
              <div className="flex items-center gap-4 w-full lg:w-[300px]">
                <SkeletonCircle className="w-12 h-12 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2 rounded-full" />
                </div>
              </div>

              {/* Middle Column */}
              <div className="w-full lg:flex-1 space-y-2">
                <SkeletonText lines={2} />
              </div>

              {/* Right Column */}
              <div className="w-full lg:w-[280px] space-y-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-emerald-900/10">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
