import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Image as ImageIcon, Save, Loader2 } from 'lucide-react';

export default function AdminNewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    judul: '',
    isi: '',
    image: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchNews = async () => {
        try {
          const response = await api.get(`/news/${id}`);
          const newsData = response.data.data;
          setFormData({
            judul: newsData.judul,
            isi: newsData.isi,
            image: newsData.image,
          });
          setImagePreview(newsData.image);
        } catch (error) {
          console.error("Error fetching news:", error);
          setError("Gagal memuat artikel berita.");
        } finally {
          setLoading(false);
        }
      };
      fetchNews();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let finalImageUrl = formData.image;

      // 1. Upload Image if there's a new file selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        
        const uploadResponse = await api.post('/upload', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        finalImageUrl = uploadResponse.data.url;
      }

      // 2. Prepare payload
      const payload = {
        ...formData,
        image: finalImageUrl
      };

      // 3. Save to database
      if (isEditMode) {
        await api.put(`/news/${id}`, payload);
      } else {
        await api.post('/news', payload);
      }

      navigate('/admin/news');
    } catch (err: any) {
      console.error(err);
      setError('Gagal menyimpan berita. ' + (err.response?.data?.error || ''));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/news">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isEditMode ? 'Edit Article' : 'Write New Article'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Publish exciting automotive news to the world.</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-8 border border-red-100 dark:border-red-900">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Image Upload Section */}
            <div>
              <Label className="text-base font-semibold mb-4 block">Cover Image</Label>
              <div className="relative border-2 border-dashed border-border rounded-xl overflow-hidden group hover:border-emerald-500 transition-colors aspect-[21/9] flex flex-col items-center justify-center bg-muted cursor-pointer w-full">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground group-hover:text-emerald-500">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">Click to upload banner image</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  required={!isEditMode && !imagePreview}
                />
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="judul">Article Title</Label>
                <Input 
                  id="judul" 
                  name="judul" 
                  required 
                  value={formData.judul} 
                  onChange={handleChange} 
                  placeholder="e.g. The New 2024 Honda Civic Type R is Here!" 
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isi">Article Content</Label>
                <Textarea 
                  id="isi" 
                  name="isi" 
                  required 
                  value={formData.isi} 
                  onChange={handleChange} 
                  placeholder="Write the full news story here..." 
                  className="min-h-[300px] text-base resize-y"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex justify-end gap-4">
            <Link to="/admin/news">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-32" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
