import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CarFront, Search } from 'lucide-react';
import api from '@/lib/api';
import CarCard from '@/components/CarCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKondisi, setFilterKondisi] = useState('All');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars');
        const data = response.data.data || [];
        
        // Firebase Push IDs are lexicographically sortable by time.
        // Sorting descending will show newest first.
        const sortedData = data.sort((a: any, b: any) => {
          if (a.id && b.id) {
            // Reverse string comparison for descending order
            return b.id.localeCompare(a.id);
          }
          return 0;
        });
        
        setCars(sortedData);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = cars.filter((car: any) => {
    const matchSearch = (car.merk + " " + car.model).toLowerCase().includes(searchTerm.toLowerCase());
    const matchKondisi = filterKondisi === 'All' || car.kondisi === filterKondisi;
    return matchSearch && matchKondisi;
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <CarFront className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                All Collection
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our entire collection of premium cars and find the one that suits you best.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Find car by brand or model..." 
                className="pl-9 bg-card text-card-foreground border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterKondisi} onValueChange={setFilterKondisi}>
              <SelectTrigger className="w-full sm:w-[150px] bg-card text-card-foreground border-border">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Condition</SelectItem>
                <SelectItem value="Baru">New</SelectItem>
                <SelectItem value="Bekas">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCars.length > 0 ? (
              filteredCars.map((car: any, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                {cars.length === 0 ? 'No data found.' : 'No car found that matches your search.'}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
