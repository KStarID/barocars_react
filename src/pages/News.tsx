import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import api from '@/lib/api';
import NewsCard from '@/components/NewsCard';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get('/news');
        setNewsList(response.data.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
              <Newspaper className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Latest Automotive News
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground mx-auto">
            Stay up to date with the latest releases, reviews, and industry updates.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {newsList.length > 0 ? (
              newsList.map((newsItem: any, index) => (
                <motion.div
                  key={newsItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <NewsCard news={newsItem} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                Belum ada berita terbaru.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
