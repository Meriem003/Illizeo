export const getTenantFromUrl = () => {
  const hostname = globalThis.location?.hostname || 'localhost';  
  const parts = hostname.split('.');

  if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0];
  }  
  return null;
};

export const isOnTenantDomain = () => {
  return getTenantFromUrl() !== null;
};

export const getApiBaseUrl = () => {
  const tenant = getTenantFromUrl();
  
  if (tenant) {
    return `http://${tenant}.localhost:8000/api`;
  }

  return 'http://localhost:8000/api';
};


export const getTenantDisplayName = () => {
  const tenant = getTenantFromUrl();
  
  if (!tenant) return 'Central';  
  return tenant.charAt(0).toUpperCase() + tenant.slice(1);
};


export const redirectToTenant = (tenantId) => {
  const port = globalThis.location?.port || '5173';
  globalThis.location.href = `http://${tenantId}.localhost:${port}`;
};


export const redirectToCentral = () => {
  const port = globalThis.location?.port || '5173';
  globalThis.location.href = `http://localhost:${port}`;
};

export default {
  getTenantFromUrl,
  isOnTenantDomain,
  getApiBaseUrl,
  getTenantDisplayName,
  redirectToTenant,
  redirectToCentral,
};
