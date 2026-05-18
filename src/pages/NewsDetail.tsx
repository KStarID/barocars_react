import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Berita tidak ditemukan</h2>
        <Link to="/news">
          <Button variant="outline">Kembali ke Daftar Berita</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Berita
        </Link>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card text-card-foreground rounded-3xl overflow-hidden shadow-sm border border-border"
        >
          {/* Image Section */}
          <div className="w-full h-[400px] overflow-hidden bg-muted relative">
            <img 
              src={news.image} 
              alt={news.judul} 
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>{news.tanggal}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>{news.waktu}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-foreground">{news.author}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
              {news.judul}
            </h1>

            <div className="prose prose-emerald dark:prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {news.isi}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
