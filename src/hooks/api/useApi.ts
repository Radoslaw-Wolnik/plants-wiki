// src/hooks/api/useApi.ts
import { useState, useCallback } from 'react';
import { useConfig } from '@/hooks';
import { QueryParams } from '@/types';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}



function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export function useApi<T = unknown>(endpoint: string, options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { apiUrl } = useConfig();

  const execute = useCallback(
    async (path: string, config: RequestInit = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}${endpoint}${path}`, {
          ...config,
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
          throw new ApiError(
            errorData.message || 'Request failed',
            response.status
          );
        }

        const result = await response.json();
        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const apiError = err instanceof ApiError ? err : new ApiError(
          err instanceof Error ? err.message : 'An unexpected error occurred',
          500
        );
        setError(apiError);
        options.onError?.(apiError);
        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl, endpoint, options]
  );

  const get = useCallback(
    (queryParams?: QueryParams) => {
      const queryString = queryParams ? buildQueryString(queryParams) : '';
      return execute(queryString, { method: 'GET' });
    },
    [execute]
  );

  const post = useCallback(
    <D = unknown>(data?: D, queryParams?: QueryParams) => {
      const queryString = queryParams ? buildQueryString(queryParams) : '';
      return execute(queryString, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [execute]
  );

  const put = useCallback(
    <D = unknown>(data?: D, queryParams?: QueryParams) => {
      const queryString = queryParams ? buildQueryString(queryParams) : '';
      return execute(queryString, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [execute]
  );

  const del = useCallback(
    (queryParams?: QueryParams) => {
      const queryString = queryParams ? buildQueryString(queryParams) : '';
      return execute(queryString, { method: 'DELETE' });
    },
    [execute]
  );

  return {
    data,
    error,
    isLoading,
    get,
    post,
    put,
    delete: del,
  };
}