import { useState } from 'react';
import { Building2, UserPlus, CheckCircle, Mail, Lock, User, Globe, AlertCircle } from 'lucide-react';
import axios from 'axios';

const RegisterTenant = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    domain: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
    admin_password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'company_name') {
      const domain = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 20);
      setFormData(prev => ({ ...prev, domain }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/register-tenant', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      setSuccess(response.data);
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la création du tenant');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const tenantUrl = `http://${success.tenant.domain}:5173/login`;
    
    return (
      <div className="w-full max-w-md">
        <div className="card p-8 sm:p-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl mb-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Entreprise créée !</h2>
            <p className="text-neutral-600">
              Votre espace de travail <strong className="text-neutral-900">{success.tenant.company_name}</strong> est prêt.
            </p>
          </div>

          <div className="mt-6 p-5 bg-success-50 border border-success-200 rounded-xl">
            <p className="text-sm text-success-800 font-semibold mb-3">Informations de connexion</p>
            <ul className="text-sm text-success-700 space-y-2">
              <li className="flex items-start">
                <Globe className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>URL :</strong> {success.tenant.domain}:5173</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Email :</strong> {success.admin.email}</span>
              </li>
              <li className="flex items-start">
                <Lock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Mot de passe :</strong> celui que vous avez choisi</span>
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <a
              href={tenantUrl}
              className="btn-primary w-full flex justify-center items-center"
            >
              Accéder à mon espace
            </a>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setSuccess(null);
                setFormData({
                  company_name: '',
                  domain: '',
                  admin_name: '',
                  admin_email: '',
                  admin_password: '',
                  admin_password_confirmation: '',
                });
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Créer une autre entreprise
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="card p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Créer votre entreprise
          </h2>
          <p className="text-sm text-neutral-500">
            Enregistrez votre organisation sur Illizeo
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Entreprise */}
          <div className="border-b border-neutral-200 pb-6">
            <h3 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-primary-600" />
              Informations de l'entreprise
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom de l'entreprise
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="input-modern pl-11"
                    placeholder="Ma Société"
                  />
                </div>
                {fieldErrors.company_name && (
                  <p className="mt-1.5 text-xs text-error-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {fieldErrors.company_name[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-neutral-700 mb-2">
                  Sous-domaine
                </label>
                <div className="relative flex rounded-xl shadow-sm overflow-hidden">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Globe className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="domain"
                    name="domain"
                    type="text"
                    required
                    value={formData.domain}
                    onChange={handleChange}
                    className="flex-1 block w-full pl-11 pr-3 py-3 border border-neutral-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="masociete"
                  />
                  <span className="inline-flex items-center px-4 border border-l-0 border-neutral-300 bg-neutral-50 text-neutral-600 text-sm font-medium">
                    .localhost
                  </span>
                </div>
                {fieldErrors.domain && (
                  <p className="mt-1.5 text-xs text-error-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {fieldErrors.domain[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section Administrateur */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center">
              <User className="w-4 h-4 mr-2 text-primary-600" />
              Administrateur
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="admin_name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="admin_name"
                    name="admin_name"
                    type="text"
                    required
                    value={formData.admin_name}
                    onChange={handleChange}
                    className="input-modern pl-11"
                    placeholder="Jean Dupont"
                  />
                </div>
                {fieldErrors.admin_name && (
                  <p className="mt-1.5 text-xs text-error-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {fieldErrors.admin_name[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="admin_email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="admin_email"
                    name="admin_email"
                    type="email"
                    required
                    value={formData.admin_email}
                    onChange={handleChange}
                    className="input-modern pl-11"
                    placeholder="admin@masociete.com"
                  />
                </div>
                {fieldErrors.admin_email && (
                  <p className="mt-1.5 text-xs text-error-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {fieldErrors.admin_email[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="admin_password" className="block text-sm font-medium text-neutral-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="admin_password"
                    name="admin_password"
                    type="password"
                    required
                    value={formData.admin_password}
                    onChange={handleChange}
                    className="input-modern pl-11"
                    placeholder="••••••••"
                  />
                </div>
                {fieldErrors.admin_password && (
                  <p className="mt-1.5 text-xs text-error-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {fieldErrors.admin_password[0]}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="admin_password_confirmation" className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="admin_password_confirmation"
                    name="admin_password_confirmation"
                    type="password"
                    required
                    value={formData.admin_password_confirmation}
                    onChange={handleChange}
                    className="input-modern pl-11"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Création en cours...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Créer mon entreprise
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            Déjà inscrit ?{' '}
            <a href="http://localhost:5173/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Connectez-vous via votre sous-domaine
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

export default RegisterTenant;
