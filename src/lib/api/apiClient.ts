/// <reference types="vite/client" />

const API_BASE_URL = window.config?.apiUrl || 'http://localhost:5261';

export interface ApiError extends Error {
  response?: {
    data: unknown;
  };
}

/**
 * Generic API request handler with consistent error handling
 * @param url - The full URL to fetch from
 * @param options - Fetch options (method, headers, body, etc.)
 * @param errorMessage - Default error message if response parsing fails
 * @returns Parsed JSON response
 */
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  errorMessage: string = 'API request failed'
): Promise<T> => {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (response.ok) {
    return await response.json();
  }

  const errorData = await response.json().catch(() => null);
  const error = new Error(errorMessage) as ApiError;
  error.response = { data: errorData };
  throw error;
};

/**
 * Build API URL with query parameters
 * @param endpoint - API endpoint (e.g., '/api/review')
 * @param params - Query parameters object
 * @returns Full URL with query string
 */
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string | number>
): string => {
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
};
