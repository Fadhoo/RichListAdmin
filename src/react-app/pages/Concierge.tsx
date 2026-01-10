import { useState, useEffect } from "react";
import AdminLayout from "@/react-app/components/AdminLayout";
import ConciergeProviderModal from "@/react-app/components/ConciergeProviderModal";
import ConciergeServiceModal from "@/react-app/components/ConciergeServiceModal";
import DeleteConfirmModal from "@/react-app/components/DeleteConfirmModal";
import DataTable, { TableColumn } from "@/react-app/components/DataTable";
import ImageUpload from "@/react-app/components/ImageUpload";
import { useConciergeProviders } from "@/react-app/hooks/useConciergeProviders";
import { useConciergeServices } from "@/react-app/hooks/useConciergeServices";
import { useConciergeServiceProducts } from "../hooks/useConciergeServicesProducts";
import { deleteConciergeProvider } from "../api/conciergeProviders";
import { deleteConciergeService } from "../api/conciergeServices";
import { createConciergeServiceProduct, editConciergeServiceProduct, deleteConciergeServiceProduct } from "../api/conciergeServiceProducts";
import { 
  Building2,
  Plus, 
  Settings, 
  Phone, 
  Mail, 
  Edit,
  Trash2,
  Package,
  X,
  Save,
} from "lucide-react";
import type { ConciergeProvider } from "@/react-app/types/conciergeProviders";
import type { ConciergeService } from "@/react-app/types/conciergeServices";
import type { ConciergeServiceProduct } from "@/react-app/types/conciergeServicesProducts";

// Define table columns for providers
const providerColumns: TableColumn<ConciergeProvider>[] = [
  {
    key: 'name',
    title: 'Provider',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          <div className="text-sm text-gray-500">{record.description || 'No description'}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'contactEmail',
    title: 'Contact',
    render: (_, record) => (
      <div className="space-y-1">
        <div className="flex items-center space-x-1">
          <Mail className="w-4 h-4 text-gray-400" />
          <a
            href={`mailto:${record.contactEmail}`}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            {record.contactEmail}
          </a>
        </div>
        {record.contactPhone && (
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4 text-gray-400" />
            <a
              href={`tel:${record.contactPhone}`}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              {record.contactPhone}
            </a>
          </div>
        )}
      </div>
    ),
  },
  {
    key: 'services',
    title: 'Services',
    render: (_, record) => (
      <div className="text-sm text-gray-600">
        {record.services && Array.isArray(record.services) ? `${record.services.length} service(s)` : 'No services'}
      </div>
    ),
  },
  {
    key: 'isActive',
    title: 'Status',
    sortable: true,
    render: (isActive) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

// Define table columns for services
const serviceColumns: TableColumn<ConciergeService>[] = [
  {
    key: 'imageId',
    title: 'Image',
    render: (imageId) => (
      <img src={imageId} alt="Service" className="w-10 h-10 rounded-lg" />
    ),
  },
  {
    key: 'name',
    title: 'Service',
    sortable: true,
    render: (_, record) => (
      <div>
        <div className="font-medium text-gray-900">{record.name}</div>
        <div className="text-sm text-gray-500 truncate max-w-xs" title={record.description || 'No description'}>
          {record.description || 'No description'}
        </div>
      </div>
    ),
  },
  {
    key: 'category',
    title: 'Category',
    sortable: true,
    render: (category) => (
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
        {category}
      </span>
    ),
  },
  // {
  //   key: 'price',
  //   title: 'Price',
  //   sortable: true,
  //   render: (_, record) => (
  //     <div className="text-sm">
  //       {record.price ? (
  //         <span className="font-medium text-gray-900">
  //           {record.currency || 'NGN'} {record.price.toLocaleString()}
  //         </span>
  //       ) : (
  //         <span className="text-gray-500">Contact for pricing</span>
  //       )}
  //     </div>
  //   ),
  // },
  {
    key: 'serviceProducts',
    title: 'Products',
    render: (_, record) => (
      <div className="text-sm text-gray-600">
        {record.serviceProducts && Array.isArray(record.serviceProducts) ? `${record.serviceProducts.length} product(s)` : 'No products'}
      </div>
    ),
  },
  {
    key: 'isActive',
    title: 'Status',
    sortable: true,
    render: (isActive) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isActive ? 'Available' : 'Unavailable'}
      </span>
    ),
  },
];

