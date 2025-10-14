import { useState, useCallback, useEffect } from 'react';

export interface ServerSideTableState {
  data: any[];
  loading: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  filters: Record<string, string>;
  error: string | null;
}

export interface ServerSideTableActions {
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSort: (key: string) => void;
  setFilters: (filters: Record<string, string>) => void;
  exportData: () => Promise<void>;
}

interface UseServerSideTableOptions {
  endpoint: string;
  initialPageSize?: number;
  initialFilters?: Record<string, string>;
  autoFetch?: boolean;
}

export function useServerSideTable({
  endpoint,
  initialPageSize = 25,
  initialFilters = {},
  autoFetch = true,
}: UseServerSideTableOptions): [ServerSideTableState, ServerSideTableActions] {
  const [state, setState] = useState<ServerSideTableState>({
    data: [],
    loading: false,
    totalItems: 0,
    currentPage: 1,
    pageSize: initialPageSize,
    searchTerm: '',
    sortConfig: null,
    filters: initialFilters,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const params = new URLSearchParams({
        page: state.currentPage.toString(),
        limit: state.pageSize.toString(),
        search: state.searchTerm,
        filters: JSON.stringify(state.filters),
      });

      if (state.sortConfig) {
        params.append('sort_by', state.sortConfig.key);
        params.append('sort_order', state.sortConfig.direction);
      }

      const response = await fetch(`${endpoint}?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setState(prev => ({
        ...prev,
        data: result.data || [],
        totalItems: result.pagination?.total || 0,
        loading: false,
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        data: [],
        totalItems: 0,
      }));
    }
  }, [endpoint, state.currentPage, state.pageSize, state.searchTerm, state.sortConfig, state.filters]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setState(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setState(prev => ({ ...prev, searchTerm: search, currentPage: 1 }));
  }, []);

  const setSort = useCallback((key: string) => {
    setState(prev => {
      const currentSort = prev.sortConfig;
      let newSort: { key: string; direction: 'asc' | 'desc' } | null = null;

      if (currentSort?.key === key) {
        // Toggle direction or remove sort
        if (currentSort.direction === 'asc') {
          newSort = { key, direction: 'desc' };
        } else {
          newSort = null; // Remove sort
        }
      } else {
        // New sort field
        newSort = { key, direction: 'asc' };
      }

      return {
        ...prev,
        sortConfig: newSort,
        currentPage: 1,
      };
    });
  }, []);

  const setFilters = useCallback((filters: Record<string, string>) => {
    setState(prev => ({ ...prev, filters, currentPage: 1 }));
  }, []);

  const exportData = useCallback(async () => {
    try {
      const exportEndpoint = endpoint.replace('/api/admin/', '/api/admin/export/');
      const response = await fetch(exportEndpoint, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${endpoint.split('/').pop()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [endpoint]);

  // Fetch data when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig, state.filters]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return [
    state,
    {
      refresh,
      setPage,
      setPageSize,
      setSearch,
      setSort,
      setFilters,
      exportData,
    },
  ];
}
