import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiSearch } from 'react-icons/fi';
import { getProducts, deleteProduct } from '../api';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    getProducts(search ? { search } : {})
      .then((res) => setProducts(res.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products ({products.length})</h1>
        <Link to="/products/add" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Search products..." />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {/* Hidden submit button to allow Enter key to submit immediately */}
        <button type="submit" className="hidden">Search</button>
        {search && <button type="button" onClick={() => setSearch('')} className="btn-ghost">Clear</button>}
      </form>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Product</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Price</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Stock</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Featured</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-10 bg-gray-100 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-gray-500">No products yet.</p>
                    <Link to="/products/add" className="btn-primary inline-block mt-3 text-sm">Add First Product</Link>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://placehold.co/50x50/fed7aa/9a3412?text=SV'}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div>{p.category}</div>
                      {p.subCategory && <div className="text-xs text-gray-400 mt-0.5">{p.subCategory}</div>}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ₹{p.discountPrice || p.price}
                      {p.discountPrice && <span className="text-gray-400 line-through text-xs ml-1">₹{p.price}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {p.stock > 0 ? p.stock : 'Out'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.isFeatured ? <FiStar className="text-yellow-500 fill-yellow-400" /> : <FiStar className="text-gray-300" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link to={`/products/${p._id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          disabled={deleting === p._id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
