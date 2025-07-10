import React from 'react';

const WebsiteStatisticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Graph Skeleton */}
      <div className="p-6 bg-white dark:bg-gray-700/50 rounded-lg">
        <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
      </div>

      {/* Statistics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>

      {/* Last Updated Skeleton */}
      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-600 rounded"></div>
    </div>
  );
};

export default WebsiteStatisticsSkeleton; 