// Define table columns for service products
const productColumns: TableColumn<ConciergeServiceProduct>[] = [
  {
    key: 'name',
    title: 'Product',
    sortable: true,
    render: (_, record) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
          <img src={record.imageUrl} alt={record.name} className="w-10 h-10 rounded-lg" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          <div className="text-sm text-gray-500">{record.description || 'No description'}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    title: 'Base/Display Price',
    sortable: true,
    render: (_, record) => (
      <div className="text-sm">
        {record.price ? (
          <span className="font-medium text-gray-900">
            {record.currency} {record.price.toLocaleString()}
          </span>
        ) : (
          <span className="text-gray-500">N/A</span>
        )}
      </div>
    ),
  },
  {
    key: 'halfDay',
    title: 'Half Day',
    render: (halfDay, record) => (
      <span className="text-sm text-gray-600">
        {halfDay ? `${record.currency} ${halfDay.toLocaleString()}` : '-'}
      </span>
    ),
  },
  {
    key: 'fullDay',
    title: 'Full Day',
    render: (fullDay, record) => (
      <span className="text-sm text-gray-600">
        {fullDay ? `${record.currency} ${fullDay.toLocaleString()}` : '-'}
      </span>
    ),
  },
  {
    key: 'airportPickUp',
    title: 'Airport Pickup',
    render: (airportPickUp, record) => (
      <span className="text-sm text-gray-600">
        {airportPickUp ? `${record.currency} ${airportPickUp.toLocaleString()}` : '-'}
      </span>
    ),
  },
  {
    key: 'isActive',
    title: 'Status',
    sortable: true,
    render: (isActive) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    ),
  },
];

// Product Modal Component
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ConciergeServiceProduct | null;
  onUpdate: () => void;
  providers: ConciergeProvider[];
  services: ConciergeService[];
}

