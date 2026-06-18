import { createClient } from '../supabase/client';

export class ApiClient {
  /**
   * Core fetch wrapper that automatically handles errors and generic responses.
   */
  static async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // If we need to send auth tokens to backend or internal APIs
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      defaultHeaders['Authorization'] = `Bearer ${session.access_token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(endpoint, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `API Error: ${response.status}`);
      }

      return data as T;
    } catch (error) {
      console.error(`[ApiClient Error] ${endpoint}:`, error);
      throw error;
    }
  }

  static async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET', headers });
  }

  static async post<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });
  }

  static async put<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    });
  }

  static async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE', headers });
  }
}
