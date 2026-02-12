export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Illizeo';
export const API_URL = import.meta.env.VITE_API_URL;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
};

export const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Email ou mot de passe incorrect',
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action',
  GENERIC: 'Une erreur est survenue',
};