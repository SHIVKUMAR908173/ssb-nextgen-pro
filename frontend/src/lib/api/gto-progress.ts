/**
 * GTO Progress API Service
 * 
 * Handles communication with the backend for saving and loading
 * Virtual GTO Ground game progress.
 */

const API_BASE_URL = '/api';

// ============================================
// Types
// ============================================

export interface GTOProgressSave {
  level_id: number;
  level_type: 'PGT' | 'HGT' | 'CT' | 'FGT';
  completed: boolean;
  stars: number;
  best_score: number;
  time_taken?: number;
  attempts?: number;
  best_completion?: Record<string, unknown>;
  violations?: number;
}

export interface GTOProgressResponse {
  success: boolean;
  message: string;
  progress?: GTOProgressSave;
}

export interface GTOStatsResponse {
  success: boolean;
  total_levels_completed: number;
  total_stars: number;
  total_score: number;
  levels_by_type: {
    PGT: number;
    HGT: number;
    CT: number;
    FGT: number;
  };
  best_scores: Array<{
    level_id: number;
    level_type: string;
    score: number;
    stars: number;
    time_taken?: number;
  }>;
  recent_activity: Array<{
    level_id: number;
    level_type: string;
    score: number;
    stars: number;
    time_taken?: number;
  }>;
}

export interface GTOLeaderboardEntry {
  user_id: string;
  full_name: string;
  email: string;
  levels_completed: number;
  total_stars: number;
  total_score: number;
  avg_completion_time?: number;
}

export interface GTOLeaderboardResponse {
  success: boolean;
  leaderboard: GTOLeaderboardEntry[];
  user_rank?: number;
}

export interface GTOSessionSave {
  level_id: number;
  session_data?: Record<string, unknown>;
  score: number;
  completed: boolean;
  violations: number;
  duration?: number;
}

// ============================================
// Helper Functions
// ============================================

async function getAuthToken(): Promise<string | null> {
  // Check localStorage for auth token
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

// ============================================
// API Functions
// ============================================

/**
 * Save progress for a specific GTO level
 */
export async function saveGTOProgress(
  progress: GTOProgressSave
): Promise<GTOProgressResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/gto/progress/save`, {
    method: 'POST',
    body: JSON.stringify(progress),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to save progress');
  }
  
  return response.json();
}

/**
 * Get progress for a specific GTO level
 */
export async function getGTOProgress(
  levelId: number
): Promise<GTOProgressResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/gto/progress/${levelId}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get progress');
  }
  
  return response.json();
}

/**
 * Get all GTO progress for the current user
 */
export async function getAllGTOProgress(): Promise<GTOStatsResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/gto/progress`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get progress');
  }
  
  return response.json();
}

/**
 * Get GTO leaderboard
 */
export async function getGTOLeaderboard(
  limit: number = 50
): Promise<GTOLeaderboardResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/gto/leaderboard?limit=${limit}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get leaderboard');
  }
  
  return response.json();
}

/**
 * Save a complete GTO game session
 */
export async function saveGTOSession(
  session: GTOSessionSave
): Promise<{ success: boolean; message: string; session_id: number }> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/gto/session/save`,
    {
      method: 'POST',
      body: JSON.stringify(session),
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to save session');
  }
  
  return response.json();
}

/**
 * Get a specific game session for replay
 */
export async function getGTOSession(
  sessionId: number
): Promise<{ success: boolean; session: unknown }> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/gto/session/${sessionId}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get session');
  }
  
  return response.json();
}

// ============================================
// LocalStorage Fallback (for offline mode)
// ============================================

const LOCAL_STORAGE_KEY = 'gto_progress_local';

export function saveGTOProgressLocal(progress: GTOProgressSave): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || '{}'
    );
    
    const levelId = progress.level_id;
    if (existing[levelId]) {
      // Update with best values
      const existingProgress = existing[levelId];
      existingProgress.completed = existingProgress.completed || progress.completed;
      existingProgress.stars = Math.max(existingProgress.stars, progress.stars);
      existingProgress.best_score = Math.max(existingProgress.best_score, progress.best_score);
      if (progress.time_taken && (!existingProgress.time_taken || progress.time_taken < existingProgress.time_taken)) {
        existingProgress.time_taken = progress.time_taken;
      }
      existingProgress.attempts = (existingProgress.attempts || 0) + (progress.attempts || 1);
      if (progress.best_completion) {
        existingProgress.best_completion = progress.best_completion;
      }
    } else {
      existing[levelId] = {
        ...progress,
        attempts: progress.attempts || 1,
      };
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save progress locally:', e);
  }
}

export function getGTOProgressLocal(): Record<number, GTOProgressSave> {
  if (typeof window === 'undefined') return {};
  
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
  } catch (e) {
    console.error('Failed to get progress locally:', e);
    return {};
  }
}

export function getGTOProgressLocalForLevel(levelId: number): GTOProgressSave | null {
  const all = getGTOProgressLocal();
  return all[levelId] || null;
}

// ============================================
// Sync Functions (sync local to server when online)
// ============================================

export async function syncLocalProgressToServer(): Promise<void> {
  const localProgress = getGTOProgressLocal();
  const entries = Object.entries(localProgress);
  
  for (const [levelId, progress] of entries) {
    try {
      await saveGTOProgress({
        ...progress,
        level_id: parseInt(levelId),
      });
    } catch (e) {
      console.error(`Failed to sync level ${levelId}:`, e);
    }
  }
  
  // Clear local storage after successful sync
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

// ============================================
// Utility Functions
// ============================================

export function calculateTotalStars(progress: Record<number, GTOProgressSave>): number {
  return Object.values(progress).reduce((sum, p) => sum + (p.stars || 0), 0);
}

export function calculateTotalCompleted(progress: Record<number, GTOProgressSave>): number {
  return Object.values(progress).filter(p => p.completed).length;
}

export function getProgressByType(progress: Record<number, GTOProgressSave>): {
  PGT: number;
  HGT: number;
  CT: number;
  FGT: number;
} {
  const result = { PGT: 0, HGT: 0, CT: 0, FGT: 0 };
  
  Object.values(progress).forEach(p => {
    if (p.completed && p.level_type && result.hasOwnProperty(p.level_type)) {
      result[p.level_type as keyof typeof result]++;
    }
  });
  
  return result;
}

export function getStarsColor(stars: number): string {
  if (stars >= 3) return 'text-yellow-500';
  if (stars >= 2) return 'text-emerald-500';
  if (stars >= 1) return 'text-blue-500';
  return 'text-slate-600';
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy': return 'text-emerald-500';
    case 'Medium': return 'text-blue-500';
    case 'Hard': return 'text-orange-500';
    case 'Expert': return 'text-red-500';
    default: return 'text-slate-500';
  }
}
