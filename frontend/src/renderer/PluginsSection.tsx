import React from 'react';
import StatisticsSkeleton from '../components/StatisticsSkeleton';
import { Project, ProjectStats, SpigotMCStats } from '../types/statistics';

interface PluginsSectionProps {
  sortedProjects: Project[];
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number) => void;
  fetchProjectStats: (id: number) => void;
  projects: Project[];
  selectedProject: ProjectStats | null;
  loadingStats: boolean;
  loadingSpigot: boolean;
  spigotStats: SpigotMCStats | null;
  theme: string;
  formatNumber: (num: number) => string;
}

const PluginsSection: React.FC<PluginsSectionProps> = ({
  sortedProjects,
  selectedProjectId,
  setSelectedProjectId,
  fetchProjectStats,
  projects,
  selectedProject,
  loadingStats,
  loadingSpigot,
  spigotStats,
  theme,
  formatNumber,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Projects List */}
    <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Plugins</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {sortedProjects.map((project) => (
          <div
            key={project.id}
            className={`p-4 border dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedProjectId === project.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => {
              setSelectedProjectId(project.id);
              fetchProjectStats(project.id);
            }}
          >
            <h3 className="font-medium dark:text-white">{project.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">by {project.owner.name}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <a
          href="https://www.spigotmc.org/resources/authors/michielo.831116/"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors text-white ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-700 hover:bg-blue-800'}`}
        >
          See More Plugins
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>

    {/* Statistics Display */}
    <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        {selectedProjectId ? projects.find(p => p.id === selectedProjectId)?.name : 'Select a plugin'}
      </h2>
      <div className="transition-opacity duration-200 ease-in-out">
        {loadingStats ? (
          <StatisticsSkeleton />
        ) : selectedProject ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors relative">
                <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">Server Statistics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Total Server Hours</p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                      {formatNumber(Math.round(selectedProject.servers.total_hours))}
                    </p>
                  </div>
                </div>
                {/* Bstats Tag */}
                <span className="absolute bottom-1.5 right-1.5 flex items-center justify-center w-12 h-5 rounded-full border border-blue-200 dark:border-blue-400 bg-white/80 dark:bg-gray-900/80 text-[10px] font-normal text-blue-400 dark:text-blue-300 select-none" style={{letterSpacing: '0.02em'}}>
                  Bstats
                </span>
              </div>

              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors relative">
                <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-300">Player Statistics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-300">Total Player Hours</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {formatNumber(Math.round(selectedProject.players.total_hours))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-300">Estimated Unique Players</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {formatNumber(selectedProject.players.estimated_uniques)}
                    </p>
                  </div>
                </div>
                {/* Bstats Tag */}
                <span className="absolute bottom-1.5 right-1.5 flex items-center justify-center w-12 h-5 rounded-full border border-green-200 dark:border-green-400 bg-white/80 dark:bg-gray-900/80 text-[10px] font-normal text-green-400 dark:text-green-300 select-none" style={{letterSpacing: '0.02em'}}>
                  Bstats
                </span>
              </div>
            </div>

            {/* SpigotMC Statistics */}
            {!loadingSpigot && spigotStats && (
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors">
                <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">SpigotMC Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Total Downloads</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        {formatNumber(spigotStats.downloads)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Resource ID</p>
                      <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                        #{spigotStats.resource_id}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Rating</p>
                      <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                        ★ {spigotStats.rating.average === 0 ? '?' : spigotStats.rating.average.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <a
                        href={spigotStats.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 transition-colors"
                      >
                        View on SpigotMC →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* No SpigotMC page found message */}
            {!loadingSpigot && !spigotStats && (
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors flex items-center justify-center min-h-[140px]">
                <div className="text-center w-full">
                  <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">SpigotMC Statistics</h3>
                  <div className="text-purple-800 dark:text-purple-200 whitespace-pre-line text-base font-medium">
                    {`No SpigotMC page found!\nMaybe this plugin is closed-source?`}
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(selectedProject.last_updated).toLocaleString()}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Select a plugin to view its statistics</p>
        )}
      </div>
    </div>
  </div>
);

export default PluginsSection; 