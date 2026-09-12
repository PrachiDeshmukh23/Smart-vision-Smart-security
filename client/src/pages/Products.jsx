import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter, Search, SlidersHorizontal, ArrowUpDown, X,
  ShieldCheck, RefreshCw, Layers
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
    <div className="space-y-10 pb-20">
      <PageHeader
        title="Products Catalogue"
        subtitle="Explore our comprehensive range of HD CCTV cameras, power supplies, PoE networking, and accessories."
        breadcrumbs={[{ label: 'Products' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl mb-8">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cameras, model numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-sm text-white rounded-xl pl-10 pr-20 py-2.5 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
            >
              Filter
            </button>
          </form>

          {/* Right Sorting & Mobile Filter Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700"
            >
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={currentSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="">Featured / Default</option>
                <option value="name_asc">Name (A to Z)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <span>Filter by Category</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* All Categories Button */}
              <div>
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    !currentCategory
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>All Products</span>
                  <Layers className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              {/* Category Tree */}
              <div className="space-y-1">
                {categories.map((parent) => (
                  <div key={parent.id} className="space-y-1">
                    <button
                      onClick={() => updateFilter('category', parent.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        currentCategory === parent.slug
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{parent.name}</span>
                    </button>

                    {/* Subcategories */}
                    {parent.subcategories && parent.subcategories.length > 0 && (
                      <div className="pl-3 space-y-1 pt-0.5 pb-1">
                        {parent.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => updateFilter('category', sub.slug)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1.5 ${
                              currentCategory === sub.slug
                                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                            <span>{sub.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Special toggles */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Highlights</p>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={currentFeatured === 'true'}
                    onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : '')}
                    className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Featured Equipment Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <Loader text="Filtering GS Vision catalogue..." />
            ) : products.length === 0 ? (
              <EmptyState
                title="No Products Found"
                message="We couldn't find any products matching your active filters. Try searching for a different term or clearing your category filter."
                action={
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Clear All Filters
                  </button>
                }
              />
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
                  <span>Showing <strong>{products.length}</strong> surveillance products</span>
                  {currentCategory && (
                    <span className="text-cyan-400">Filtered by category</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} onEnquire={(prod) => onOpenEnquire(prod)} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-80 max-w-full bg-slate-900 h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>Filter Catalogue</span>
              </h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  updateFilter('category', '');
                  setMobileFiltersOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200"
              >
                All Products
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    updateFilter('category', c.slug);
                    setMobileFiltersOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                    currentCategory === c.slug ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
