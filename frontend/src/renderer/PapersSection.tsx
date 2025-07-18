import React from 'react';
import { PaperStats } from '../types/statistics';

interface PapersSectionProps {
  papers: PaperStats[];
  selectedPaper: PaperStats | null;
  setSelectedPaper: (paper: PaperStats) => void;
}

const PapersSection: React.FC<PapersSectionProps> = ({
  papers,
  selectedPaper,
  setSelectedPaper,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Papers List */}
    <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Papers</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {papers.map((paper) => (
          <div
            key={paper.title}
            className={`p-4 border dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedPaper?.title === paper.title
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setSelectedPaper(paper)}
          >
            <h3 className="font-medium dark:text-white">{paper.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {paper.type}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Paper Details Display */}
    <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        {selectedPaper ? selectedPaper.title : 'Select a paper'}
      </h2>
      {selectedPaper ? (
        <div className="space-y-8">
          {/* Paper Type Badge */}
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            selectedPaper.type === 'Preprint' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
            selectedPaper.type === 'Peer Review' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
          }`}>
            {selectedPaper.type}
          </div>

          {/* Authors */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Authors</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {selectedPaper.authors.join(', ')}
            </p>
          </div>

          {/* Abstract */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Abstract</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {selectedPaper.abstract}
            </p>
            <a
              href={selectedPaper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Read Paper →
            </a>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {selectedPaper.lastUpdated.toLocaleString()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Select a paper to view its details</p>
      )}
    </div>
  </div>
);

export default PapersSection; 