import React from 'react';
import StatisticsSkeleton from '../components/StatisticsSkeleton';
import { SteamWorkshopStats } from '../types/statistics';

interface ModsSectionProps {
  sortedSteamMods: SteamWorkshopStats[];
  selectedMod: SteamWorkshopStats | null;
  setSelectedMod: (mod: SteamWorkshopStats) => void;
  loadingMods: boolean;
  formatNumber: (num: number) => string;
}

const ModsSection: React.FC<ModsSectionProps> = ({
  sortedSteamMods,
  selectedMod,
  setSelectedMod,
  loadingMods,
  formatNumber,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Steam Workshop Mods List */}
    <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Steam Workshop Mods</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {loadingMods ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : sortedSteamMods.length > 0 ? (
          sortedSteamMods.map((mod) => (
            <div
              key={mod.workshop_id}
              className={`p-4 border dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedMod?.workshop_id === mod.workshop_id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedMod(mod)}
            >
              <h3 className="font-medium dark:text-white">{mod.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mod.game}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No mods found</p>
        )}
      </div>
    </div>

    {/* Steam Workshop Mod Details Display */}
    <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        {selectedMod ? selectedMod.title : 'Select a mod'}
      </h2>
      {loadingMods ? (
        <StatisticsSkeleton />
      ) : selectedMod ? (
        <div className="space-y-8">
          {/* Mod Preview */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Preview</h3>
            <img
              src={selectedMod.preview_url}
              alt={selectedMod.title}
              className="w-full h-auto rounded-lg max-h-64 object-cover"
            />
            <a
              href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${selectedMod.workshop_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              View on Steam Workshop →
            </a>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">Traffic Statistics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300">Unique Downloads</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {formatNumber(selectedMod.unique_visitors || selectedMod.views)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-300">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {formatNumber(selectedMod.subscriptions)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">Engagement</h3>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300">Currently Favorited</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {formatNumber(selectedMod.favorited)}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-blue-600 dark:text-blue-300">File Size</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {Math.round(selectedMod.file_size / (1024 * 1024))} MB
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date(selectedMod.time_updated * 1000).toLocaleString()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Select a mod to view its details</p>
      )}
    </div>
  </div>
);

export default ModsSection; 