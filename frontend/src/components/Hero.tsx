import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ApiResponse, ProjectStats, SpigotMCStats, HuggingFaceModelStats } from '../types/statistics';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface HeroProps {
  name?: string;
}

interface ImpactData {
  category: string;
  count: number;
  color: string;
  hoverColor: string;
  source: string;
  tabName: 'minecraft' | 'discord' | 'ai' | 'websites' | 'papers' | 'mods';
}

// Caching helpers
const HERO_STATS_CACHE_KEY = 'heroStatsCache';
const CACHE_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours

function getCachedHeroStats() {
  const cached = localStorage.getItem(HERO_STATS_CACHE_KEY);
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

function setCachedHeroStats(data: any) {
  localStorage.setItem(
    HERO_STATS_CACHE_KEY,
    JSON.stringify({ data, timestamp: Date.now() })
  );
}

const Hero: React.FC<HeroProps> = ({ name = 'Michiel' }) => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [impactData, setImpactData] = useState<ImpactData[]>([
    { 
      category: 'Plugins', 
      count: 0, 
      color: '#3B82F6', 
      hoverColor: '#2563EB',
      source: 'Players on servers with my plugins',
      tabName: 'minecraft'
    },
    { 
      category: 'Discord', 
      count: 0, 
      color: '#8B5CF6', 
      hoverColor: '#7C3AED',
      source: 'Users in servers with my bots',
      tabName: 'discord'
    },
    { 
      category: 'AI Models', 
      count: 0, 
      color: '#10B981', 
      hoverColor: '#059669',
      source: 'Model downloads',
      tabName: 'ai'
    },
    { 
      category: 'Mods', 
      count: 0, 
      color: '#F59E0B', 
      hoverColor: '#D97706',
      source: 'Unique downloads of Steam Workshop mods',
      tabName: 'mods'
    },
  ]);
  const [totalImpact, setTotalImpact] = useState(0);
  
  // Fetch data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      
      // 1. Try to get from cache
      const cached = getCachedHeroStats();
      if (cached) {
        setImpactData(cached.impactData);
        setTotalImpact(cached.totalImpact);
        setIsLoading(false);
        return;
      }
      
      // 2. Otherwise, fetch as normal
      try {
        // Fetch Minecraft data
        const minecraftData = await fetchMinecraftData();
        
        // Fetch Discord data (hardcoded in this case)
        const discordData = getDiscordData();
        
        // Fetch AI models data
        const aiModelsData = await fetchAiModelsData();
        
        // Fetch Steam Workshop mods data
        const steamModsData = await fetchSteamModsData();
        
        // Update impact data with real values
        const updatedImpactData = [
          { 
            category: 'Plugins', 
            count: minecraftData, 
            color: '#3B82F6', 
            hoverColor: '#2563EB',
            source: 'Players on servers with my plugins',
            tabName: 'minecraft' as const
          },
          { 
            category: 'Discord', 
            count: discordData, 
            color: '#8B5CF6', 
            hoverColor: '#7C3AED',
            source: 'Users in servers with my bots',
            tabName: 'discord' as const
          },
          { 
            category: 'AI Models', 
            count: aiModelsData, 
            color: '#10B981', 
            hoverColor: '#059669',
            source: 'Model downloads',
            tabName: 'ai' as const
          },
          { 
            category: 'Mods', 
            count: steamModsData, 
            color: '#F59E0B', 
            hoverColor: '#D97706',
            source: 'Unique downloads of Steam Workshop mods',
            tabName: 'mods' as const
          },
        ];
        
        const total = updatedImpactData.reduce((sum, item) => sum + item.count, 0);
        
        setImpactData(updatedImpactData);
        setTotalImpact(total);
        
        // 3. Save to cache
        setCachedHeroStats({ impactData: updatedImpactData, totalImpact: total });
      } catch (error) {
        console.error('Error fetching impact data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, []);
  
  // Fetch Minecraft data from API
  const fetchMinecraftData = async (): Promise<number> => {
    try {
      // Fetch all projects first
      const projectsResponse = await fetch('https://api.michielo.com/api/statistics/mc/bstats');
      if (!projectsResponse.ok) {
        throw new Error('Failed to fetch Minecraft projects');
      }
      
      const projectsData: ApiResponse<{ plugins: { id: number }[] }> = await projectsResponse.json();
      if (!projectsData.success || !projectsData.data.plugins) {
        throw new Error('Invalid Minecraft projects data');
      }
      
      // Fetch stats for each project
      const projectStats = await Promise.all(
        projectsData.data.plugins.map(async (project) => {
          try {
            const statsResponse = await fetch(`https://api.michielo.com/api/statistics/mc/bstats/${project.id}`);
            if (!statsResponse.ok) return null;
            
            const statsData: ApiResponse<ProjectStats> = await statsResponse.json();
            if (!statsData.success) return null;
            
            return statsData.data;
          } catch (error) {
            console.error(`Error fetching stats for project ${project.id}:`, error);
            return null;
          }
        })
      );
      
      // Calculate total unique players
      const totalPlayers = projectStats
        .filter(Boolean)
        .reduce((sum, stats) => sum + (stats?.players.estimated_uniques || 0), 0);
      
      return totalPlayers;
    } catch (error) {
      console.error('Error in fetchMinecraftData:', error);
      // Fallback to hardcoded value if API fails
      return 150000;
    }
  };
  
  // Get Discord data (hardcoded as in the original code)
  const getDiscordData = (): number => {
    const discordBots = [
      {
        name: 'Auditlogger V2',
        servers: 275,
        estimatedUsers: 275 * 500,
      },
      {
        name: 'Auditlogger V1',
        servers: 6250,
        estimatedUsers: 6250 * 500,
      },
    ];
    
    return discordBots.reduce((sum, bot) => sum + bot.estimatedUsers, 0);
  };
  
  // Fetch AI models data from API
  const fetchAiModelsData = async (): Promise<number> => {
    try {
      const response = await fetch('https://api.michielo.com/api/statistics/hf');
      if (!response.ok) {
        throw new Error('Failed to fetch AI models');
      }
      
      const data: ApiResponse<{ models: HuggingFaceModelStats[] }> = await response.json();
      if (!data.success || !data.data.models) {
        throw new Error('Invalid AI models data');
      }
      
      // Fetch stats for each model to get download counts
      const modelStats = await Promise.all(
        data.data.models.map(async (model) => {
          try {
            const statsResponse = await fetch(`https://api.michielo.com/api/statistics/hf/${model.model_id}`);
            if (!statsResponse.ok) return null;
            
            const statsData: ApiResponse<HuggingFaceModelStats> = await statsResponse.json();
            if (!statsData.success) return null;
            
            return statsData.data;
          } catch (error) {
            console.error(`Error fetching stats for model ${model.model_id}:`, error);
            return null;
          }
        })
      );
      
      // Calculate total downloads
      const totalDownloads = modelStats
        .filter(Boolean)
        .reduce((sum, stats) => sum + (stats?.downloads || 0), 0);
      
      return totalDownloads;
    } catch (error) {
      console.error('Error in fetchAiModelsData:', error);
      // Fallback to hardcoded value if API fails
      return 250000;
    }
  };
  
  // Fetch Steam Workshop mods data
  const fetchSteamModsData = async (): Promise<number> => {
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
          try {
            const modResponse = await fetch(`https://api.michielo.com/api/statistics/steam/${id}`);
            if (!modResponse.ok) return null;
            
            const modData = await modResponse.json();
            return modData;
          } catch (err) {
            console.error(`Error fetching mod ${id}:`, err);
            return null;
          }
        })
      );
      
      // Calculate total unique visitors (or views if unique_visitors is null)
      const totalVisitors = modsData
        .filter(Boolean)
        .reduce((sum, mod) => sum + (mod.unique_visitors || mod.views || 0), 0);
      
      return totalVisitors;
    } catch (error) {
      console.error('Error in fetchSteamModsData:', error);
      // Fallback to hardcoded value if API fails
      return 23000;
    }
  };
  
  // Animate counter when totalImpact changes
  useEffect(() => {
    if (totalImpact <= 0) return;
    
    // Animation duration in ms
    const duration = 2500;
    // Start time
    const startTime = Date.now();
    // Initial count
    const initialCount = 0;
    
    // Animation frame function for counter
    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.floor(initialCount + easedProgress * (totalImpact - initialCount));
      
      setCount(newCount);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    // Start the counter animation
    requestAnimationFrame(updateCount);
  }, [totalImpact]);

  // Navigate to the corresponding project section when a chart slice is clicked
  const handleChartClick = (event: any, elements: any) => {
    if (elements && elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedItem = impactData[clickedIndex];
      
      // Navigate to the projects section with the appropriate tab selected
      navigate('/', { state: { activeTab: clickedItem.tabName } });
      
      // Scroll to the projects section
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  // Chart.js configuration for the actual data chart
  const chartData = {
    labels: impactData.map(item => item.category),
    datasets: [
      {
        data: impactData.map(item => item.count),
        backgroundColor: impactData.map(item => item.color),
        hoverBackgroundColor: impactData.map(item => item.hoverColor),
        borderWidth: 0,
      },
    ],
  };
  
  // Chart.js configuration for the placeholder chart (gray version)
  const placeholderChartData = {
    labels: impactData.map(item => item.category),
    datasets: [
      {
        data: [1, 1, 1], // Equal parts for placeholder
        backgroundColor: ['#E5E7EB', '#D1D5DB', '#9CA3AF'], // Different shades of gray
        borderWidth: 0,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '40%',
    onClick: handleChartClick,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex;
            return impactData[index].category;
          },
          label: (context: any) => {
            const index = context.dataIndex;
            const value = context.raw || 0;
            const percentage = Math.round((value / totalImpact) * 100);
            
            return [
              `${value.toLocaleString()} people (${percentage}%)`,
              `Source: ${impactData[index].source}`,
              'Click to view details'
            ];
          },
        },
        titleFont: {
          weight: 'bold' as const,
          size: 16
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        displayColors: false,
      },
    },
    // Add 3D effect with rotation
    rotation: -0.6 * Math.PI,
  };
  
  // Simplified options for placeholder chart (no tooltips)
  const placeholderChartOptions = {
    ...chartOptions,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    events: [], // Disable all events on the placeholder chart
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side: Welcome message */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Hey, I'm <span className="text-blue-600 dark:text-blue-400">{name}</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              I build tools, plugins, and AI models that help people around the world.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Explore My Work
              </button>
            </div>
          </div>
          
          {/* Right side: Pie chart and counter */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4 w-64 h-64 md:w-72 md:h-72">
              <div className="transform rotate-[-15deg] perspective-1000 cursor-pointer">
                {isLoading ? (
                  <Doughnut data={placeholderChartData} options={placeholderChartOptions} />
                ) : (
                  <Doughnut data={chartData} options={chartOptions} />
                )}
              </div>
            </div>
            
            {/* Counter display */}
            <div className="text-center">
              <span className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 block">
                {isLoading ? '...' : count.toLocaleString()}
              </span>
              <span className="text-sm md:text-base text-gray-600 dark:text-gray-400 block">
                People Impacted
              </span>
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex justify-center gap-6 text-sm">
              {impactData.map((item, index) => (
                <div 
                  key={item.category} 
                  className={`flex items-center cursor-pointer transition-transform hover:scale-105 ${isLoading ? 'opacity-50' : ''}`}
                  onMouseEnter={() => !isLoading && setHoveredSlice(index)}
                  onMouseLeave={() => !isLoading && setHoveredSlice(null)}
                  onClick={() => {
                    if (!isLoading) {
                      navigate('/', { state: { activeTab: item.tabName } });
                      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                    }
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: isLoading ? 
                      ['#E5E7EB', '#D1D5DB', '#9CA3AF'][index] : item.color 
                    }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 