import React from 'react';
import { Skeleton, SkeletonText, SkeletonCircle } from './SkeletonBase';

export const DoctorsSkeleton: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-6 sm:py-8 text-[#1F2937] animate-in fade-in duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Navigation & Header Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-9 w-44 rounded-xl" />
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 flex items-center gap-4">
            <SkeletonCircle className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* Section Indicator Skeleton */}
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Doctor Cards Grid Skeleton (2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 space-y-6"
            >
              <div className="flex items-start gap-4">
                <SkeletonCircle className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3.5 w-2/3" />
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-100">
                <SkeletonText lines={2} />
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <Skeleton className="h-10 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
