/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { ConciergeServiceProduct } from "../types/conciergeServicesProducts";
import { fetchConciergeServiceProducts } from "../api/conciergeServiceProducts";

export interface ServerSideConciergeServiceProductsState {
  providers: ConciergeServiceProduct[];
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

export interface ServerSideConciergeServiceProductsActions {
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSort: (key: string) => void;
  setFilters: (filters: Record<string, string>) => void;
  exportData: () => Promise<void>;
}

export interface ServerSideConciergeServiceProductUpdate {
  id: string;
  updatedData: Partial<ConciergeServiceProduct>;
}

interface UseConciergeServiceProductsOptions {
  initialPageSize?: number;
  initialFilters?: Record<string, string>;
  autoFetch?: boolean;
}

export function useConciergeServiceProducts({
  initialPageSize = 25,
  initialFilters = {},
}: UseConciergeServiceProductsOptions = {}): [ServerSideConciergeServiceProductsState, ServerSideConciergeServiceProductsActions] {
  const [state, setState] = useState<ServerSideConciergeServiceProductsState>({
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
        const response = await fetchConciergeServiceProducts(
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

  const actions: ServerSideConciergeServiceProductsActions = useMemo(() => ({
    refresh: async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetchConciergeServiceProducts(
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

