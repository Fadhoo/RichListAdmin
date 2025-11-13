import { useState, useEffect, useMemo } from 'react';
import { Booking, getBookingResponse } from '../types/bookings';
import { fetchBookings } from '../api/booking';

export interface ServerSideBookingsState {
  bookings: Booking[];
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

export interface ServerSideBookingsActions {
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSort: (key: string) => void;
  setFilters: (filters: Record<string, string>) => void;
  exportData: () => Promise<void>;
}

interface UseServerSideBookingsOptions {
  endpoint: string;
  initialPageSize?: number;
  initialFilters?: Record<string, string>;
  autoFetch?: boolean;
}

export function useBooking({
  initialPageSize = 25,
  initialFilters = {},
}: UseServerSideBookingsOptions): [ServerSideBookingsState, ServerSideBookingsActions] {
  const [state, setState] = useState<ServerSideBookingsState>({
    bookings: [],
    loading: false,
    error: null,
    totalItems: 0,
    currentPage: 1,
    pageSize: initialPageSize,
    searchTerm: '',
    sortConfig: {
      key: 'createdAt',
      direction: 'desc',
    },
    filters: initialFilters,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response: getBookingResponse = await fetchBookings(
          state.currentPage,
          state.pageSize,
          state.searchTerm,
          state.sortConfig ? `${state.sortConfig.key}:${state.sortConfig.direction}` : undefined
        );
        setState(prev => ({
          ...prev,
          bookings: response.results,
          totalItems: response.totalResults,
          loading: false,
        }));
      } catch (error: unknown) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch bookings',
          loading: false,
        }));
      }
    };
    fetchData();
  }, [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig]);

  const actions: ServerSideBookingsActions = useMemo(() => ({
    refresh: async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response: getBookingResponse = await fetchBookings(state.currentPage, state.pageSize, state.searchTerm, state.sortConfig ? `${state.sortConfig.key}:${state.sortConfig.direction}` : undefined);
      setState(prev => ({
        ...prev,
        bookings: response.results,
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
      console.log('Exporting data...');
    },
  }), [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig]);

  return [state, actions];
}
