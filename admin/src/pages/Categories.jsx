import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Main Category
  const [newCatName, setNewCatName] = useState('');

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSubCategories, setEditSubCategories] = useState([]);
  const [newSubCat, setNewSubCat] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddMainCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await addCategory({ name: newCatName.trim() });
      toast.success('Category added');
      setNewCatName('');
      fetchCategories();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditSubCategories(cat.subCategories || []);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return toast.error('Name required');
    try {
      await updateCategory(editingId, { name: editName.trim(), subCategories: editSubCategories });
      toast.success('Category updated');
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error('Failed to update category');
    }
  };

  const addSubCategory = () => {
    if (!newSubCat.trim()) return;
    if (editSubCategories.includes(newSubCat.trim())) {
      return toast.error('Sub-category already exists');
    }
    setEditSubCategories([...editSubCategories, newSubCat.trim()]);
    setNewSubCat('');
  };

  const removeSubCategory = (sub) => {
    setEditSubCategories(editSubCategories.filter(s => s !== sub));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ADD NEW CATEGORY */}
        <div className="lg:col-span-1">
          <div className="card space-y-4 sticky top-6">
            <h3 className="font-semibold text-gray-700">Add Main Category</h3>
            <form onSubmit={handleAddMainCategory} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category Name *</label>
                <input 
                  type="text" 
                  value={newCatName} 
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="input" 
                  placeholder="e.g. Festival Gifts" 
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <FiPlus /> Add Category
              </button>
            </form>
          </div>
        </div>

        {/* LIST CATEGORIES */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
             <div className="animate-pulse space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
             </div>
          ) : categories.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">
              No categories found. Add your main categories to get started.
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat._id} className="card relative transition-all">
                {editingId === cat._id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <input 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input font-semibold text-lg" 
                      />
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="btn-primary px-4 py-1.5 text-sm">Save</button>
                        <button onClick={() => setEditingId(null)} className="btn-ghost px-4 py-1.5 text-sm">Cancel</button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Sub-categories</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {editSubCategories.map(sub => (
                          <div key={sub} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-primary-100">
                            {sub}
                            <button type="button" onClick={() => removeSubCategory(sub)} className="hover:text-red-500 hover:bg-red-50 rounded-full p-0.5"><FiX size={14}/></button>
                          </div>
                        ))}
                        {editSubCategories.length === 0 && <span className="text-xs text-gray-400 py-1">No sub-categories added yet.</span>}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          value={newSubCat}
                          onChange={(e) => setNewSubCat(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubCategory())}
                          className="input !py-1.5 text-sm max-w-xs"
                          placeholder="Type sub-category & press Enter" 
                        />
                        <button type="button" onClick={addSubCategory} className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Add</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        cat.subCategories.map((sub, i) => (
                           <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                             {sub}
                           </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">No sub-categories</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
