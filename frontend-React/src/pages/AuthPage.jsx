import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Building2, Mail, Lock, AlertCircle, User, Globe, UserPlus, Shield, Zap, CheckCircle } from 'lucide-react';
import { getTenantDisplayName } from '../utils/tenant';
import AnimatedBackground from '../components/AnimatedBackground';
import axios from 'axios';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    company_name: '',
    domain: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
    admin_password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const tenantName = getTenantDisplayName();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'company_name') {
      const domain = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 20);
      setRegisterData(prev => ({ ...prev, domain }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/register-tenant', registerData, {
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 flex items-center justify-center p-5 relative overflow-hidden">
        <AnimatedBackground />
        
        <div className="relative z-10 max-w-md w-full card p-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl mb-4 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Entreprise créée !</h2>
            <p className="text-neutral-600">
              Votre espace <strong className="text-neutral-900">{success.tenant.company_name}</strong> est prêt.
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
            </ul>
          </div>

          <a href={tenantUrl} className="btn-primary w-full mt-6 flex justify-center items-center">
            Accéder à mon espace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 flex items-center justify-center p-5 relative overflow-hidden">
      <AnimatedBackground />

      {error && (
        <div className="fixed top-5 right-5 z-[9999] max-w-md animate-slide-in-right">
          <div className="flex items-start gap-3 p-4 bg-error-500 text-white rounded-xl shadow-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-white hover:scale-110 transition-transform">
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 bg-white rounded-[30px] shadow-[0_10px_40px_rgba(79,70,229,0.35)] overflow-hidden w-full max-w-[900px] min-h-[560px]">
        
        <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-full' : 'translate-x-0'} z-20`}>
          <form onSubmit={handleLoginSubmit} className="h-full flex flex-col items-center justify-center px-10 bg-white">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Se Connecter</h1>
            
            <div className="inline-flex items-center px-3 py-1.5 bg-primary-50 rounded-lg mb-4">
              <Building2 className="w-4 h-4 text-primary-600 mr-2" />
              <span className="text-sm font-semibold text-primary-700">{tenantName}</span>
            </div>

            <p className="text-sm text-neutral-500 mb-6">Accédez à votre espace de travail</p>

            <input
              type="email"
              required
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="w-full bg-neutral-100 border-2 border-transparent my-2 px-5 py-3 text-sm rounded-lg outline-none transition-all focus:bg-white focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)]"
              placeholder="Email"
            />

            <input
              type="password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full bg-neutral-100 border-2 border-transparent my-2 px-5 py-3 text-sm rounded-lg outline-none transition-all focus:bg-white focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1)]"
              placeholder="Mot de passe"
            />

            <a href="#" className="text-primary-600 text-sm my-4 hover:text-primary-700 transition-colors flex items-center gap-2">
              <Lock size={14} /> Mot de passe oublié ?
            </a>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-11 py-3 rounded-lg font-semibold uppercase tracking-wide mt-2 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn size={16} /> Connexion
                </>
              )}
            </button>
          </form>
        </div>

        <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out ${
          isSignUp ? 'translate-x-full opacity-100 z-50' : 'translate-x-0 opacity-0 z-10'
        }`}>
          <div className="h-full overflow-y-auto">
            <form onSubmit={handleRegisterSubmit} className="flex flex-col items-center justify-center px-10 bg-white py-8 min-h-full">
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">Créer une Entreprise</h1>
              <p className="text-sm text-neutral-500 mb-4">Enregistrez votre organisation</p>

              <div className="w-full space-y-2">
                <div>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={registerData.company_name}
                    onChange={handleRegisterChange}
                    className="w-full bg-neutral-100 border-2 border-transparent px-5 py-2.5 text-sm rounded-lg outline-none transition-all focus:bg-white focus:border-primary-500"
                    placeholder="Nom de l'entreprise"
                  />
                  {fieldErrors.company_name && (
                    <p className="text-xs text-error-600 mt-1">{fieldErrors.company_name[0]}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="domain"
                      required
                      value={registerData.domain}
                      onChange={handleRegisterChange}
                      className="flex-1 bg-neutral-100 border-2 border-transparent px-5 py-2.5 text-sm rounded-l-lg outline-none transition-all focus:bg-white focus:border-primary-500"
                      placeholder="sous-domaine"
                    />
                    <span className="bg-neutral-100 px-3 py-2.5 text-sm rounded-r-lg text-neutral-600">.localhost</span>
                  </div>
                  {fieldErrors.domain && (
                    <p className="text-xs text-error-600 mt-1">{fieldErrors.domain[0]}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="admin_name"
                    required
                    value={registerData.admin_name}
                    onChange={handleRegisterChange}
                    className="w-full bg-neutral-100 border-2 border-transparent px-5 py-2.5 text-sm rounded-lg outline-none transition-all focus:bg-white focus:border-primary-500"
                    placeholder="Nom de l'administrateur"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="admin_email"
                    required
                    value={registerData.admin_email}
                    onChange={handleRegisterChange}
                    className="w-full bg-neutral-100 border-2 border-transparent px-5 py-2.5 text-sm rounded-lg outline-none transition-all focus:bg-white focus:border-primary-500"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="admin_password"
                    required
                    value={registerData.admin_password}
                    onChange={handleRegisterChange}
                    className="w-full bg-neutral-100 border-2 border-transparent px-5 py-2.5 text-sm rounded-lg outline-none transition-all focus:bg-white focus:border-primary-500"
                    placeholder="Mot de passe"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="admin_password_confirmation"
                    required
                    value={registerData.admin_password_confirmation}
                    onChange={handleRegisterChange}
                    className="w-full bg-neutral-100 border-2 border-transparent px-5 py-2.5 text-sm rounded-lg outline-none transition-all focus:bg-white focus:border-primary-500"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-11 py-3 rounded-lg font-semibold uppercase tracking-wide mt-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Créer
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-[1000] transition-all duration-700 ease-in-out ${isSignUp ? '-translate-x-full rounded-[0_120px_120px_0]' : 'translate-x-0 rounded-[120px_0_0_120px]'}`}>
          <div className={`bg-gradient-to-r from-primary-500 to-primary-600 h-full text-white relative -left-full w-[200%] transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-[200%]'}`}>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-5 animate-pulse">
                <Building2 size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-3">Rejoignez-nous !</h1>
              <p className="text-sm leading-6 mb-6">Connectez-vous pour accéder à votre espace de travail</p>
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="bg-transparent border-2 border-white px-11 py-3 rounded-lg font-semibold uppercase tracking-wide cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <LogIn size={16} /> Se Connecter
              </button>
            </div>

            <div className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-[200%]' : 'translate-x-0'}`}>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-5 animate-pulse">
                <Building2 size={32} />
              </div>
              <h1 className="text-3xl font-bold mb-3">Nouvelle Entreprise ?</h1>
              <p className="text-sm leading-6 mb-6">Créez votre espace SaaS et gérez votre équipe en quelques clics</p>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="bg-transparent border-2 border-white px-11 py-3 rounded-lg font-semibold uppercase tracking-wide cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <UserPlus size={16} /> S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;