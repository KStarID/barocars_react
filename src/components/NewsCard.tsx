import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';

interface NewsItem {
  id: string;
  image: string;
  judul: string;
  tanggal: string;
  waktu: string;
  author: string;
  isi: string;
}

export default function NewsCard({ news }: { news: NewsItem }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="overflow-hidden border border-border shadow-lg bg-card text-card-foreground group cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden aspect-[16/9]">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={news.image} 
            alt={news.judul} 
            className="object-cover w-full h-full transition-transform duration-300"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {news.judul}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>{news.tanggal}</span>
              <Clock className="w-4 h-4 text-emerald-500 ml-2" />
              <span>{news.waktu}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              <span className="truncate">{news.author}</span>
            </div>
          </div>
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {news.isi}
          </p>
        </CardContent>
        <CardFooter className="pt-2 border-t border-border bg-muted/50 mt-auto">
          <Link to={`/news/${news.id}`} className="w-full">
            <Button variant="ghost" className="w-full text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-medium">
              Read More
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
