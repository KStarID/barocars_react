import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Fuel, Palette, Settings, MessageCircle } from 'lucide-react';

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get(`/cars/${id}`);
        setCar(response.data.data);
      } catch (error) {
        console.error("Error fetching car detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Mobil tidak ditemukan</h2>
        <Link to="/cars">
          <Button variant="outline">Kembali ke Daftar Mobil</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cars" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Koleksi
        </Link>

        <div className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative aspect-video lg:aspect-auto lg:h-full overflow-hidden bg-muted">
              <img 
                src={car.image} 
                alt={`${car.merk} ${car.model}`} 
                className="object-cover w-full h-full absolute inset-0"
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm">
                {car.kondisi}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 md:p-8 flex flex-col h-full"
              >
                <div>
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4">
                    {car.kondisi}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">
                    {car.merk} {car.model}
                  </h1>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">
                    Rp {car.harga}
                  </p>
                </div>

                <div className="mt-8 border-t border-b border-border py-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Spesifikasi Kendaraan</h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-muted rounded-lg">
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transmisi</p>
                        <p className="font-medium text-foreground">{car.transmisi}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-muted rounded-lg">
                        <Fuel className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bahan Bakar</p>
                        <p className="font-medium text-foreground">{car.bahan_bakar}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-muted rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tahun Pembuatan</p>
                        <p className="font-medium text-foreground">{car.tahun_pembuatan}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-muted rounded-lg">
                        <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Warna</p>
                        <p className="font-medium text-foreground">{car.warna}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {car.deskripsi && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Deskripsi</h3>
                    <div className="prose prose-emerald dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                      {car.deskripsi}
                    </div>
                  </div>
                )}

                <div className="mt-8 mt-auto pt-8 border-t border-border">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={`https://wa.me/${car.kontak_penjual}?text=Halo, saya tertarik dengan mobil ${car.merk} ${car.model} yang ada di Barocars.`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg shadow-lg shadow-emerald-200 dark:shadow-none">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat Penjual via WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
