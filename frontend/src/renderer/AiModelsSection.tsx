import React from 'react';
import StatisticsSkeleton from '../components/StatisticsSkeleton';
import { HuggingFaceModelStats } from '../types/api-responses';

interface AiModelsSectionProps {
  sortedAiModels: HuggingFaceModelStats[];
  selectedAiModel: HuggingFaceModelStats | null;
  fetchAiModelStats: (modelId: string) => void;
  loadingAiStats: boolean;
  formatNumber: (num: number) => string;
  getAuthorFromPath: (fullPath: string) => string;
}

const AiModelsSection: React.FC<AiModelsSectionProps> = ({
  sortedAiModels,
  selectedAiModel,
  fetchAiModelStats,
  loadingAiStats,
  formatNumber,
  getAuthorFromPath,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* AI Models List */}
    <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">AI Models</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {sortedAiModels.map((model) => (
          <div
            key={model.model_id}
            className={`p-4 border dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedAiModel?.model_id === model.model_id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => fetchAiModelStats(model.model_id)}
          >
            <h3 className="font-medium dark:text-white">{model.model_id}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              by {getAuthorFromPath(model.full_path)}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* AI Model Statistics Display */}
    <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        {selectedAiModel ? selectedAiModel.model_id : 'Select a model'}
      </h2>
      {loadingAiStats ? (
        <StatisticsSkeleton type="ai" />
      ) : selectedAiModel ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">Model Statistics</h3>
              <div className="space-y-4">
                {selectedAiModel.downloads !== undefined && (
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Total Downloads</p>
                    <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      {formatNumber(selectedAiModel.downloads)}
                    </p>
                  </div>
                )}
                {selectedAiModel.author && (
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Author</p>
                    <a
                      href={selectedAiModel.author.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-purple-800 dark:text-purple-200 hover:text-purple-600 dark:hover:text-purple-300"
                    >
                      {selectedAiModel.author.name}
                    </a>
                  </div>
                )}
                <div>
                  <a
                    href={selectedAiModel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 transition-colors"
                  >
                    View on HuggingFace →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Select a model to view its statistics</p>
      )}
    </div>
  </div>
);

export default AiModelsSection; 