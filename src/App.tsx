import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/layouts/AdminLayout';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import News from '@/pages/News';
import Cars from '@/pages/Cars';
import CarDetail from '@/pages/CarDetail';
import NewsDetail from '@/pages/NewsDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';

import AdminCars from '@/pages/admin/AdminCars';
import AdminCarsForm from '@/pages/admin/AdminCarsForm';
import AdminNews from '@/pages/admin/AdminNews';
import AdminNewsForm from '@/pages/admin/AdminNewsForm';
import Profile from '@/pages/admin/AdminProfile'; // Kept the component but renamed route
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public Routes with Navbar */}
          <Route element={
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                <Outlet />
              </main>
            </div>
          }>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected User Routes (No Seller required) */}
            <Route element={<ProtectedRoute requireSeller={false} />}>
              <Route path="/profile" element={
                <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-background">
                  <Profile />
                </div>
              } />
            </Route>
          </Route>
          
          {/* Protected Admin Routes (Requires Seller) */}
          <Route element={<ProtectedRoute requireSeller={true} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/cars" replace />} />
              <Route path="/admin/profile" element={<Profile />} />
              
              <Route path="/admin/cars" element={<AdminCars />} />
              <Route path="/admin/cars/new" element={<AdminCarsForm />} />
              <Route path="/admin/cars/:id/edit" element={<AdminCarsForm />} />
              
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/news/new" element={<AdminNewsForm />} />
              <Route path="/admin/news/:id/edit" element={<AdminNewsForm />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
