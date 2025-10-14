import { useState, useEffect } from "react";
import { X, Save, Plus, Trash2, Wine, Coffee, Cigarette, GlassWater, UtensilsCrossed, Sparkles, Crown, Music } from "lucide-react";
import type { Venue } from "@/shared/types";

interface VenueProduct {
  id?: number;
  venue_id: number;
  name: string;
  category: string;
  subcategory?: string;
  price?: number;
  currency: string;
  description?: string;
  image_url?: string;
  is_available: boolean;
  is_featured: boolean;
  minimum_order: number;
  serving_size?: string;
  alcohol_content?: number;
  flavor_profile?: string;
  brand?: string;
  origin_country?: string;
  preparation_time_minutes?: number;
  ingredients?: string;
  dietary_restrictions?: string;
}

interface ProductCategory {
  name: string;
  display_name: string;
  description: string;
  icon_name: string;
  color_code: string;
}

interface VenueProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: Venue | null;
  onUpdate: () => void;
}

const categoryIcons: Record<string, any> = {
  Wine,
  Coffee,
  Cigarette,
  GlassWater,
  UtensilsCrossed,
  Sparkles,
  Crown,
  Music,
};

const defaultProduct: Omit<VenueProduct, 'venue_id'> = {
  name: '',
  category: 'alcoholic_beverages',
  price: 0,
  currency: 'NGN',
  description: '',
  image_url: '',
  is_available: true,
  is_featured: false,
  minimum_order: 1,
};

export default function VenueProductsModal({
  isOpen,
  onClose,
  venue,
  onUpdate,
}: VenueProductsModalProps) {
  const [products, setProducts] = useState<VenueProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen && venue) {
      fetchProducts();
      fetchCategories();
    }
  }, [isOpen, venue]);

  const fetchProducts = async () => {
    if (!venue) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/venues/${venue.id}/products`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/venue-product-categories', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const addProduct = () => {
    if (!venue) return;
    
    const newProduct: VenueProduct = {
      ...defaultProduct,
      venue_id: venue.id,
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const updateProduct = (index: number, field: keyof VenueProduct, value: any) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value,
    };
    setProducts(newProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue) return;

    setSaving(true);
    setErrors({});

    try {
      const response = await fetch(`/api/admin/venues/${venue.id}/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ products }),
      });

      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        const error = await response.json();
        setErrors({ general: error.error || 'Failed to update products' });
      }
    } catch (error) {
      console.error('Failed to update products:', error);
      setErrors({ general: 'Failed to update products' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !venue) return null;

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Wine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Manage Products</h2>
                <p className="text-sm text-gray-500">{venue.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={saving}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Products ({products.length})
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.icon_name] || Wine;
              const count = products.filter(p => p.category === category.name).length;
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.name
                      ? 'text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: activeCategory === category.name ? category.color_code : undefined,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.display_name} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {errors.general && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Wine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeCategory === 'all' ? 'No products added yet' : `No ${categories.find(c => c.name === activeCategory)?.display_name.toLowerCase()} added yet`}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add products to showcase what your venue offers
                    </p>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredProducts.map((product) => {
                      const actualIndex = products.findIndex(p => p === product);
                      const category = categories.find(c => c.name === product.category);
                      const Icon = category ? categoryIcons[category.icon_name] || Wine : Wine;
                      
                      return (
                        <div key={actualIndex} className="bg-gray-50 rounded-xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: category?.color_code || '#8B5CF6' }}
                              >
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {product.name || 'New Product'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {category?.display_name || 'Select Category'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeProduct(actualIndex)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={product.name}
                                onChange={(e) => updateProduct(actualIndex, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Hennessy VSOP"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                              </label>
                              <select
                                required
                                value={product.category}
                                onChange={(e) => updateProduct(actualIndex, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              >
                                {categories.map((cat) => (
                                  <option key={cat.name} value={cat.name}>
                                    {cat.display_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₦)
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={product.price || ''}
                                onChange={(e) => updateProduct(actualIndex, 'price', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="0.00"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand
                              </label>
                              <input
                                type="text"
                                value={product.brand || ''}
                                onChange={(e) => updateProduct(actualIndex, 'brand', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Hennessy, Grey Goose"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Serving Size
                              </label>
                              <input
                                type="text"
                                value={product.serving_size || ''}
                                onChange={(e) => updateProduct(actualIndex, 'serving_size', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 700ml, Single, Double"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alcohol Content (%)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={product.alcohol_content || ''}
                                onChange={(e) => updateProduct(actualIndex, 'alcohol_content', parseFloat(e.target.value) || undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 40"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                value={product.description || ''}
                                onChange={(e) => updateProduct(actualIndex, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Describe the product..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Flavor Profile / Notes
                              </label>
                              <textarea
                                value={product.flavor_profile || ''}
                                onChange={(e) => updateProduct(actualIndex, 'flavor_profile', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Smooth, fruity, with hints of vanilla..."
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={product.is_available}
                                onChange={(e) => updateProduct(actualIndex, 'is_available', e.target.checked)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">Available</span>
                            </label>

                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={product.is_featured}
                                onChange={(e) => updateProduct(actualIndex, 'is_featured', e.target.checked)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">Featured</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={addProduct}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Another Product</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || products.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Products</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
