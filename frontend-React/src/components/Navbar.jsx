import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Users, Home, Building2 } from 'lucide-react';
import { getTenantDisplayName } from '../utils/tenant';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const tenantName = getTenantDisplayName();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-neutral-900">Illizeo</h1>
            </div>
            
            <div className="inline-flex items-center px-3 py-1.5 bg-primary-50 rounded-lg">
              <Building2 className="w-4 h-4 text-primary-600 mr-1.5" />
              <span className="text-sm font-semibold text-primary-700">{tenantName}</span>
            </div>

            <div className="hidden sm:flex sm:gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/users"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Utilisateurs
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
              {isAdmin() && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-100 text-xs font-semibold text-primary-700">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-error-700 hover:text-error-800 hover:bg-error-50 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;