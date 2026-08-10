import React from 'react';
import { Skeleton, SkeletonText } from './SkeletonBase';

export const PortalSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Portal Header Skeleton */}
        <div className="bg-[#0B6B4E] text-white p-6 sm:p-8 rounded-3xl space-y-3">
          <Skeleton className="h-6 w-36 rounded-full bg-white/20" />
          <Skeleton className="h-8 w-1/2 rounded-xl bg-white/20" />
          <Skeleton className="h-4 w-2/3 rounded-lg bg-white/20" />
        </div>

        {/* Tab Buttons Skeleton */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>

        {/* Dashboard Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-900/10 space-y-4">
            <Skeleton className="h-6 w-44" />
            <SkeletonText lines={3} />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="bg-white p-6 rounded-3xl border border-emerald-900/10 space-y-4">
            <Skeleton className="h-6 w-44" />
            <SkeletonText lines={3} />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  );
};

export const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-[#F5F1E8] py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-emerald-900/10 space-y-6">
        <Skeleton className="h-8 w-2/3 rounded-xl" />
        <SkeletonText lines={4} />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <SkeletonText lines={3} />
      </div>
    </div>
  );
};
