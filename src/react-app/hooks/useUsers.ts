/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { User } from "../types/users";
import { fetchUsers } from "../api/users"
// import { set } from 'react-hook-form';

export interface ServerSideUsersState{
  users: User[];
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

export interface ServerSideUsersActions {
  refresh: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  setSort: (key: string) => void;
  setFilters: (filters: Record<string, string>) => void;
  exportData: () => Promise<void>;
}

export interface ServerSideUserUpdate {
  id: string;
  updatedData: Partial<User>;
}

interface UseServerSideUsersOptions {
  initialPageSize?: number;
  initialFilters?: Record<string, string>;
  autoFetch?: boolean;
}

export function useUsers({
  initialPageSize = 25,
  initialFilters = {},
}: UseServerSideUsersOptions): [ServerSideUsersState, ServerSideUsersActions] {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = useState<ServerSideUsersState>({
    users: [],
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
  // Fetching logic would go here

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetchUsers(
          state.currentPage,
          state.pageSize,
          state.searchTerm,
          state.sortConfig ? `${state.sortConfig.key}:${state.sortConfig.direction}` : undefined
        );
        setState(prev => ({
          ...prev,
          users: response.data.results,
          totalItems: response.data.totalResults,
          loading: false,
        }));
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message || "Failed to fetch users",
          loading: false,
        }));
      }
    };
    // Only run fetchData if relevant state changes, not on every render
    // Use JSON.stringify for objects to avoid reference changes
    fetchData();
  }, [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig]);

  const actions: ServerSideUsersActions = useMemo(() => ({
    refresh: async () => {
      // Re-fetch users data
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetchUsers(state.currentPage, state.pageSize, state.searchTerm, state.sortConfig ? `${state.sortConfig.key}:${state.sortConfig.direction}` : undefined);
      setState(prev => ({
        ...prev,
        users: response.data.results,
        totalItems: response.data.totalResults,
        loading: false,
      }));
    },
    logout: async () => {
      // Logout logic here
      console.log("Logging out...");
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
      // Export table to csv or pdf
      console.log("Exporting data...");
    },
  }), [state.currentPage, state.pageSize, state.searchTerm, state.sortConfig]);

  return [state, actions ];
}

