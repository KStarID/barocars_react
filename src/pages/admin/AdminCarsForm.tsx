import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Image as ImageIcon, Save, Loader2 } from 'lucide-react';

export default function AdminCarsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    merk: '',
    model: '',
    harga: '',
    kondisi: 'Baru',
    transmisi: 'Automatic',
    bahan_bakar: 'Bensin',
    warna: '',
    tahun_pembuatan: '',
    image: '',
    deskripsi: '',
    kontak_penjual: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchCar = async () => {
        try {
          const response = await api.get(`/cars/${id}`);
          const car = response.data.data;
          setFormData({
            merk: car.merk,
            model: car.model,
            harga: car.harga,
            kondisi: car.kondisi,
            transmisi: car.transmisi,
            bahan_bakar: car.bahan_bakar,
            warna: car.warna,
            tahun_pembuatan: car.tahun_pembuatan,
            image: car.image,
            deskripsi: car.deskripsi || '',
            kontak_penjual: car.kontak_penjual || ''
          });
          setImagePreview(car.image);
        } catch (error) {
          console.error("Error fetching car:", error);
          setError("Gagal memuat data mobil.");
        } finally {
          setLoading(false);
        }
      };
      fetchCar();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
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
        await api.put(`/cars/${id}`, payload);
      } else {
        await api.post('/cars', payload);
      }

      navigate('/admin/cars');
    } catch (err: any) {
      console.error(err);
      setError('Gagal menyimpan data mobil. ' + (err.response?.data?.error || ''));
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
        <Link to="/admin/cars">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {isEditMode ? 'Edit Car' : 'Add New Car'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Fill in the form below with complete specifications.</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mb-8 border border-red-100 dark:border-red-900">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Upload Section */}
            <div className="col-span-1">
              <Label className="text-base font-semibold mb-4 block">Car Photo</Label>
              <div className="relative border-2 border-dashed border-border rounded-xl overflow-hidden group hover:border-emerald-500 transition-colors aspect-[4/3] flex flex-col items-center justify-center bg-muted cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground group-hover:text-emerald-500">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">Click to upload photo</span>
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
              <p className="text-xs text-muted-foreground mt-2 text-center">Recommendation: Format JPG/PNG, ratio 4:3</p>
            </div>

            {/* Form Fields Section */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="merk">Brand</Label>
                  <Input id="merk" name="merk" required value={formData.merk} onChange={handleChange} placeholder="Honda, Toyota, BMW..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model Name</Label>
                  <Input id="model" name="model" required value={formData.model} onChange={handleChange} placeholder="Civic, Avanza..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="harga">Price (IDR)</Label>
                  <Input id="harga" name="harga" required value={formData.harga} onChange={handleChange} placeholder="Contoh: 250.000.000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tahun_pembuatan">Year of Production</Label>
                  <Input id="tahun_pembuatan" name="tahun_pembuatan" required value={formData.tahun_pembuatan} onChange={handleChange} placeholder="2023" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={formData.kondisi} onValueChange={(val) => handleSelectChange('kondisi', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baru">New</SelectItem>
                      <SelectItem value="Bekas">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <Select value={formData.transmisi} onValueChange={(val) => handleSelectChange('transmisi', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select value={formData.bahan_bakar} onValueChange={(val) => handleSelectChange('bahan_bakar', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bensin">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Listrik">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warna">Color</Label>
                <Input id="warna" name="warna" required value={formData.warna} onChange={handleChange} placeholder="Black, White..." />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="kontak_penjual">Seller Contact (WhatsApp)</Label>
                <Input id="kontak_penjual" name="kontak_penjual" required value={formData.kontak_penjual} onChange={handleChange} placeholder="Example: 6281234567890" />
                <p className="text-xs text-muted-foreground">Use country code (62) without space or plus sign.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Full Description</Label>
                <Textarea 
                  id="deskripsi" 
                  name="deskripsi" 
                  required 
                  value={formData.deskripsi} 
                  onChange={handleChange} 
                  placeholder="Describe the car condition, service history, tax, etc..." 
                  className="min-h-[150px] resize-y"
                />
              </div>

            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex justify-end gap-4">
            <Link to="/admin/cars">
              <Button type="button" variant="outline">Back</Button>
            </Link>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-32" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Car
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
