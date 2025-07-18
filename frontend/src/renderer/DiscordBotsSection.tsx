import React from 'react';
// Local definition since not exported from types/statistics
interface DiscordBotStats {
  name: string;
  servers: number;
  estimatedUsers: number;
  isV2: boolean;
  lastUpdated: Date;
}

interface DiscordBotsSectionProps {
  discordBots: DiscordBotStats[];
  selectedDiscordBot: DiscordBotStats | null;
  setSelectedDiscordBot: (bot: DiscordBotStats) => void;
  formatNumber: (num: number) => string;
}

const DiscordBotsSection: React.FC<DiscordBotsSectionProps> = ({
  discordBots,
  selectedDiscordBot,
  setSelectedDiscordBot,
  formatNumber,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Discord Bots List */}
    <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Discord Bots</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {discordBots.map((bot) => (
          <div
            key={bot.name}
            className={`p-4 border dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedDiscordBot?.name === bot.name
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setSelectedDiscordBot(bot)}
          >
            <h3 className="font-medium dark:text-white">{bot.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {bot.isV2 ? 'Active' : 'End-of-life'}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Discord Bot Statistics Display */}
    <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        {selectedDiscordBot ? selectedDiscordBot.name : 'Select a bot'}
      </h2>
      {selectedDiscordBot ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300">Server Statistics</h3>
              <p className="text-purple-600 dark:text-purple-300">
                Active Servers: <span className="text-xl font-bold">{formatNumber(selectedDiscordBot.servers)}</span>
              </p>
            </div>
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
              <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">User Statistics</h3>
              <p className="text-blue-600 dark:text-blue-300">
                Estimated Users: <span className="text-xl font-bold">{formatNumber(selectedDiscordBot.estimatedUsers)}</span>
              </p>
            </div>
          </div>

          {/* Installation Section */}
          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors">
            <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-300">Installation</h3>
            {selectedDiscordBot.isV2 ? (
              <a
                href="https://auditlogger.nodelegend.com/#install"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Install Bot
              </a>
            ) : (
              <div className="space-y-2">
                <div className="text-red-600 dark:text-red-400 font-medium">
                  End-of-life, please see V2
                </div>
                <div className="text-sm">
                  <a
                    href="https://discord.com/oauth2/authorize?client_id=1026735525501087815&permissions=140123688064&scope=bot+applications.commands"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    To install regardless, click <span className="underline mx-1">here</span>
                    <svg
                      className="w-4 h-4 ml-0.5"
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
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {selectedDiscordBot.lastUpdated.toLocaleString()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Select a bot to view its statistics</p>
      )}
    </div>
  </div>
);

export default DiscordBotsSection; 