import { useState } from 'react';
import { Building2, UserPlus, CheckCircle } from 'lucide-react';
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
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Entreprise créée !</h2>
            <p className="mt-2 text-gray-600">
              Votre espace de travail <strong>{success.tenant.company_name}</strong> est prêt.
            </p>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium">Informations de connexion :</p>
            <ul className="mt-2 text-sm text-green-700 space-y-1">
              <li><strong>URL :</strong> {success.tenant.domain}:5173</li>
              <li><strong>Email :</strong> {success.admin.email}</li>
              <li><strong>Mot de passe :</strong> celui que vous avez choisi</li>
            </ul>
          </div>

          <div className="mt-6">
            <a
              href={tenantUrl}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700"
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
              className="text-sm text-primary hover:underline"
            >
              Créer une autre entreprise
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
          <Building2 className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
            Créer votre entreprise
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enregistrez votre organisation sur Illizeo
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Informations de l'entreprise</h3>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                  Nom de l'entreprise
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="Ma Société"
                />
                {fieldErrors.company_name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.company_name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                  Sous-domaine
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    id="domain"
                    name="domain"
                    type="text"
                    required
                    value={formData.domain}
                    onChange={handleChange}
                    className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    placeholder="masociete"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    .localhost
                  </span>
                </div>
                {fieldErrors.domain && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.domain[0]}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Administrateur</h3>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="admin_name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <input
                  id="admin_name"
                  name="admin_name"
                  type="text"
                  required
                  value={formData.admin_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="Jean Dupont"
                />
                {fieldErrors.admin_name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.admin_name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="admin_email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="admin_email"
                  name="admin_email"
                  type="email"
                  required
                  value={formData.admin_email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="admin@masociete.com"
                />
                {fieldErrors.admin_email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.admin_email[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="admin_password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  id="admin_password"
                  name="admin_password"
                  type="password"
                  required
                  value={formData.admin_password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="••••••••"
                />
                {fieldErrors.admin_password && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.admin_password[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="admin_password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  id="admin_password_confirmation"
                  name="admin_password_confirmation"
                  type="password"
                  required
                  value={formData.admin_password_confirmation}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Création en cours...'
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Créer mon entreprise
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <a href="http://localhost:5173/login" className="text-primary hover:underline">
              Connectez-vous via votre sous-domaine
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterTenant;
