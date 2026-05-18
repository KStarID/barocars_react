import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news');
      setNews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Failed to delete news.");
    }
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manage News</h2>
          <p className="text-muted-foreground text-sm mt-1">Add, edit, or delete automotive news articles.</p>
        </div>
        <Link to="/admin/news/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Write News
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                    <img src={item.image} alt={item.judul} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground max-w-xs truncate">{item.judul}</TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>{item.tanggal} {item.waktu}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/news/${item.id}/edit`}>
                      <Button variant="outline" size="sm" className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the news article.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {news.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No news found. Click "Write News" to publish one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
