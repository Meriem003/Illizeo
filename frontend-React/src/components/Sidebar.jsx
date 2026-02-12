import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  Settings, 
  Building2,
  Search,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getTenantDisplayName } from '../utils/tenant';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantName = getTenantDisplayName();

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Utilisateurs',
      href: '/users',
      icon: Users,
      current: location.pathname === '/users'
    }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          isOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="h-full px-4 py-6 bg-white border-r border-neutral-200 shadow-soft flex flex-col">
          <div className="mb-8 px-2">
            <div className={`flex items-center mb-6 ${isOpen ? 'gap-3' : 'justify-center'}`}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-neutral-900 truncate">Illizeo</h2>
                  <p className="text-xs text-neutral-500 truncate">{tenantName}</p>
                </div>
              )}
            </div>

            {isOpen && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1 px-2">
            {isOpen && (
              <p className="px-3 mb-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Menu principal
              </p>
            )}
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    item.current
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                  } ${!isOpen && 'justify-center'}`}
                  title={!isOpen ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    item.current ? 'text-white' : 'text-neutral-500 group-hover:text-primary-600'
                  }`} />
                  {isOpen && (
                    <span className="flex-1 text-left font-medium text-sm">{item.name}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {isOpen && (
            <div className="mt-auto pt-6 border-t border-neutral-200 px-2">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">Besoin d'aide ?</h4>
                    <p className="text-xs text-neutral-600">Centre d'assistance</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex items-center justify-center mt-4 p-2 rounded-xl hover:bg-neutral-100 transition-colors mx-2"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
