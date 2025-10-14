import { useState, useMemo } from 'react';

export interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
  itemsPerPage: number;
}

export interface PaginationActions {
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  reset: () => void;
}

export function usePagination({
  totalItems,
  itemsPerPage: initialItemsPerPage,
  initialPage = 1,
}: UsePaginationOptions): [PaginationState, PaginationActions] {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  const paginationState = useMemo((): PaginationState => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
      currentPage,
      totalPages,
      startIndex,
      endIndex,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
      itemsPerPage,
    };
  }, [currentPage, totalItems, itemsPerPage]);

  const actions: PaginationActions = useMemo(() => ({
    setPage: (page: number) => {
      const maxPage = Math.ceil(totalItems / itemsPerPage);
      setCurrentPage(Math.max(1, Math.min(page, maxPage)));
    },
    nextPage: () => {
      if (paginationState.hasNext) {
        setCurrentPage(prev => prev + 1);
      }
    },
    previousPage: () => {
      if (paginationState.hasPrevious) {
        setCurrentPage(prev => prev - 1);
      }
    },
    setItemsPerPage: (newItemsPerPage: number) => {
      setItemsPerPageState(newItemsPerPage);
      // Reset to first page when changing items per page
      setCurrentPage(1);
    },
    reset: () => {
      setCurrentPage(initialPage);
      setItemsPerPageState(initialItemsPerPage);
    },
  }), [paginationState.hasNext, paginationState.hasPrevious, totalItems, itemsPerPage, initialPage, initialItemsPerPage]);

  return [paginationState, actions];
}
