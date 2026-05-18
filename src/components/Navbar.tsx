import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BecomeSellerModal from '@/components/BecomeSellerModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const { currentUser, isSeller, logout } = useAuth();
  const navigate = useNavigate();
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={isDark ? '/car-logos.png' : '/car-logo.jpeg'} alt="Barocars Logo" className="h-8 w-auto object-contain rounded" />
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                BaroCars
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 font-medium transition-colors">Home</Link>
              <Link to="/cars" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 font-medium transition-colors">Cars</Link>
              <Link to="/news" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500 font-medium transition-colors">News</Link>

              <ThemeToggle />

              {currentUser ? (
                <div className="flex items-center gap-4 border-l pl-4 border-gray-200 dark:border-gray-800">
                  {!isSeller && (
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                      onClick={() => setIsSellerModalOpen(true)}
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Become Seller
                    </Button>
                  )}
                  {isSeller && (
                    <Link to="/admin">
                      <Button variant="ghost" className="text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                        <Store className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors cursor-pointer group">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                      {currentUser?.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="ghost" className="font-medium dark:text-gray-300">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Register</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <BecomeSellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />
    </>
  );
}

