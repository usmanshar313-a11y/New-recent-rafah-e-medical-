import React from 'react';
import { Skeleton, SkeletonText } from './SkeletonBase';

export const ContactSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-20 animate-in fade-in duration-300">
      {/* Hero Header Skeleton */}
      <div className="bg-[#22A25A] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <Skeleton className="h-6 w-52 rounded-full mx-auto bg-white/20" />
          <Skeleton className="h-10 w-2/3 sm:w-1/3 rounded-xl mx-auto bg-white/20" />
          <Skeleton className="h-4 w-full sm:w-1/2 rounded-lg mx-auto bg-white/20" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card Skeleton */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-6">
            <div className="space-y-2 border-b border-gray-100 pb-3">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-full" />
            </div>

            <div className="space-y-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-2xl" />
              ))}
            </div>

            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>

          {/* Map Embed Box Skeleton */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 overflow-hidden min-h-[420px] flex flex-col">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex-1 min-h-[380px]">
              <Skeleton className="w-full h-full rounded-none" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
