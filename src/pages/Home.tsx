import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars');
        setCars(response.data.data.slice(0, 6)); // Show latest 6 cars
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center lg:pt-32 lg:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              The Best Place to Find Your Dream Car
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-8"
          >
            Premium Cars for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Premium People
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto mb-10"
          >
            Discover a curated collection of top-tier vehicles. From sleek sports cars to luxurious SUVs, find the perfect match for your lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center gap-4"
          >
            <Link to="/cars">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 text-base shadow-lg shadow-emerald-200 dark:shadow-none">
                Browse Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Vehicles</h2>
            <p className="mt-2 text-muted-foreground">Handpicked selections just for you</p>
          </div>
          <Link to="/cars">
            <Button variant="ghost" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {cars.map((car: any, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
