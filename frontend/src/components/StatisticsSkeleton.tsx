import React from 'react';

interface StatisticsSkeletonProps {
  type?: 'ai' | 'default';
}

const StatisticsSkeleton: React.FC<StatisticsSkeletonProps> = ({ type = 'default' }) => {
  if (type === 'ai') {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="h-6 w-32 bg-purple-200 dark:bg-purple-700 rounded mb-4" />
            <div className="space-y-4">
              <div>
                <div className="h-4 w-24 bg-purple-200 dark:bg-purple-700 rounded mb-2" />
                <div className="h-8 w-36 bg-purple-200 dark:bg-purple-700 rounded" />
              </div>
              <div>
                <div className="h-4 w-24 bg-purple-200 dark:bg-purple-700 rounded mb-2" />
                <div className="h-8 w-36 bg-purple-200 dark:bg-purple-700 rounded" />
              </div>
              <div>
                <div className="h-4 w-36 bg-purple-200 dark:bg-purple-700 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated Skeleton */}
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Server Statistics Skeleton */}
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="h-6 w-32 bg-blue-200 dark:bg-blue-700 rounded mb-4" />
          <div className="space-y-3">
            <div>
              <div className="h-4 w-24 bg-blue-200 dark:bg-blue-700 rounded mb-2" />
              <div className="h-8 w-36 bg-blue-200 dark:bg-blue-700 rounded" />
            </div>
          </div>
        </div>

        {/* Player Statistics Skeleton */}
        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="h-6 w-32 bg-green-200 dark:bg-green-700 rounded mb-4" />
          <div className="space-y-3">
            <div>
              <div className="h-4 w-24 bg-green-200 dark:bg-green-700 rounded mb-2" />
              <div className="h-8 w-36 bg-green-200 dark:bg-green-700 rounded" />
            </div>
            <div>
              <div className="h-4 w-36 bg-green-200 dark:bg-green-700 rounded mb-2" />
              <div className="h-8 w-36 bg-green-200 dark:bg-green-700 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* SpigotMC Statistics Skeleton */}
      <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <div className="h-6 w-32 bg-purple-200 dark:bg-purple-700 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="h-4 w-24 bg-purple-200 dark:bg-purple-700 rounded mb-2" />
              <div className="h-8 w-36 bg-purple-200 dark:bg-purple-700 rounded" />
            </div>
            <div>
              <div className="h-4 w-24 bg-purple-200 dark:bg-purple-700 rounded mb-2" />
              <div className="h-8 w-36 bg-purple-200 dark:bg-purple-700 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="h-4 w-24 bg-purple-200 dark:bg-purple-700 rounded mb-2" />
              <div className="h-8 w-36 bg-purple-200 dark:bg-purple-700 rounded" />
            </div>
            <div>
              <div className="h-4 w-36 bg-purple-200 dark:bg-purple-700 rounded mb-2" />
              <div className="h-8 w-36 bg-purple-200 dark:bg-purple-700 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Skeleton */}
      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
};

export default StatisticsSkeleton; 