function ProductModal({ isOpen, onClose, product, onUpdate, providers, services }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    halfDay: '',
    fullDay: '',
    airportPickUp: '',
    currency: 'NGN',
    conciergeService: '',
    conciergeProvider: '',
    isActive: true,
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        halfDay: product.halfDay?.toString() || '',
        fullDay: product.fullDay?.toString() || '',
        airportPickUp: product.airportPickUp?.toString() || '',
        currency: product.currency || 'NGN',
        conciergeService: product.conciergeService || '',
        conciergeProvider: product.conciergeProvider || '',
        isActive: product.isActive ?? true,
        imageUrl: product.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        halfDay: '',
        fullDay: '',
        airportPickUp: '',
        currency: 'NGN',
        conciergeService: '',
        conciergeProvider: '',
        isActive: true,
        imageUrl: '',
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        name: formData.name,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : undefined,
        halfDay: formData.halfDay ? parseFloat(formData.halfDay) : undefined,
        fullDay: formData.fullDay ? parseFloat(formData.fullDay) : undefined,
        airportPickUp: formData.airportPickUp ? parseFloat(formData.airportPickUp) : undefined,
        currency: formData.currency,
        conciergeService: formData.conciergeService,
        conciergeProvider: formData.conciergeProvider,
        isActive: formData.isActive,
        imageUrl: formData.imageUrl,
      };

      if (product) {
        await editConciergeServiceProduct(product.id, payload);
      } else {
        await createConciergeServiceProduct(payload);
      }

      onUpdate();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {product ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Luxury Car Service"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Product description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Half Day Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.halfDay}
                  onChange={(e) => setFormData({ ...formData, halfDay: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Day Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fullDay}
                  onChange={(e) => setFormData({ ...formData, fullDay: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Airport Pickup
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.airportPickUp}
                  onChange={(e) => setFormData({ ...formData, airportPickUp: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concierge Service *
              </label>
              <select
                required
                value={formData.conciergeService}
                onChange={(e) => setFormData({ ...formData, conciergeService: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} {service.category ? `(${service.category})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concierge Provider
              </label>
              <select
                value={formData.conciergeProvider}
                onChange={(e) => setFormData({ ...formData, conciergeProvider: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a provider (optional)</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <ImageUpload
                onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                currentImage={formData.imageUrl}
                maxSizeMB={10}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Product is active
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ConciergePage() {
  const [activeTab, setActiveTab] = useState<'providers' | 'services' | 'products'>('providers');
  const [selectedProvider, setSelectedProvider] = useState<ConciergeProvider | null>(null);

  // Use actual hooks
  const conciergeProvidersResult = useConciergeProviders({});
  const [providersState, providersActions] = Array.isArray(conciergeProvidersResult) 
    ? conciergeProvidersResult 
    : [{ providers: [], loading: true, totalItems: 0, currentPage: 1, pageSize: 10, searchTerm: '', sortConfig: null, filters: {} }, { refresh: async () => {}, setPage: () => {}, setPageSize: () => {}, setSearch: () => {}, setSort: () => {}, setFilters: () => {} }];
  
  const conciergeServicesResult = useConciergeServices({});
  const [servicesState, servicesActions] = Array.isArray(conciergeServicesResult) 
    ? conciergeServicesResult 
    : [{ providers: [], loading: true, totalItems: 0, currentPage: 1, pageSize: 10, searchTerm: '', sortConfig: null, filters: {} }, { refresh: async () => {}, setPage: () => {}, setPageSize: () => {}, setSearch: () => {}, setSort: () => {}, setFilters: () => {} }];

  const conciergeProductsResult = useConciergeServiceProducts({});
  const [productsState, productsActions] = Array.isArray(conciergeProductsResult)
    ? conciergeProductsResult
    : [{ providers: [], loading: true, totalItems: 0, currentPage: 1, pageSize: 10, searchTerm: '', sortConfig: null, filters: {} }, { refresh: async () => {}, setPage: () => {}, setPageSize: () => {}, setSearch: () => {}, setSort: () => {}, setFilters: () => {} }];

  const [providerModal, setProviderModal] = useState<{ isOpen: boolean; provider: ConciergeProvider | null }>({
    isOpen: false,
    provider: null,
  });

  const [serviceModal, setServiceModal] = useState<{ isOpen: boolean; service: ConciergeService | null }>({
    isOpen: false,
    service: null,
  });

  const [productModal, setProductModal] = useState<{ isOpen: boolean; product: ConciergeServiceProduct | null }>({
    isOpen: false,
    product: null,
  });

  const [deleteModal, setDeleteModal] = useState<{ 
    isOpen: boolean; 
    type: 'provider' | 'service' | 'product'; 
    itemName: string;
    itemId?: string;
  }>({
    isOpen: false,
    type: 'provider',
    itemName: '',
  });

  const handleProviderUpdate = () => {
    providersActions.refresh();
    setProviderModal({ isOpen: false, provider: null });
  };

  const handleServiceUpdate = () => {
    servicesActions.refresh();
    setServiceModal({ isOpen: false, service: null });
  };

  const handleProductUpdate = async () => {
    await productsActions.refresh();
    setProductModal({ isOpen: false, product: null });
  };

  const handleDelete = async () => {
    const { type, itemId } = deleteModal;
    
    try {
      if (type === 'provider' && itemId) {
        await deleteConciergeProvider(itemId);
        await providersActions.refresh();
      } else if (type === 'service' && itemId) {
        await deleteConciergeService(itemId);
        await servicesActions.refresh();
      } else if (type === 'product' && itemId) {
        await deleteConciergeServiceProduct(itemId);
        await productsActions.refresh();
      }
      setDeleteModal({ isOpen: false, type: 'provider', itemName: '' });
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const tabs = [
    { key: 'providers', label: 'Providers', icon: Building2 },
    { key: 'services', label: 'Services', icon: Settings },
    { key: 'products', label: 'Service Products', icon: Package },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Concierge Management</h1>
            <p className="text-gray-600 mt-2">Manage concierge providers and services</p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Providers</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {providersState.providers.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {providersState.providers.filter(p => p.isActive).length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {servicesState.providers.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {servicesState.providers.filter(s => s.isActive).length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {productsState.providers.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {productsState.providers.filter(p => p.isActive).length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as 'providers' | 'services' | 'products')}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${isActive 
                        ? 'border-purple-500 text-purple-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Concierge Providers</h2>
                  <button
                    onClick={() => setProviderModal({ isOpen: true, provider: null })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Provider</span>
                  </button>
                </div>

                <DataTable
                  data={providersState.providers}
                  columns={[
                    ...providerColumns,
                    {
                      key: 'actions',
                      title: 'Actions',
                      render: (_, record: ConciergeProvider) => (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setProviderModal({ isOpen: true, provider: record })}
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                            title="Edit provider"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, type: 'provider', itemName: record.name, itemId: record.id })}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete provider"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProvider(record);
                              setActiveTab('services');
                            }}
                            className={`text-gray-400 hover:text-blue-600 transition-colors p-1 ${selectedProvider?.id === record.id ? 'font-bold' : ''}`}
                            title="View services"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  loading={providersState.loading}
                  totalItems={providersState.totalItems}
                  currentPage={providersState.currentPage}
                  pageSize={providersState.pageSize}
                  searchTerm={providersState.searchTerm}
                  sortConfig={providersState.sortConfig}
                  filters={providersState.filters}
                  onPageChange={providersActions.setPage}
                  onPageSizeChange={providersActions.setPageSize}
                  onSearchChange={providersActions.setSearch}
                  onSortChange={providersActions.setSort}
                  onFilterChange={providersActions.setFilters}
                  onRefresh={providersActions.refresh}
                  searchable={true}
                  searchPlaceholder="Search providers by name, email..."
                  emptyState={{
                    icon: Building2,
                    title: 'No providers available',
                    description: 'Create concierge providers to manage services',
                    action: (
                      <button
                        onClick={() => setProviderModal({ isOpen: true, provider: null })}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                      >
                        Add First Provider
                      </button>
                    )
                  }}
                />
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Concierge Services</h2>
                    {selectedProvider && (
                      <p className="text-sm text-blue-600">Selected Provider: {selectedProvider.name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setServiceModal({ isOpen: true, service: null })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                </div>

                <DataTable
                  data={servicesState.providers}
                  columns={[
                    ...serviceColumns,
                    {
                      key: 'actions',
                      title: 'Actions',
                      render: (_, record: ConciergeService) => (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setServiceModal({ isOpen: true, service: record })}
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                            title="Edit service"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, type: 'service', itemName: record.name, itemId: record.id })}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  loading={servicesState.loading}
                  totalItems={servicesState.totalItems}
                  currentPage={servicesState.currentPage}
                  pageSize={servicesState.pageSize}
                  searchTerm={servicesState.searchTerm}
                  sortConfig={servicesState.sortConfig}
                  filters={servicesState.filters}
                  onPageChange={servicesActions.setPage}
                  onPageSizeChange={servicesActions.setPageSize}
                  onSearchChange={servicesActions.setSearch}
                  onSortChange={servicesActions.setSort}
                  onFilterChange={servicesActions.setFilters}
                  onRefresh={servicesActions.refresh}
                  searchable={true}
                  searchPlaceholder="Search services by name, category..."
                  emptyState={{
                    icon: Settings,
                    title: 'No services available',
                    description: 'Create concierge services for your customers',
                    action: (
                      <button
                        onClick={() => setServiceModal({ isOpen: true, service: null })}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                      >
                        Add First Service
                      </button>
                    )
                  }}
                />
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Service Products</h2>
                    {selectedProvider && (
                      <p className="text-sm text-blue-600">Selected Provider: {selectedProvider.name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setProductModal({ isOpen: true, product: null })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                <DataTable
                  data={productsState.providers}
                  columns={[
                    ...productColumns,
                    {
                      key: 'actions',
                      title: 'Actions',
                      render: (_, record: ConciergeServiceProduct) => (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setProductModal({ isOpen: true, product: record })}
                            className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, type: 'product', itemName: record.name, itemId: record.id })}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ),
                    },
                  ]}
                  loading={productsState.loading}
                  totalItems={productsState.totalItems}
                  currentPage={productsState.currentPage}
                  pageSize={productsState.pageSize}
                  searchTerm={productsState.searchTerm}
                  sortConfig={productsState.sortConfig}
                  filters={productsState.filters}
                  onPageChange={productsActions.setPage}
                  onPageSizeChange={productsActions.setPageSize}
                  onSearchChange={productsActions.setSearch}
                  onSortChange={productsActions.setSort}
                  onFilterChange={productsActions.setFilters}
                  onRefresh={productsActions.refresh}
                  searchable={true}
                  searchPlaceholder="Search products by name..."
                  emptyState={{
                    icon: Package,
                    title: 'No products available',
                    description: 'Create service products for your concierge services',
                    action: (
                      <button
                        onClick={() => setProductModal({ isOpen: true, product: null })}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                      >
                        Add First Product
                      </button>
                    )
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConciergeProviderModal
        isOpen={providerModal.isOpen}
        onClose={() => setProviderModal({ isOpen: false, provider: null })}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider={providerModal.provider as any}
        onUpdate={handleProviderUpdate}
      />

      <ConciergeServiceModal
        isOpen={serviceModal.isOpen}
        onClose={() => setServiceModal({ isOpen: false, service: null })}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        service={serviceModal.service as any}
        onUpdate={handleServiceUpdate}
      />

      <ProductModal
        isOpen={productModal.isOpen}
        onClose={() => setProductModal({ isOpen: false, product: null })}
        product={productModal.product}
        onUpdate={handleProductUpdate}
        providers={providersState.providers}
        services={servicesState.providers}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: 'provider', itemName: '' })}
        onConfirm={handleDelete}
        title={`Delete ${deleteModal.type}`}
        message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
        itemName={deleteModal.itemName}
      />
    </AdminLayout>
  );
}
