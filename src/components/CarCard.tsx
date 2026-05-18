import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Fuel, Palette, Calendar } from 'lucide-react';

interface Car {
  id: string;
  merk: string;
  model: string;
  harga: string;
  image: string;
  kondisi: string;
  transmisi: string;
  bahan_bakar: string;
  warna: string;
  tahun_pembuatan: string;
}

export default function CarCard({ car }: { car: Car }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="group bg-card text-card-foreground rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full">
        <div className="relative overflow-hidden aspect-[4/3]">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={car.image} 
            alt={`${car.merk} ${car.model}`} 
            className="object-cover w-full h-full transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm">
            {car.kondisi}
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {car.merk} {car.model}
              </CardTitle>
              <CardDescription className="mt-1 font-medium text-emerald-600 dark:text-emerald-400 text-lg">
                Rp {car.harga}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{car.transmisi}</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{car.bahan_bakar}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{car.tahun_pembuatan}</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{car.warna}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t border-border bg-gray-50/50 dark:bg-gray-900/50">
          <Link to={`/cars/${car.id}`} className="w-full">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium" variant="default">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
