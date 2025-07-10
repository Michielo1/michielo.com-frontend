export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
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

// Re-export the types that are used in API responses
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