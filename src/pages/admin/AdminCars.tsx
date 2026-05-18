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
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');
      setCars(response.data.data || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/cars/${id}`);
      // Refresh the list after successful deletion
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car.");
    }
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Manage Cars</h2>
          <p className="text-muted-foreground text-sm mt-1">Add, edit, or delete cars from your collection.</p>
        </div>
        <Link to="/admin/cars/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Car
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Merk</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car: any) => (
              <TableRow key={car.id}>
                <TableCell>
                  <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                    <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{car.merk}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell className="font-semibold text-emerald-600">Rp {car.harga}</TableCell>
                <TableCell>{car.tahun_pembuatan}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    
                    <Dialog>
                      <DialogTrigger>
                        <Button variant="outline" size="sm" className="h-8 px-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{car.merk} {car.model}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                           <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
                            <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div>
                               <p className="text-muted-foreground font-medium">Price</p>
                              <p className="text-lg font-bold text-emerald-600">Rp {car.harga}</p>
                            </div>
                            <div>
                               <p className="text-muted-foreground font-medium">Condition</p>
                              <p className="font-medium">{car.kondisi}</p>
                            </div>
                            <div>
                               <p className="text-muted-foreground font-medium">Year of Production</p>
                              <p className="font-medium">{car.tahun_pembuatan}</p>
                            </div>
                            <div>
                               <p className="text-muted-foreground font-medium">Color</p>
                              <p className="font-medium">{car.warna}</p>
                            </div>
                            <div>
                               <p className="text-muted-foreground font-medium">Transmission</p>
                              <p className="font-medium">{car.transmisi}</p>
                            </div>
                            <div>
                               <p className="text-muted-foreground font-medium">Fuel Type</p>
                              <p className="font-medium">{car.bahan_bakar}</p>
                            </div>
                            <div className="col-span-2">
                               <p className="text-muted-foreground font-medium">Seller Contact</p>
                              <p className="font-medium">{car.kontak_penjual || '-'}</p>
                            </div>
                          </div>
                          {car.deskripsi && (
                            <div className="mt-4">
                               <p className="text-muted-foreground font-medium">Full Description</p>
                              <p className="text-sm mt-1 text-foreground bg-muted p-3 rounded-lg border border-border whitespace-pre-wrap">{car.deskripsi}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Link to={`/admin/cars/${car.id}/edit`}>
                      <Button variant="outline" size="sm" className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button variant="outline" size="sm" className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the {car.merk} {car.model} from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(car.id)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {cars.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  No cars found. Click "Add New Car" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
