export interface Owner {
  name: string;
}

export interface Software {
  id: number;
}

export interface Project {
  id: number;
  name: string;
  owner: Owner;
  software: Software;
  isGlobal: boolean;
  chartIds: number[];
}

export interface ProjectStats {
  plugin_id: number;
  name: string;
  servers: {
    current: number;
    max: number;
    min: number;
    total_hours: number;
  };
  players: {
    current: number;
    max: number;
    min: number;
    total_hours: number;
    estimated_uniques: number;
  };
  last_updated: string;
}

export interface SpigotMCStats {
  plugin_id: string;
  resource_id: string;
  name: string;
  url: string;
  downloads: number;
  rating: {
    average: number;
    count: number;
  };
  last_updated: string;
  version: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface HuggingFaceModelStats {
  model_id: string;
  full_path: string;
  url: string;
  author?: {
    name: string;
    url: string;
  };
  downloads?: number;
}

export interface HuggingFaceResponse {
  success: boolean;
  data: {
    models: HuggingFaceModelStats[];
  };
  message: string;
}

export interface HuggingFaceModelResponse {
  success: boolean;
  data: HuggingFaceModelStats;
  message: string;
}

export interface WebsiteStats {
  name: string;
  url: string;
  description: string;
  uniqueVisitors30Days: number;
  totalRequests30Days: number;
  dataServed30Days: number;
  lastUpdated: Date;
}

export interface PaperStats {
  title: string;
  type: 'Preprint' | 'Peer Review' | 'Report';
  url: string;
  authors: string[];
  abstract: string;
  lastUpdated: Date;
}

export interface SteamWorkshopStats {
  workshop_id: string;
  title: string;
  unique_visitors: number | null;
  views: number;
  subscriptions: number;
  favorited: number;
  file_size: number;
  preview_url: string;
  time_created: number;
  time_updated: number;
  game?: string;
}

export interface SteamWorkshopResponse {
  success: boolean;
  data: {
    workshop_ids: string[];
  };
  message: string;
}

export interface SteamWorkshopItemResponse {
  success: boolean;
  data: SteamWorkshopStats;
  message: string;
}

export interface CloudflareDomain {
  id: string;
  name: string;
  status: string;
}

export interface CloudflareTrafficData {
  date: string;
  requests: number;
}

export interface CloudflareStats {
  domain_id: string;
  traffic: CloudflareTrafficData[];
} 