import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter, Search, SlidersHorizontal, ArrowUpDown, X,
  ShieldCheck, RefreshCw, Layers, Sparkles, Check
} from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

export default function Products({ onOpenEnquire }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentFeatured = searchParams.get('featured') || '';
  const currentSort = searchParams.get('sort') || '';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {}
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory) params.set('category', currentCategory);
        if (currentSearch) params.set('search', currentSearch);
        if (currentFeatured) params.set('featured', currentFeatured);
        if (currentSort) params.set('sort', currentSort);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Products load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [currentCategory, currentSearch, currentFeatured, currentSort]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchTerm.trim());
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory || currentSearch || currentFeatured || currentSort;

  return (
    <div className="bg-[#F7F8F8] min-h-screen space-y-8 pb-20">
      <PageHeader
        title="Products & Accessories Catalogue"
        subtitle="Explore our comprehensive range of HD CCTV cameras, power supplies, PoE networking, cables, connectors, and mounting hardware."
        breadcrumbs={[{ label: 'Products' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-[#E6E6E6] p-4 rounded-xl mb-6 shadow-sm">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8C8C]" />
            <input
              type="text"
              placeholder="Search cameras, connectors, SMPS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F7F8F8] border border-[#E6E6E6] text-[#151515] placeholder-[#8C8C8C] text-xs sm:text-sm rounded-lg pl-10 pr-20 py-2 focus:outline-none focus:border-[#009B72] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  updateFilter('search', '');
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-[#8C8C8C] hover:text-[#151515]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#009B72] hover:bg-[#007A5A] text-white text-xs font-bold rounded-md transition-colors"
            >
              Go
            </button>
          </form>

          {/* Sort & Mobile filter button */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg text-xs font-bold text-[#151515]"
            >
              <Filter className="w-4 h-4 text-[#009B72]" />
              <span>Categories &amp; Filter</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#666666] font-medium hidden sm:inline">Sort by:</span>
              <select
                value={currentSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-[#F7F8F8] border border-[#E6E6E6] text-[#151515] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#009B72]"
              >
                <option value="">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-lg border border-[#E6E6E6]">
            <span className="text-xs font-bold text-[#666666]">Active Filters:</span>
            {currentCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E8F8F3] text-[#009B72] text-xs font-semibold">
                <span>Category: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}</span>
                <button onClick={() => updateFilter('category', '')} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E8F8F3] text-[#009B72] text-xs font-semibold">
                <span>Search: "{currentSearch}"</span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    updateFilter('search', '');
                  }}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-[#FF5A2C] hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Categories Sidebar */}
          <aside className="hidden lg:block bg-white border border-[#E6E6E6] rounded-xl p-5 shadow-card sticky top-20">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F1F3F5]">
              <h3 className="text-sm font-extrabold text-[#151515] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#009B72]" />
                <span>Categories</span>
              </h3>
              {currentCategory && (
                <button
                  onClick={() => updateFilter('category', '')}
                  className="text-[11px] text-[#009B72] hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-1">
              <button
                onClick={() => updateFilter('category', '')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${
                  !currentCategory
                    ? 'bg-[#009B72] text-white'
                    : 'text-[#404040] hover:bg-[#F7F8F8] hover:text-[#151515]'
                }`}
              >
                <span>All Categories</span>
                <span>({products.length})</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    currentCategory === cat.slug
                      ? 'bg-[#E8F8F3] text-[#009B72] font-bold border border-[#009B72]/30'
                      : 'text-[#404040] hover:bg-[#F7F8F8] hover:text-[#151515]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {currentCategory === cat.slug && <Check className="w-3.5 h-3.5 text-[#009B72] shrink-0" />}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-[#F1F3F5] space-y-3">
              <div className="p-3 bg-[#E8F8F3] rounded-lg border border-[#009B72]/20">
                <p className="text-[11px] font-bold text-[#009B72] uppercase">Wholesale Inquiry</p>
                <p className="text-[11px] text-[#404040] mt-0.5">Need customized installer bulk pricing with NO MOQ?</p>
                <button
                  onClick={() => onOpenEnquire && onOpenEnquire()}
                  className="mt-2 w-full py-1.5 bg-[#009B72] hover:bg-[#007A5A] text-white text-xs font-bold rounded shadow-sm transition-colors"
                >
                  Request Quote
                </button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No Products Found"
                description="Try adjusting your search query or selecting a different category from the sidebar."
                actionLabel="Reset All Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-[#666666] font-medium">
                    Showing <strong className="text-[#151515] font-bold">{products.length}</strong> items
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEnquire={(p) => onOpenEnquire(p)}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
