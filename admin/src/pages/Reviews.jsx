import { useState, useEffect } from 'react';
import { FiTrash2, FiMessageSquare, FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getReviews, createReview, deleteReview } from '../api';
import imageCompression from 'browser-image-compression';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchReviews = () => {
    setLoading(true);
    getReviews()
      .then(res => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      toast.loading(`Compressing ${files.length} image(s)...`, { id: 'compress' });
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const compressed = await imageCompression(file, options);
          return {
            file: compressed,
            preview: URL.createObjectURL(compressed)
          };
        })
      );
      toast.dismiss('compress');
      
      setSelectedFiles(prev => [...prev, ...processedFiles]);
    } catch (error) {
      console.error(error);
      toast.dismiss('compress');
      toast.error('Failed to compress images');
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'svgifts_preset');

    const response = await fetch('https://api.cloudinary.com/v1_1/dwky1u6ui/image/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    }
    throw new Error(data.error?.message || 'Cloudinary upload failed');
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    toast.loading(`Uploading ${selectedFiles.length} review(s)...`, { id: 'upload' });

    try {
      const uploadPromises = selectedFiles.map(async (item) => {
        const imageUrl = await uploadToCloudinary(item.file);
        return createReview({ imageUrl });
      });
      
      await Promise.all(uploadPromises);
      
      toast.success('Reviews uploaded successfully!');
      setSelectedFiles([]);
      fetchReviews();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to upload reviews');
    } finally {
      toast.dismiss('upload');
      setUploading(false);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review image?')) return;
    try {
      await deleteReview(id);
      toast.success('Review deleted');
      setReviews(reviews.filter(r => r._id !== id));
    } catch {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiMessageSquare /> Customer Reviews
        </h1>
      </div>

      <div className="card mb-8">
        <h2 className="text-lg font-bold mb-4">Upload New Review Screenshots</h2>
        
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-primary-400 hover:bg-orange-50 transition-all mb-4">
          <FiUpload size={32} className="text-gray-400 mb-3" />
          <span className="font-medium text-gray-600">Click to upload images</span>
          <span className="text-sm text-gray-400 mt-1">Select one or multiple files</span>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="sr-only" />
        </label>

        {selectedFiles?.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {selectedFiles?.map((item, index) => (
                <div key={index} className="relative aspect-square border border-gray-200 rounded-xl p-1 bg-gray-50">
                  <img src={item.preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
                  <button 
                    onClick={() => removeSelectedFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 shadow-md"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <button 
                onClick={handleUpload} 
                disabled={uploading}
                className="btn-primary w-full"
              >
                {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Review(s)`}
              </button>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-lg font-bold mb-4">Uploaded Reviews</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full h-32 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-gray-500">No review images uploaded yet.</p>
          </div>
        ) : (
          reviews?.map(review => (
            <div key={review._id} className="relative group border border-gray-200 rounded-xl overflow-hidden aspect-[3/4] bg-gray-100 shadow-sm">
              <img src={review.imageUrl} alt="Customer Review" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(review._id)} 
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform scale-90 group-hover:scale-100 transition-all shadow-lg"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
