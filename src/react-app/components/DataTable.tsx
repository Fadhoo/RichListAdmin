import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, Filter, Download, RefreshCw, ChevronDown } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import Pagination from "./Pagination";
import { useDebounce } from "@/react-app/hooks/useDebounce";

export interface TableColumn<T> {
  key: string;
  title: string | React.ReactNode;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface ServerSideTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  filters: Record<string, string>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (key: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterOptions?: Record<string, FilterOption[]>;
  emptyState?: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  className?: string;
}

export interface ClientSideTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: string[];
  filters?: Record<string, FilterOption[]>;
  onRefresh?: () => void;
  onExport?: () => void;
  emptyState?: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  className?: string;
}

export type TableProps<T> = ServerSideTableProps<T> | ClientSideTableProps<T>;

function isServerSideProps<T>(props: TableProps<T>): props is ServerSideTableProps<T> {
  return 'totalItems' in props;
}

// Server-side DataTable for large datasets
function ServerSideDataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  totalItems,
  currentPage,
  pageSize,
  searchTerm,
  sortConfig,
  filters,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortChange,
  onFilterChange,
  onRefresh,
  onExport,
  searchable = true,
  searchPlaceholder = "Search...",
  filterOptions = {},
  emptyState,
  className = "",
}: ServerSideTableProps<T>) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  // Update search when debounced value changes
  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  // Sync local search with prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSort = useCallback((columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;
    onSortChange(columnKey);
  }, [columns, onSortChange]);

  const handleFilterChange = useCallback((columnKey: string, value: string) => {
    onFilterChange({
      ...filters,
      [columnKey]: value
    });
  }, [filters, onFilterChange]);

  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading && data.length === 0) {
    return <TableSkeleton className={className} />;
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header with search and filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
                {loading && localSearchTerm !== searchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}

            {/* Column filters */}
            {Object.entries(filterOptions).map(([columnKey, options]) => (
              <div key={columnKey} className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <div className="relative">
                  <select
                    value={filters[columnKey] || 'all'}
                    onChange={(e) => handleFilterChange(columnKey, e.target.value)}
                    className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="all">All {columnKey.replace('_', ' ')}</option>
                    {options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {totalItems.toLocaleString()} total items
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {data.length === 0 && !loading ? (
        <div className="p-12 text-center">
          {emptyState && (
            <>
              <emptyState.icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {emptyState.title}
              </h3>
              <p className="text-gray-600 mb-6">{emptyState.description}</p>
              {emptyState.action}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                      }`}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        {typeof column.title === 'string' ? <span>{column.title}</span> : column.title}
                        {column.sortable && (
                          <div className="flex flex-col">
                            <div
                              className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent ${
                                sortConfig?.key === column.key && sortConfig.direction === 'asc'
                                  ? 'border-b-purple-600'
                                  : 'border-b-gray-300'
                              }`}
                              style={{ borderBottomWidth: '4px', marginBottom: '1px' }}
                            />
                            <div
                              className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                                sortConfig?.key === column.key && sortConfig.direction === 'desc'
                                  ? 'border-t-purple-600'
                                  : 'border-t-gray-300'
                              }`}
                              style={{ borderTopWidth: '4px' }}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 relative">
                {loading && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2 text-sm text-gray-500">Loading...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {data.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        {column.render
                          ? column.render(
                              column.key.split('.').reduce((obj, key) => obj?.[key], record),
                              record,
                              index
                            )
                          : String(column.key.split('.').reduce((obj, key) => obj?.[key], record) || '')
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={onPageChange}
            onSizeChange={onPageSizeChange}
          />
        </>
      )}
    </div>
  );
}

// Client-side DataTable for smaller datasets (legacy)
function ClientSideDataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pageSize = 25,
  searchable = true,
  searchPlaceholder = "Search...",
  searchFields = [],
  filters = {},
  onRefresh,
  onExport,
  emptyState,
  className = "",
}: ClientSideTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm && searchFields.length > 0) {
      result = result.filter(item =>
        searchFields.some(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply column filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => {
          const itemValue = key.split('.').reduce((obj, k) => obj?.[k], item);
          return String(itemValue) === String(value);
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
        const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchFields, activeFilters, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === columnKey) {
        return current.direction === 'asc' 
          ? { key: columnKey, direction: 'desc' }
          : null;
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  if (loading) {
    return <TableSkeleton className={className} />;
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header with search and filters */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>
            )}

            {/* Column filters */}
            {Object.entries(filters).map(([columnKey, options]) => (
              <div key={columnKey} className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={activeFilters[columnKey] || 'all'}
                  onChange={(e) => handleFilterChange(columnKey, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All {columnKey.replace('_', ' ')}</option>
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {processedData.length === 0 ? (
        <div className="p-12 text-center">
          {emptyState && (
            <>
              <emptyState.icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {emptyState.title}
              </h3>
              <p className="text-gray-600 mb-6">{emptyState.description}</p>
              {emptyState.action}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        {typeof column.title === 'string' ? <span>{column.title}</span> : column.title}
                        {column.sortable && (
                          <div className="flex flex-col">
                            <div
                              className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent ${
                                sortConfig?.key === column.key && sortConfig.direction === 'asc'
                                  ? 'border-b-gray-600'
                                  : 'border-b-gray-300'
                              }`}
                              style={{ borderBottomWidth: '4px', marginBottom: '1px' }}
                            />
                            <div
                              className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                                sortConfig?.key === column.key && sortConfig.direction === 'desc'
                                  ? 'border-t-gray-600'
                                  : 'border-t-gray-300'
                              }`}
                              style={{ borderTopWidth: '4px' }}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                        {column.render
                          ? column.render(
                              column.key.split('.').reduce((obj, key) => obj?.[key], record),
                              record,
                              index
                            )
                          : String(column.key.split('.').reduce((obj, key) => obj?.[key], record) || '')
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={processedData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
}

// Skeleton loader component
function TableSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="animate-pulse">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-200">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main export - automatically chooses the right implementation
export default function DataTable<T extends Record<string, any>>(props: TableProps<T>) {
  if (isServerSideProps(props)) {
    return <ServerSideDataTable {...props} />;
  } else {
    return <ClientSideDataTable {...props} />;
  }
}

// Export individual components for explicit use
export { ServerSideDataTable, ClientSideDataTable };
