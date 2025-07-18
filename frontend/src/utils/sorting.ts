// Sorting helpers for various entities
import { Project } from '../types/statistics';
import { HuggingFaceModelStats } from '../types/api-responses';
import { SteamWorkshopStats, CloudflareDomain } from '../types/statistics';

export function sortProjects(projects: Project[]): Project[] {
  if (!projects || projects.length === 0) return [];
  const bigBrother = projects.find(p => p.name === 'BigBrother');
  const rest = projects.filter(p => p.name !== 'BigBrother').sort((a, b) => a.name.localeCompare(b.name));
  return bigBrother ? [bigBrother, ...rest] : rest;
}

export function sortAiModels(aiModels: HuggingFaceModelStats[]): HuggingFaceModelStats[] {
  return [...aiModels].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
}

export function sortSteamMods(steamMods: SteamWorkshopStats[]): SteamWorkshopStats[] {
  return [...steamMods].sort((a, b) => {
    const aVal = a.unique_visitors ?? a.views;
    const bVal = b.unique_visitors ?? b.views;
    return (bVal || 0) - (aVal || 0);
  });
}

export function sortCloudflareDomains(cloudflareDomains: CloudflareDomain[]): CloudflareDomain[] {
  if (!cloudflareDomains || cloudflareDomains.length === 0) return [];
  const michielo = cloudflareDomains.find(d => d.name === 'michielo.com');
  const rest = cloudflareDomains.filter(d => d.name !== 'michielo.com').sort((a, b) => a.name.localeCompare(b.name));
  return michielo ? [michielo, ...rest] : rest;
} 