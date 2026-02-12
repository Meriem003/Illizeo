import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Settings, ChevronDown, Menu, Bell } from 'lucide-react';
import PropTypes from 'prop-types';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <nav className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-4"
            >
              <Menu className="w-6 h-6 text-neutral-700" />
            </button>
            
            <div className="lg:hidden flex items-center gap-2">
              <span className="text-lg font-bold text-neutral-900">Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-all group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                  {isAdmin() && (
                    <span className="inline-flex items-center text-xs font-semibold text-primary-700">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-1" />
                      Admin
                    </span>
                  )}
                </div>
                
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform hidden sm:block ${
                  userMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-soft-lg border border-neutral-200 py-2 z-20 animate-slide-in-right">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
                      {isAdmin() && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-100 text-xs font-semibold text-primary-700 mt-2">
                          <span className="w-2 h-2 bg-primary-500 rounded-full mr-2" />
                          Administrateur
                        </span>
                      )}
                    </div>

                    <div className="border-t border-neutral-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;