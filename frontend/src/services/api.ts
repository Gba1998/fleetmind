// FleetMind API Service Client (Dynamique Multi-Appareils : Desktop, Smartphone, LAN & Cloud)
const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') return 'http://localhost:5000/api';
  // Si en mode développement local sur port 5173
  if (window.location.port === '5173') {
    return `http://${window.location.hostname}:5000/api`;
  }
  // En production / Docker / Nginx / Cloud (port 80/443 ou nom de domaine)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

// --- AUTHENTICATION & SESSION PERSISTENCE ---
export function getSavedToken(): string | null {
  return localStorage.getItem('fleetmind_token');
}

export function getSavedUser(): any | null {
  try {
    const str = localStorage.getItem('fleetmind_user');
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

export function getSavedTenant(): any | null {
  try {
    const str = localStorage.getItem('fleetmind_tenant');
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: any, tenant: any) {
  localStorage.setItem('fleetmind_token', token);
  localStorage.setItem('fleetmind_user', JSON.stringify(user));
  if (tenant) {
    localStorage.setItem('fleetmind_tenant', JSON.stringify(tenant));
  }
}

export function clearSession() {
  localStorage.removeItem('fleetmind_token');
  localStorage.removeItem('fleetmind_user');
  localStorage.removeItem('fleetmind_tenant');
}

export async function apiLogin(email: string, password?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Identifiant ou mot de passe incorrect');
  }
  const data = await res.json();
  if (data.token) {
    saveSession(data.token, data.user, data.tenant);
  }
  return data;
}

export async function apiGetMe() {
  const token = getSavedToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      clearSession();
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

// --- FILE UPLOAD (Real photos from user device) ---
export async function apiUploadPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('photo', file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Échec du téléversement de la photo');
  }
  const data = await res.json();
  const fileHost = typeof window !== 'undefined' && window.location.port === '5173'
    ? `http://${window.location.hostname}:5000`
    : '';
  return `${fileHost}${data.url}`;
}

// --- EQUIPMENTS ---
export async function apiGetEquipments() {
  const res = await fetch(`${API_BASE_URL}/equipments`);
  if (!res.ok) throw new Error('Failed to fetch equipments');
  return res.json();
}

export async function apiCreateEquipment(eq: any) {
  const res = await fetch(`${API_BASE_URL}/equipments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eq)
  });
  if (!res.ok) throw new Error('Failed to create equipment');
  return res.json();
}

export async function apiUpdateEquipmentStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/equipments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update equipment status');
  return res.json();
}

export async function apiDeleteEquipment(id: string) {
  const res = await fetch(`${API_BASE_URL}/equipments/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete equipment');
  return res.json();
}

// --- MAINTENANCE ---
export async function apiGetMaintenanceOrders() {
  const res = await fetch(`${API_BASE_URL}/maintenance`);
  if (!res.ok) throw new Error('Failed to fetch maintenance orders');
  return res.json();
}

export async function apiCreateMaintenanceOrder(order: any) {
  const res = await fetch(`${API_BASE_URL}/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to create maintenance order');
  return res.json();
}

export async function apiUpdateMaintenanceOrderStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/maintenance/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update maintenance order status');
  return res.json();
}

// --- FUEL ---
export async function apiGetFuelLogs() {
  const res = await fetch(`${API_BASE_URL}/fuel`);
  if (!res.ok) throw new Error('Failed to fetch fuel logs');
  return res.json();
}

export async function apiCreateFuelLog(fuel: any) {
  const res = await fetch(`${API_BASE_URL}/fuel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fuel)
  });
  if (!res.ok) throw new Error('Failed to create fuel log');
  return res.json();
}

// --- ASSIGNMENTS ---
export async function apiGetAssignments() {
  const res = await fetch(`${API_BASE_URL}/assignments`);
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
}

export async function apiCreateAssignment(asg: any) {
  const res = await fetch(`${API_BASE_URL}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asg)
  });
  if (!res.ok) throw new Error('Failed to create assignment');
  return res.json();
}

export async function apiDeleteAssignment(id: string) {
  const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete assignment');
  return res.json();
}

// --- RENTALS ---
export async function apiGetRentals() {
  const res = await fetch(`${API_BASE_URL}/rentals`);
  if (!res.ok) throw new Error('Failed to fetch rentals');
  return res.json();
}

export async function apiCreateRental(rental: any) {
  const res = await fetch(`${API_BASE_URL}/rentals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rental)
  });
  if (!res.ok) throw new Error('Failed to create rental');
  return res.json();
}

export async function apiCloseRental(id: string) {
  const res = await fetch(`${API_BASE_URL}/rentals/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'TERMINE' })
  });
  if (!res.ok) throw new Error('Failed to close rental');
  return res.json();
}

// --- DOCUMENTS ---
export async function apiGetDocuments() {
  const res = await fetch(`${API_BASE_URL}/documents`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function apiCreateDocument(doc: any) {
  const res = await fetch(`${API_BASE_URL}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc)
  });
  if (!res.ok) throw new Error('Failed to create document');
  return res.json();
}

export async function apiRenewDocument(id: string) {
  const res = await fetch(`${API_BASE_URL}/documents/${id}/renew`, {
    method: 'PATCH'
  });
  if (!res.ok) throw new Error('Failed to renew document');
  return res.json();
}

// --- USERS ---
export async function apiGetUsers() {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function apiCreateUser(user: any) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function apiToggleUser(id: string) {
  const res = await fetch(`${API_BASE_URL}/users/${id}/toggle-status`, {
    method: 'PATCH'
  });
  if (!res.ok) throw new Error('Failed to toggle user status');
  return res.json();
}

// --- GPS TRACKS ---
export async function apiGetGpsTracks() {
  const res = await fetch(`${API_BASE_URL}/gps`);
  if (!res.ok) throw new Error('Failed to fetch GPS tracks');
  return res.json();
}

export async function apiPingGps() {
  const res = await fetch(`${API_BASE_URL}/gps/ping`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to ping GPS');
  return res.json();
}

// --- ANALYTICS / CHAT ---
export async function apiSendChatMessage(text: string) {
  const res = await fetch(`${API_BASE_URL}/analytics/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to send chat message');
  return res.json();
}
