/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { ConciergeService } from "../types/conciergeServices";
import { fetchConciergeServices } from "../api/conciergeServices";

export interface ServerSideConciergeServicesState {
  providers: ConciergeService[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  filters: Record<string, string>;
}

export interface ServerSideConciergeServicesActions {
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSort: (key: string) => void;
  setFilters: (filters: Record<string, string>) => void;
  exportData: () => Promise<void>;
}

export interface ServerSideConciergeServiceUpdate {
  id: string;
  updatedData: Partial<ConciergeService>;
}

interface UseConciergeServicesOptions {
  initialPageSize?: number;
  initialFilters?: Record<string, string>;
  autoFetch?: boolean;
}

export function useConciergeServices({
  initialPageSize = 25,
  initialFilters = {},
}: UseConciergeServicesOptions = {}): [ServerSideConciergeServicesState, ServerSideConciergeServicesActions] {
  const [state, setState] = useState<ServerSideConciergeServicesState>({
    providers: [],
    loading: false,
    error: null,
    totalItems: 0,
    currentPage: 1,
    pageSize: initialPageSize,
    searchTerm: "",
    sortConfig: {
      key: "createdAt",
      direction: "desc",
    },
    filters: initialFilters,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetchConciergeServices(
          state.currentPage,
          state.pageSize,
          state.searchTerm,
        //   state.sortConfig ? `${state.sortConfig.key}:${state.sortConfig.direction}` : 'createdAt:desc'
        );
        setState(prev => ({
          ...prev,
          providers: response.data.results || [],
          totalItems: response.data.totalResults || 0,
          loading: false,
        }));
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message || "Failed to fetch concierge providers",
          loading: false,
        }));
      }
    };
    fetchData();
  }, [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig, state.filters]);

  const actions: ServerSideConciergeServicesActions = useMemo(() => ({
    refresh: async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetchConciergeServices(
          state.currentPage,
          state.pageSize,
          state.searchTerm,
        //   state.filters,
        //   sort: state.sortConfig ? `${state.sortConfig.key}:${state.sortConfig.direction}` : undefined
        );
        setState(prev => ({
          ...prev,
          providers: response.data.results || [],
          totalItems: response.data.totalResults || 0,
          loading: false,
        }));
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message || "Failed to fetch concierge providers",
          loading: false,
        }));
      }
    },
    setPage: (page: number) => {
      setState(prev => ({ ...prev, currentPage: page }));
    },
    setPageSize: (size: number) => {
      setState(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
    },
    setSearch: (search: string) => {
      setState(prev => ({ ...prev, searchTerm: search, currentPage: 1 }));
    },
    setSort: (key: string) => {
      setState(prev => ({
        ...prev,
        sortConfig: {
          key,
          direction: prev.sortConfig?.key === key && prev.sortConfig?.direction === 'asc' ? 'desc' : 'asc',
        },
      }));
    },
    setFilters: (filters: Record<string, string>) => {
      setState(prev => ({ ...prev, filters, currentPage: 1 }));
    },
    exportData: async () => {
      console.log("Exporting concierge providers data...");
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig]);

  return [state, actions];
}

