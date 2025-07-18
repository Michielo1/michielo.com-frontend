import React, { useEffect, useState, useCallback } from 'react';
import { Project, ProjectStats, SpigotMCStats, PaperStats, SteamWorkshopStats, CloudflareDomain, CloudflareStats } from '../types/statistics';
import { HuggingFaceModelStats } from '../types/api-responses';
import ThemeToggle from '../components/ThemeToggle';
import ModsSection from '../renderer/ModsSection';
import DiscordBotsSection from '../renderer/DiscordBotsSection';
import { getCache, setCache } from '../utils/cache';
import Hero from '../components/Hero';
import { useLocation } from 'react-router-dom';
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
import { useTheme } from '../context/ThemeContext';
import PluginsSection from '../renderer/PluginsSection';
import PapersSection from '../renderer/PapersSection';
import AiModelsSection from '../renderer/AiModelsSection';
import WebsitesSection from '../renderer/WebsitesSection';
import { sortProjects, sortAiModels, sortSteamMods, sortCloudflareDomains } from '../utils/sorting';
import {
  fetchSteamModsApi,
  fetchProjectsApi,
  fetchProjectStatsApi,
  fetchAiModelsApi,
  fetchAiModelStatsApi,
  fetchCloudflareDataApi,
  fetchDomainStatsApi,
} from '../utils/api';

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
  const [loadingAiStats, setLoadingAiStats] = useState(false);
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
  const { theme } = useTheme();

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

  const fetchSteamMods = useCallback(() =>
    fetchSteamModsApi(getCache, setCache, selectedMod, setSteamMods, setSelectedMod, setLoadingMods, setError),
    [selectedMod]
  );

  const fetchDomainStats = useCallback((domainId: string) =>
    fetchDomainStatsApi(domainId, setDomainStats, setLoadingDomainStats),
    []
  );

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

  const fetchCloudflareData = useCallback(() =>
    fetchCloudflareDataApi(setCloudflareDomains, fetchDomainStats, setLoadingDomains),
    [fetchDomainStats]
  );

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
  }, [location.state, fetchSteamMods]);

  useEffect(() => {
    fetchCloudflareData();
  }, [fetchCloudflareData]);

  const fetchProjects = () =>
    fetchProjectsApi(getCache, setCache, setProjects, setError);

  const fetchProjectStats = (projectId: number) => {
    setSelectedProjectId(projectId);
    fetchProjectStatsApi(
      projectId,
      getCache,
      setSelectedProject,
      setSpigotStats,
      setLoadingStats,
      setLoadingSpigot,
      setError,
      setCache
    );
  };

  const fetchAiModels = () =>
    fetchAiModelsApi(getCache, setCache, setAiModels, setError);

  const fetchAiModelStats = (modelId: string) =>
    fetchAiModelStatsApi(
      modelId,
      getCache,
      setSelectedAiModel,
      setLoadingAiStats,
      setError,
      setCache
    );

  useEffect(() => {
    fetchSteamMods();
  }, [fetchSteamMods]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getAuthorFromPath = (fullPath: string): string => {
    return fullPath.split('/')[0];
  };

  const sortedProjects = React.useMemo(() => sortProjects(projects), [projects]);
  const sortedAiModels = React.useMemo(() => sortAiModels(aiModels), [aiModels]);
  const sortedSteamMods = React.useMemo(() => sortSteamMods(steamMods), [steamMods]);
  const sortedCloudflareDomains = React.useMemo(() => sortCloudflareDomains(cloudflareDomains), [cloudflareDomains]);

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
                ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-700 text-white')
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Papers
          </button>
          <button
            onClick={() => setActiveTab('minecraft')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'minecraft'
                ? (theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white')
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Minecraft Plugins
          </button>
          <button
            onClick={() => setActiveTab('discord')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'discord'
                ? (theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white')
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Discord Bots
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'ai'
                ? (theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white')
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            AI Models
          </button>
          <button
            onClick={() => setActiveTab('websites')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'websites'
                ? (theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white')
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Websites
          </button>
          <button
            onClick={() => setActiveTab('mods')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'mods'
                ? (theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white')
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Mods
          </button>
        </div>

        {/* Content Section */}
        {activeTab === 'minecraft' ? (
          <PluginsSection
            sortedProjects={sortedProjects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            fetchProjectStats={fetchProjectStats}
            projects={projects}
            selectedProject={selectedProject}
            loadingStats={loadingStats}
            loadingSpigot={loadingSpigot}
            spigotStats={spigotStats}
            theme={theme}
            formatNumber={formatNumber}
          />
        ) : activeTab === 'discord' ? (
          <DiscordBotsSection
            discordBots={discordBots}
            selectedDiscordBot={selectedDiscordBot}
            setSelectedDiscordBot={setSelectedDiscordBot}
            formatNumber={formatNumber}
          />
        ) : activeTab === 'websites' ? (
          <WebsitesSection
            sortedCloudflareDomains={sortedCloudflareDomains}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            fetchDomainStats={fetchDomainStats}
            loadingDomains={loadingDomains}
            loadingDomainStats={loadingDomainStats}
            domainStats={domainStats}
            formatNumber={formatNumber}
            getTrafficChartData={getTrafficChartData}
            chartOptions={chartOptions}
          />
        ) : activeTab === 'papers' ? (
          <PapersSection
            papers={papers}
            selectedPaper={selectedPaper}
            setSelectedPaper={setSelectedPaper}
          />
        ) : activeTab === 'mods' ? (
          <ModsSection
            sortedSteamMods={sortedSteamMods}
            selectedMod={selectedMod}
            setSelectedMod={setSelectedMod}
            loadingMods={loadingMods}
            formatNumber={formatNumber}
          />
        ) : (
          <AiModelsSection
            sortedAiModels={sortedAiModels}
            selectedAiModel={selectedAiModel}
            fetchAiModelStats={fetchAiModelStats}
            loadingAiStats={loadingAiStats}
            formatNumber={formatNumber}
            getAuthorFromPath={getAuthorFromPath}
          />
        )}
      </div>
      
      {/* Divider - Full width */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 my-8"></div>
      <About showDiscordModal={showDiscordModal} setShowDiscordModal={setShowDiscordModal} />
    </div>
  );
};

export default Projects;