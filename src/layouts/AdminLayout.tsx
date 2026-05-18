import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CarFront, Newspaper, LayoutDashboard, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Cars', href: '/admin/cars', icon: CarFront },
    { name: 'News', href: '/admin/news', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border fixed h-full z-10 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <img src={isDark ? '/car-logos.png' : '/car-logo.jpeg'} alt="Logo" className="h-8 w-auto mr-2 rounded" />
          <span className="font-bold text-lg text-emerald-600 dark:text-emerald-500">Admin Panel</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <Link to="/profile" className="flex items-center mb-4 px-2 hover:bg-muted p-2 rounded-lg transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900 transition-colors">
              {currentUser?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{currentUser?.displayName || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-foreground">
            {navigation.find(n => location.pathname.startsWith(n.href) && n.href !== '/admin')?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400">
              View Public Site &rarr;
            </Link>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
