import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Building2, Mail, Lock, AlertCircle } from 'lucide-react';
import { getTenantDisplayName } from '../utils/tenant';

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

  return (
    <div className="w-full max-w-md">
      {/* Card moderne avec ombre douce */}
      <div className="card p-8 sm:p-10">
        {/* En-tête avec gradient subtil */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Illizeo
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-xl">
            <Building2 className="w-4 h-4 text-primary-600 mr-2" />
            <span className="text-sm font-semibold text-primary-700">{tenantName}</span>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Connectez-vous à votre espace de travail
          </p>
        </div>

        {/* Message d'erreur moderne */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email avec icône */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern pl-11"
                placeholder="nom@entreprise.com"
              />
            </div>
          </div>

          {/* Mot de passe avec icône */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern pl-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Bouton de connexion moderne */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Lien vers l'inscription */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Nouvelle entreprise ?{' '}
            <a href="/register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Créer un compte
            </a>
          </p>
        </div>
      </div>

      {/* Footer subtil */}
      <p className="mt-6 text-center text-xs text-neutral-400">
        © 2026 Illizeo. Plateforme multi-tenant sécurisée.
      </p>
    </div>
  );
};

export default Login;