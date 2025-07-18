import React from 'react';
import WebsiteStatisticsSkeleton from '../components/WebsiteStatisticsSkeleton';
import { CloudflareDomain, CloudflareStats } from '../types/statistics';
import { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

interface WebsitesSectionProps {
  sortedCloudflareDomains: CloudflareDomain[];
  selectedDomain: CloudflareDomain | null;
  setSelectedDomain: (domain: CloudflareDomain) => void;
  fetchDomainStats: (domainId: string) => void;
  loadingDomains: boolean;
  loadingDomainStats: boolean;
  domainStats: CloudflareStats | null;
  formatNumber: (num: number) => string;
  getTrafficChartData: () => any;
  chartOptions: ChartOptions<'line'>;
}

const WebsitesSection: React.FC<WebsitesSectionProps> = ({
  sortedCloudflareDomains,
  selectedDomain,
  setSelectedDomain,
  fetchDomainStats,
  loadingDomains,
  loadingDomainStats,
  domainStats,
  formatNumber,
  getTrafficChartData,
  chartOptions,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Websites List */}
    <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Websites</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {loadingDomains ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          sortedCloudflareDomains.map((domain) => (
            <div
              key={domain.id}
              className={`p-4 border dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedDomain?.id === domain.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => {
                setSelectedDomain(domain);
                fetchDomainStats(domain.id);
              }}
            >
              <h3 className="font-medium dark:text-white">{domain.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {domain.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Website Statistics Display */}
    <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        {selectedDomain ? selectedDomain.name : 'Select a website'}
      </h2>
      {loadingDomainStats ? (
        <WebsiteStatisticsSkeleton />
      ) : selectedDomain && domainStats ? (
        <div className="space-y-8">
          {/* Traffic Graph */}
          <div className="p-6 bg-white dark:bg-gray-700/50 rounded-lg transition-colors">
            <div className="w-full h-[300px]">
              {getTrafficChartData() && (
                <Line
                  data={getTrafficChartData()!}
                  options={chartOptions}
                />
              )}
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">Traffic Statistics</h3>
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-300">Total Requests (30 days)</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {formatNumber(domainStats.traffic.reduce((sum, day) => sum + day.requests, 0))}
                </p>
              </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">Daily Average</h3>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300">Average Daily Requests</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {formatNumber(Math.round(
                    domainStats.traffic.reduce((sum, day) => sum + day.requests, 0) / domainStats.traffic.length
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Select a website to view its statistics</p>
      )}
    </div>
  </div>
);

export default WebsitesSection; 