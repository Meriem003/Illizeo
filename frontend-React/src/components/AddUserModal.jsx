import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, UserPlus, User, Mail, Lock, Shield, AlertCircle, Sparkles } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      setFormData({ name: '', email: '', password: '', is_admin: false });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', is_admin: false });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card p-8 max-w-lg w-full mx-4 relative overflow-hidden animate-scale-in">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600"></div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-900">Ajouter un employé</h3>
              <p className="text-sm text-neutral-500 mt-0.5">Créer un nouveau compte utilisateur</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 p-2.5 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-error-50 border border-error-200 rounded-xl animate-slide-in-right">
            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="user-name" className="block text-sm font-semibold text-neutral-700 mb-2">
              Nom complet
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                <User className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500" />
              </div>
              <input
                id="user-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-modern pl-12 hover:border-neutral-300 focus:shadow-lg focus:shadow-primary-500/10"
                placeholder="Ex: John Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-email" className="block text-sm font-semibold text-neutral-700 mb-2">
              Adresse email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                <Mail className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500" />
              </div>
              <input
                id="user-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-modern pl-12 hover:border-neutral-300 focus:shadow-lg focus:shadow-primary-500/10"
                placeholder="john.doe@entreprise.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="user-password" className="block text-sm font-semibold text-neutral-700 mb-2">
              Mot de passe
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                <Lock className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500" />
              </div>
              <input
                id="user-password"
                type="password"
                required
                minLength="8"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-modern pl-12 hover:border-neutral-300 focus:shadow-lg focus:shadow-primary-500/10"
                placeholder="Minimum 8 caractères"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 transition-all hover:border-primary-300">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="is_admin"
                checked={formData.is_admin}
                onChange={(e) => setFormData({ ...formData, is_admin: e.target.checked })}
                className="mt-0.5 h-5 w-5 text-primary-600 focus:ring-primary-500 border-primary-300 rounded cursor-pointer"
              />
              <label htmlFor="is_admin" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800 mb-1">
                  <Shield className="w-4 h-4 text-primary-600" />
                  Droits d'administrateur
                </div>
                <p className="text-xs text-neutral-600">
                  Accordez un accès complet à la gestion de la plateforme et des utilisateurs
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-neutral-100">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Création en cours...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Créer l'employé
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddUserModal;