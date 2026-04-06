import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api';

const CATEGORIES = ['All', 'Festival Gifts', 'Home Decor', 'Corporate Gifts', 'Personalised Gifts', 'Pooja Items'];
const SORTS = [
  { value: '', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square bg-orange-100 rounded-xl mb-3" />
      <div className="h-3 bg-orange-100 rounded mb-2 w-1/3" />
      <div className="h-4 bg-orange-100 rounded mb-2" />
      <div className="h-10 bg-orange-100 rounded-xl mt-3" />
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;

    getProducts(params)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Live search with debounce effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      if (searchInput) setSearchParams({ search: searchInput });
      else setSearchParams({});
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategory('All');
    setSort('');
    setSearchParams({});
  };

  const [dynamicCategories, setDynamicCategories] = useState(['All']);
  useEffect(() => {
    if (category === 'All' && products.length > 0) {
      // Only show categories that actually have products in them
      const cats = new Set(['All', ...products.map(p => p.category).filter(Boolean)]);
      setDynamicCategories(Array.from(cats));
    }
  }, [products, category]);

  // Group products by category when showing "All"
  const groupedProducts = products.reduce((acc, p) => {
    const cat = p.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-gray-100 pb-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Shop Collection</h1>
          <p className="text-gray-500">{loading ? 'Loading magic...' : `Showing ${products.length} exquisite gifts`}</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search gifts..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                <FiX size={16} />
              </button>
            )}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm cursor-pointer whitespace-nowrap">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-8">
        {dynamicCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              category === cat
                ? 'bg-gradient-to-r from-primary-600 to-rose-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700'
            }`}
          >
            {cat}
          </button>
        ))}
        {(searchInput || category !== 'All' || sort) && (
          <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>
        )}
        {(searchInput || category !== 'All' || sort) && (
          <button onClick={clearFilters} className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold bg-red-50 text-red-600 border border-red-200 flex items-center gap-2 hover:bg-red-500 hover:text-white transition-colors group">
            <FiX size={16} className="group-hover:rotate-90 transition-transform" /> Clear Filters
          </button>
        )}
      </div>

      {/* Products area */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try a different search term or category</p>
          <button onClick={clearFilters} className="btn-primary inline-flex">Browse All Products</button>
        </div>
      ) : category === 'All' && !search && !sort ? (
        <div className="space-y-16">
          {Object.entries(groupedProducts).map(([catName, items]) => (
            <section key={catName}>
              <div className="flex items-end justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full shadow-sm"></span>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 tracking-tight">
                    {catName}
                  </h2>
                </div>
                <button 
                  onClick={() => {
                    setCategory(catName);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-primary-600 text-sm font-semibold hover:text-rose-500 transition-colors hidden sm:block"
                >
                  View All {items.length} →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.slice(0, 4).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {items.length > 4 && (
                <div className="mt-8 text-center sm:hidden">
                  <button 
                    onClick={() => {
                      setCategory(catName);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="btn-secondary w-full"
                  >
                    View All {items.length} {catName}
                  </button>
                </div>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </main>
  );
}
