import React, { useEffect, useState } from 'react';
import { Project, ProjectStats, ApiResponse, SpigotMCStats, HuggingFaceModelStats, HuggingFaceResponse, HuggingFaceModelResponse, WebsiteStats, PaperStats, SteamWorkshopStats, SteamWorkshopResponse, SteamWorkshopItemResponse, CloudflareDomain, CloudflareStats } from '../types/statistics';
import ThemeToggle from '../components/ThemeToggle';
import StatisticsSkeleton from '../components/StatisticsSkeleton';
import WebsiteStatisticsSkeleton from '../components/WebsiteStatisticsSkeleton';
import Hero from '../components/Hero';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faJava, faPython } from '@fortawesome/free-brands-svg-icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import About from '../components/About';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DiscordBotStats {
  name: string;
  servers: number;
  estimatedUsers: number;
  isV2: boolean;
  lastUpdated: Date;
}

// Caching helpers
const CACHE_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours

function getCache(key: string) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION_MS) {
      return data;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

function setCache(key: string, data: any) {
  localStorage.setItem(
    key,
    JSON.stringify({ data, timestamp: Date.now() })
  );
}

const Projects: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'minecraft' | 'discord' | 'ai' | 'websites' | 'papers' | 'mods'>(
    location.state?.activeTab || 'papers'
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectStats | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [spigotStats, setSpigotStats] = useState<SpigotMCStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingSpigot, setLoadingSpigot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiscordBot, setSelectedDiscordBot] = useState<DiscordBotStats | null>(null);
  const [aiModels, setAiModels] = useState<HuggingFaceModelStats[]>([]);
  const [selectedAiModel, setSelectedAiModel] = useState<HuggingFaceModelStats | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingAiStats, setLoadingAiStats] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteStats | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<PaperStats | null>(null);
  const [steamMods, setSteamMods] = useState<SteamWorkshopStats[]>([]);
  const [selectedMod, setSelectedMod] = useState<SteamWorkshopStats | null>(null);
  const [loadingMods, setLoadingMods] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [cloudflareDomains, setCloudflareDomains] = useState<CloudflareDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<CloudflareDomain | null>(null);
  const [domainStats, setDomainStats] = useState<CloudflareStats | null>(null);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [loadingDomainStats, setLoadingDomainStats] = useState(false);

  const discordBots: DiscordBotStats[] = [
    {
      name: 'Auditlogger V2',
      servers: 275,
      estimatedUsers: 275 * 500,
      isV2: true,
      lastUpdated: new Date(),
    },
    {
      name: 'Auditlogger V1',
      servers: 6250,
      estimatedUsers: 6250 * 500,
      isV2: false,
      lastUpdated: new Date(),
    },
  ];

  const websites: WebsiteStats[] = [
    {
      name: 'Neuroswarm.org',
      url: 'https://neuroswarm.org',
      description: 'A project index site for all community projects related to the Neurosama AI twitch streamer.',
      uniqueVisitors30Days: 0,
      totalRequests30Days: 36990,
      dataServed30Days: 321,
      lastUpdated: new Date(),
    },
    {
      name: 'AssistantsLab.com',
      url: 'https://assistantslab.com',
      description: 'A non-profit AI organization, home to AI moderation and small language models.',
      uniqueVisitors30Days: 0,
      totalRequests30Days: 12090,
      dataServed30Days: 348,
      lastUpdated: new Date(),
    },
  ];

  const papers: PaperStats[] = [
    {
      title: 'Tiny-Toxic-Detector: A compact transformer-based model for toxic content detection',
      type: 'Preprint',
      url: 'https://doi.org/10.48550/arXiv.2409.02114',
      authors: ['Michiel Kamphuis'],
      abstract: 'This paper presents Tiny-toxic-detector, a compact transformer-based model designed for toxic content detection. Despite having only 2.1 million parameters, Tiny-toxic-detector achieves competitive performance on benchmark datasets, with 90.97% accuracy on ToxiGen and 86.98% accuracy on the Jigsaw dataset, rivaling models over 50 times its size. This efficiency enables deployment in resource-constrained environments, addressing the need for effective content moderation tools that balance performance with computational efficiency. The model architecture features 4 transformer encoder layers, each with 2 attention heads, an embedding dimension of 64, and a feedforward dimension of 128. Trained on both public and private datasets, Tiny-toxic-detector demonstrates the potential of efficient, task-specific models for addressing online toxicity. The paper covers the model architecture, training process, performance benchmarks, and limitations, underscoring its suitability for applications such as social media monitoring and content moderation. By achieving results comparable to much larger models while significantly reducing computational demands, Tiny-toxic-detector represents progress toward more sustainable and scalable AI-driven content moderation solutions.',
      lastUpdated: new Date('2024-08-29'),
    },
    {
      title: 'EasyMath: A 0-shot Math Benchmark for SLMs',
      type: 'Preprint',
      url: 'https://arxiv.org/abs/2505.14852',
      authors: ['Drishya Karki', 'Michiel Kamphuis', 'Angelecia Frey'],
      abstract: 'EasyMath is a compact benchmark for practical math reasoning in small language models. It covers thirteen categories, from basic arithmetic and order of operations to word problems, algebraic expressions, edge cases, and omits specialist topics. We tested 23 models (14M to 4B parameters) using exact, numerical, and symbolic checks on free-form answers in a zero-shot setting. Accuracy rises with size and training, chain-of-thought adds modest gains, and consistency improves at scale.',
      lastUpdated: new Date('2025-05-20'),
    },
    {
      title: 'Humanized SmolLM2 Models: Technical Report',
      type: 'Report',
      url: 'https://www.assistantslab.com/research/smollm2-report',
      authors: ['AssistantsLab Research Team'],
      abstract: 'This report details the development, training, evaluation, and limitations of the humanized variants of the SmolLM2 family of language models. These models have been optimized using Direct Preference Optimization (DPO) on the Human-Like-DPO-Dataset—with additional fine-tuning on the UltraFeedback dataset for the 135M variant—to generate more natural, human-like responses in conversational settings. We also discuss the benefits of using a system prompt that outlines the model`s personality to further enhance response quality.',
      lastUpdated: new Date(),
    },
  ];

  useEffect(() => {
    // Check if we have an activeTab in location state (from chart navigation)
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state after using it to prevent it from persisting on refresh
      window.history.replaceState({}, document.title);
    }
    
    // Load papers data first as it's hardcoded
    setLoading(false);

    // Load other data in the background
    const loadBackgroundData = async () => {
      try {
        // Load Minecraft plugins data
        fetchProjects().catch(console.error);
        
        // Load AI models data
        fetchAiModels().catch(console.error);
        
        // Load Steam Workshop mods data
        fetchSteamMods().catch(console.error);
      } catch (error) {
        console.error('Error loading background data:', error);
      }
    };

    loadBackgroundData();
  }, [location.state]); // Run when component mounts or location state changes

  useEffect(() => {
    fetchCloudflareData();
  }, []);

  const fetchCloudflareData = async () => {
    setLoadingDomains(true);
    try {
      const response = await fetch('https://api.michielo.com/api/statistics/cloudflare');
      if (!response.ok) {
        throw new Error('Failed to fetch Cloudflare domains');
      }
      const data = await response.json();
      setCloudflareDomains(data);
      
      // Select first domain by default
      if (data.length > 0) {
        setSelectedDomain(data[0]);
        fetchDomainStats(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching Cloudflare domains:', err);
    } finally {
      setLoadingDomains(false);
    }
  };

  const fetchDomainStats = async (domainId: string) => {
    setLoadingDomainStats(true);
    try {
      const response = await fetch(`https://api.michielo.com/api/statistics/cloudflare/${domainId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch domain statistics');
      }
      const data = await response.json();
      setDomainStats(data);
    } catch (err) {
      console.error('Error fetching domain statistics:', err);
    } finally {
      setLoadingDomainStats(false);
    }
  };

  const getTrafficChartData = () => {
    if (!domainStats) return null;

    const sortedTraffic = [...domainStats.traffic].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedTraffic.map(t => new Date(t.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Daily Requests',
          data: sortedTraffic.map(t => t.requests),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false
        }
      ]
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Traffic'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const fetchProjects = async () => {
    const cacheKey = 'projectsListCache';
    const cached = getCache(cacheKey);
    if (cached) {
      setProjects(cached);
      return;
    }
    try {
      const response = await fetch('https://api.michielo.com/api/statistics/mc/bstats');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data: ApiResponse<{ plugins: Project[] }> = await response.json();
      if (data.success) {
        setProjects(data.data.plugins);
        setCache(cacheKey, data.data.plugins);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchProjectStats = async (projectId: number) => {
    setSelectedProjectId(projectId);
    setLoadingStats(true);
    setLoadingSpigot(true);
    const statsCacheKey = `projectStatsCache_${projectId}`;
    const spigotCacheKey = `spigotStatsCache_${projectId}`;
    const cachedStats = getCache(statsCacheKey);
    const cachedSpigot = getCache(spigotCacheKey);
    if (cachedStats) setSelectedProject(cachedStats);
    if (cachedSpigot) setSpigotStats(cachedSpigot);
    if (cachedStats && cachedSpigot) {
      setLoadingStats(false);
      setLoadingSpigot(false);
      return;
    }
    try {
      const [statsResponse, spigotResponse] = await Promise.all([
        cachedStats ? null : fetch(`https://api.michielo.com/api/statistics/mc/bstats/${projectId}`),
        cachedSpigot ? null : fetch(`https://api.michielo.com/api/statistics/mc/spigotmc/${projectId}`)
      ]);

      if (!cachedStats && statsResponse && !statsResponse.ok) {
        throw new Error('Failed to fetch project statistics');
      }
      if (!cachedSpigot && spigotResponse && !spigotResponse.ok) {
        setSpigotStats(null);
      }

      if (!cachedStats && statsResponse) {
        const statsData: ApiResponse<ProjectStats> = await statsResponse.json();
        if (statsData.success) {
          setSelectedProject(statsData.data);
          setCache(statsCacheKey, statsData.data);
        } else {
          throw new Error(statsData.message);
        }
      }
      if (!cachedSpigot && spigotResponse && spigotResponse.ok) {
        const spigotData: ApiResponse<SpigotMCStats> = await spigotResponse.json();
        if (spigotData.success) {
          setSpigotStats(spigotData.data);
          setCache(spigotCacheKey, spigotData.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingStats(false);
      setLoadingSpigot(false);
    }
  };

  const fetchAiModels = async () => {
    const cacheKey = 'aiModelsListCache';
    const cached = getCache(cacheKey);
    if (cached) {
      setAiModels(cached);
      return;
    }
    try {
      const response = await fetch('https://api.michielo.com/api/statistics/hf');
      if (!response.ok) {
        throw new Error('Failed to fetch AI models');
      }
      const data: HuggingFaceResponse = await response.json();
      if (data.success) {
        setAiModels(data.data.models);
        setCache(cacheKey, data.data.models);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error fetching AI models:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchAiModelStats = async (modelId: string) => {
    setLoadingAiStats(true);
    const cacheKey = `aiModelStatsCache_${modelId}`;
    const cached = getCache(cacheKey);
    if (cached) {
      setSelectedAiModel(cached);
      setLoadingAiStats(false);
      return;
    }
    try {
      const response = await fetch(`https://api.michielo.com/api/statistics/hf/${modelId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch AI model statistics');
      }
      const data: HuggingFaceModelResponse = await response.json();
      if (data.success) {
        setSelectedAiModel(data.data);
        setCache(cacheKey, data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingAiStats(false);
    }
  };

  const fetchSteamMods = async () => {
    setLoadingMods(true);
    const listCacheKey = 'steamModsListCache';
    const cachedList = getCache(listCacheKey);
    let validMods = null;
    if (cachedList) {
      validMods = cachedList;
      setSteamMods(validMods);
      if (validMods.length > 0 && !selectedMod) {
        setSelectedMod(validMods[0]);
      }
      setLoadingMods(false);
      return;
    }
    try {
      const response = await fetch('https://api.michielo.com/api/statistics/steam');
      if (!response.ok) {
        throw new Error('Failed to fetch Steam Workshop mods');
      }
      const data = await response.json();
      const workshopIds = data.workshop_ids || [];
      // Fetch details for each workshop item
      const modsData = await Promise.all(
        workshopIds.map(async (id: string) => {
          const modCacheKey = `steamModCache_${id}`;
          const cachedMod = getCache(modCacheKey);
          if (cachedMod) return cachedMod;
          try {
            const modResponse = await fetch(`https://api.michielo.com/api/statistics/steam/${id}`);
            if (!modResponse.ok) return null;
            const modData = await modResponse.json();
            // Add game name (hardcoded for now)
            if (id === '1865844684') {
              modData.game = 'Hearts Of Iron 4';
            }
            setCache(modCacheKey, modData);
            return modData;
          } catch (err) {
            console.error(`Error fetching mod ${id}:`, err);
            return null;
          }
        })
      );
      validMods = modsData.filter(Boolean);
      setSteamMods(validMods);
      setCache(listCacheKey, validMods);
      // If no mod is selected yet and we have mods, select the first one
      if (validMods.length > 0 && !selectedMod) {
        setSelectedMod(validMods[0]);
      }
    } catch (err) {
      console.error('Error fetching Steam Workshop mods:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoadingMods(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getAuthorFromPath = (fullPath: string): string => {
    return fullPath.split('/')[0];
  };

  const renderDiscordBotSection = () => (
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

  const renderWebsitesSection = () => (
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
            cloudflareDomains.map((domain) => (
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

  const renderPapersSection = () => (
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
            <div className="inline-block px-3 py-1 rounded-full text-sm font-medium
              ${selectedPaper.type === 'Preprint' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                selectedPaper.type === 'Peer Review' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'}">
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

  const renderModsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Steam Workshop Mods List */}
      <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Steam Workshop Mods</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {loadingMods ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : steamMods.length > 0 ? (
            steamMods.map((mod) => (
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

  const renderAiModelsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* AI Models List */}
      <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">AI Models</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {aiModels.map((model) => (
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <Hero />
      
      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Projects</h2>
        
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'papers'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Papers
          </button>
          <button
            onClick={() => setActiveTab('minecraft')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'minecraft'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Plugins
          </button>
          <button
            onClick={() => setActiveTab('discord')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'discord'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Discord Bots
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'ai'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            AI Models
          </button>
          <button
            onClick={() => setActiveTab('websites')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'websites'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Websites
          </button>
          <button
            onClick={() => setActiveTab('mods')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'mods'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Mods
          </button>
        </div>

        {/* Content Section */}
        {activeTab === 'minecraft' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Projects List */}
            <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">Plugins</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 border dark:border-gray-700 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedProjectId === project.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => fetchProjectStats(project.id)}
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
                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
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
                      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">Server Statistics</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-blue-600 dark:text-blue-300">Total Server Hours</p>
                            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                              {formatNumber(Math.round(selectedProject.servers.total_hours))}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors">
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
        ) : activeTab === 'discord' ? (
          renderDiscordBotSection()
        ) : activeTab === 'websites' ? (
          renderWebsitesSection()
        ) : activeTab === 'papers' ? (
          renderPapersSection()
        ) : activeTab === 'mods' ? (
          renderModsSection()
        ) : (
          renderAiModelsSection()
        )}
      </div>
      
      {/* Divider - Full width */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 my-8"></div>
      <About showDiscordModal={showDiscordModal} setShowDiscordModal={setShowDiscordModal} />
    </div>
  );
};

export default Projects;