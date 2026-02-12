import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Building2 } from 'lucide-react';
import { isOnTenantDomain, getTenantDisplayName } from '../utils/tenant';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const tenantName = getTenantDisplayName();

  if (!isOnTenantDomain()) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
          <div className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Illizeo</h2>
            <p className="mt-2 text-gray-600">Plateforme Multi-Tenant</p>
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Pour accéder à votre espace de travail, utilisez l'URL de votre entreprise :
              </p>
              <p className="mt-2 text-sm font-mono bg-yellow-100 p-2 rounded">
                http://<span className="text-primary font-bold">votre-entreprise</span>.localhost:5173
              </p>
            </div>
            <div className="mt-6 text-left">
              <p className="text-sm font-medium text-gray-700 mb-2">Exemples de tenants disponibles :</p>
              <ul className="space-y-2">
                <li>
                  <a href="http://acme.localhost:5173" className="text-primary hover:underline text-sm">
                    → acme.localhost:5173 (Acme Corporation)
                  </a>
                </li>
                <li>
                  <a href="http://techcorp.localhost:5173" className="text-primary hover:underline text-sm">
                    → techcorp.localhost:5173 (Tech Corp)
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Vous n'avez pas encore d'entreprise ?</p>
              <a 
                href="/register" 
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-blue-50"
              >
                Créer mon entreprise
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Illizeo
          </h2>
          <div className="mt-2 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">{tenantName}</span>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous à votre workspace
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="admin@company.test"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Connexion...'
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Se connecter
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;