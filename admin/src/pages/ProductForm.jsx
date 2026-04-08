import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct } from '../api';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiArrowLeft } from 'react-icons/fi';
import imageCompression from 'browser-image-compression';

const CATEGORIES = ['Festival Gifts', 'Home Decor', 'Corporate Gifts', 'Personalised Gifts', 'Pooja Items', 'Other'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [pastedUrls, setPastedUrls] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: 'Festival Gifts', stock: '', isFeatured: false, tags: '',
  });

  useEffect(() => {
    if (isEdit) {
      getProduct(id)
        .then((res) => {
          const p = res.data;
          const isStandardCategory = CATEGORIES.includes(p.category);
          setForm({
            name: p.name, description: p.description, price: p.price,
            discountPrice: p.discountPrice || '', category: isStandardCategory ? p.category : 'Other',
            stock: p.stock, isFeatured: p.isFeatured, tags: p.tags?.join(', ') || '',
          });
          if (!isStandardCategory && p.category) {
            setCustomCategory(p.category);
          }
          setExistingImages(p.images || []);
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setFetchLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Compress immediately upon selection!
    const options = {
      maxSizeMB: 0.5,          // Squeeze down to ~500KB max
      maxWidthOrHeight: 1200, // Maximum resolution width
      useWebWorker: true,
    };

    try {
      toast.loading('Compressing images...', { id: 'compress' });
      const compressedFiles = await Promise.all(
        files.map((file) => imageCompression(file, options))
      );
      toast.dismiss('compress');
      
      setNewImages((prev) => [...prev, ...compressedFiles]);
      const newPreviews = compressedFiles.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error(error);
      toast.dismiss('compress');
      toast.error('Failed to compress images');
    }
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    setPastedUrls((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const removePreview = (i) => {
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
    setNewImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeUrl = (i) => setPastedUrls((prev) => prev.filter((_, idx) => idx !== i));
  const removeExisting = (i) => setExistingImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'category' && v === 'Other' && customCategory.trim()) {
          fd.append(k, customCategory.trim());
        } else {
          fd.append(k, v);
        }
      });
      newImages.forEach((img) => fd.append('images', img));
      pastedUrls.forEach((url) => fd.append('imageUrls', url));

      if (isEdit) {
        existingImages.forEach((img) => fd.append('existingImages', img));
      }

      if (isEdit) {
        await updateProduct(id, fd);
        toast.success('Product updated!');
      } else {
        await createProduct(fd);
        toast.success('Product created!');
      }
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-48 bg-gray-200 rounded" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => navigate('/products')} className="btn-ghost p-2"><FiArrowLeft /></button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-700">Product Information</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
              <input name="name" required value={form.name} onChange={handleChange}
                className="input" placeholder="e.g. Diwali Gift Hamper" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
              <textarea name="description" required value={form.description} onChange={handleChange}
                rows={4} className="input resize-none" placeholder="Describe the product..." />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tags (comma separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange}
                className="input" placeholder="diwali, hamper, festival, handmade" />
            </div>
          </div>

          {/* Image upload */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-700">Product Images</h3>

            <div className="flex gap-2 mb-2">
              <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste image link here (e.g. from WhatsApp)" className="input flex-1" />
              <button type="button" onClick={addUrl} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 rounded-lg transition-colors">
                Add Link
              </button>
            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary-400 hover:bg-orange-50 transition-all">
              <FiUpload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Or click to upload files from PC</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="sr-only" />
            </label>

            {/* Gallery Previews */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {existingImages.map((img, i) => (
                <div key={`exist-${i}`} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExisting(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              {pastedUrls.map((url, i) => (
                <div key={`url-${i}`} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-primary-200">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-0 left-0 bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded-br-lg font-medium">Link</div>
                  <button type="button" onClick={() => removeUrl(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              {previews.map((p, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-green-200">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-0 left-0 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-br-lg font-medium">New</div>
                  <button type="button" onClick={() => removePreview(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-700">Pricing & Stock</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price (₹) *</label>
              <input name="price" type="number" required min="0" value={form.price} onChange={handleChange}
                onWheel={(e) => e.target.blur()} className="input" placeholder="499" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Discount Price (₹)</label>
              <input name="discountPrice" type="number" min="0" value={form.discountPrice} onChange={handleChange}
                onWheel={(e) => e.target.blur()} className="input" placeholder="Leave empty if no discount" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stock *</label>
              <input name="stock" type="number" required min="0" value={form.stock} onChange={handleChange}
                onWheel={(e) => e.target.blur()} className="input" placeholder="100" />
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-gray-700">Organization</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {form.category === 'Other' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Custom Category Name *</label>
                <input required value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="input" placeholder="e.g. Birthday Gifts" />
              </div>
            )}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                className="w-4 h-4 rounded accent-primary-700" />
              <div>
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
                <p className="text-xs text-gray-400">Show on homepage</p>
              </div>
            </label>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isEdit ? 'Updating...' : 'Creating...'}</>
            ) : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
}
