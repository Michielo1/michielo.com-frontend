// API utility functions for fetching data

export async function fetchSteamModsApi(getCache: any, setCache: any, selectedMod: any, setSteamMods: any, setSelectedMod: any, setLoadingMods: any, setError: any) {
  setLoadingMods(true);
  const listCacheKey = 'steamModsListCache';
  const cachedList = getCache(listCacheKey);
  let validMods = null;
  if (cachedList) {
    validMods = cachedList;
    setSteamMods(validMods);
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
  } catch (err) {
    console.error('Error fetching Steam Workshop mods:', err);
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoadingMods(false);
  }
}

export async function fetchProjectsApi(getCache: any, setCache: any, setProjects: any, setError: any) {
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
    const data = await response.json();
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
}

export async function fetchProjectStatsApi(projectId: number, getCache: any, setSelectedProject: any, setSpigotStats: any, setLoadingStats: any, setLoadingSpigot: any, setError: any, setCache: any) {
  setSelectedProject(null);
  setSpigotStats(null);
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
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setSelectedProject(statsData.data);
        setCache(statsCacheKey, statsData.data);
      } else {
        throw new Error(statsData.message);
      }
    }
    if (!cachedSpigot && spigotResponse && spigotResponse.ok) {
      const spigotData = await spigotResponse.json();
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
}

export async function fetchAiModelsApi(getCache: any, setCache: any, setAiModels: any, setError: any) {
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
    const data = await response.json();
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
}

export async function fetchAiModelStatsApi(modelId: string, getCache: any, setSelectedAiModel: any, setLoadingAiStats: any, setError: any, setCache: any) {
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
    const data = await response.json();
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
}

export async function fetchCloudflareDataApi(setCloudflareDomains: any, fetchDomainStats: any, setLoadingDomains: any) {
  setLoadingDomains(true);
  try {
    const response = await fetch('https://api.michielo.com/api/statistics/cloudflare');
    if (!response.ok) {
      throw new Error('Failed to fetch Cloudflare domains');
    }
    const data = await response.json();
    setCloudflareDomains(data);
  } catch (err) {
    console.error('Error fetching Cloudflare domains:', err);
  } finally {
    setLoadingDomains(false);
  }
}

export async function fetchDomainStatsApi(domainId: string, setDomainStats: any, setLoadingDomainStats: any) {
  setLoadingDomainStats(true);
  try {
    const response = await fetch(`https://api.michielo.com/api/statistics/cloudflare/${domainId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch domain stats');
    }
    const data = await response.json();
    setDomainStats(data);
  } catch (err) {
    console.error('Error fetching domain stats:', err);
  } finally {
    setLoadingDomainStats(false);
  }
} 