/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
// import { Event } from "../types/events";
import { fetchEvents } from "../api/events";

export interface ServerSideEventsState {
  events: any[]; // Replace any with Event[] when Event type is available
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

export interface ServerSideEventsActions {
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSort: (key: string) => void;
  setFilters: (filters: Record<string, string>) => void;
  exportData: () => Promise<void>;
}

interface UseServerSideEventsOptions {
  endpoint: string;
  initialPageSize?: number;
  initialFilters?: Record<string, string>;
  autoFetch?: boolean;
}

export function useEvents({
  initialPageSize = 25,
  initialFilters = {},
}: UseServerSideEventsOptions): [ServerSideEventsState, ServerSideEventsActions] {
  const [state, setState] = useState<ServerSideEventsState>({
    events: [],
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
        const response = await fetchEvents(
          state.currentPage,
          state.pageSize,
          state.searchTerm,
          state.sortConfig ? `${state.sortConfig.key}:${state.sortConfig.direction}` : undefined
        );
        setState(prev => ({
          ...prev,
          events: response.results,
          totalItems: response.totalResults,
          loading: false,
        }));
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message || "Failed to fetch events",
          loading: false,
        }));
      }
    };
    fetchData();
  }, [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig]);

  const actions: ServerSideEventsActions = useMemo(() => ({
    refresh: async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetchEvents(state.currentPage, state.pageSize, state.searchTerm, state.sortConfig ? `${state.sortConfig.key}:${state.sortConfig.direction}` : undefined);
      
      setState(prev => ({
        ...prev,
        events: response.results,
        totalItems: response.totalResults,
        loading: false,
      }));
    },
    setPage: (page: number) => {
      setState(prev => ({ ...prev, currentPage: page }));
    },
    setPageSize: (size: number) => {
      setState(prev => ({ ...prev, pageSize: size }));
    },
    setSearch: (search: string) => {
      setState(prev => ({ ...prev, searchTerm: search }));
    },
    setSort: (key: string) => {
      setState(prev => ({
        ...prev,
        sortConfig: {
          key,
          direction: prev.sortConfig?.direction === 'asc' ? 'desc' : 'asc',
        },
      }));
    },
    setFilters: (filters: Record<string, string>) => {
      setState(prev => ({ ...prev, filters }));
    },
    exportData: async () => {
      console.log("Exporting data...");
    },
  }), [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig]);

  return [state, actions];
}
