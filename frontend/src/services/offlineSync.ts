// FleetMind Offline-First & Resilient Sync Engine
// Manages local caching and deferred synchronization for deep mining pits and remote sites

export interface QueuedAction {
  id: string;
  type: 'FUEL_LOG' | 'MAINTENANCE_ORDER' | 'ASSIGNMENT' | 'EQUIPMENT_STATUS';
  payload: any;
  timestamp: string;
  attempts: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'SYNCED';
  error?: string;
}

const STORAGE_KEY_QUEUE = 'fleetmind_offline_queue';
const STORAGE_KEY_SIMULATED_OFFLINE = 'fleetmind_simulated_offline';
const STORAGE_KEY_LAST_SYNC = 'fleetmind_last_sync_time';

type StatusListener = (status: {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
}) => void;

const listeners: Set<StatusListener> = new Set();

// Load initial queue
function loadQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Persist queue
function saveQueue(queue: QueuedAction[]) {
  try {
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to save offline queue', e);
  }
}

// Check simulated offline mode
export function isSimulatedOffline(): boolean {
  return localStorage.getItem(STORAGE_KEY_SIMULATED_OFFLINE) === 'true';
}

export function setSimulatedOffline(val: boolean) {
  localStorage.setItem(STORAGE_KEY_SIMULATED_OFFLINE, val ? 'true' : 'false');
  notifyListeners();
  if (!val) {
    // When switching back online, trigger auto-sync
    triggerSync();
  }
}

// Check effective online status
export function getEffectiveOnlineStatus(): boolean {
  if (isSimulatedOffline()) return false;
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function getPendingQueueCount(): number {
  return loadQueue().filter((q) => q.status === 'PENDING' || q.status === 'FAILED').length;
}

export function getLastSyncTime(): string | null {
  return localStorage.getItem(STORAGE_KEY_LAST_SYNC);
}

// Notify all subscribers
function notifyListeners() {
  const isOnline = getEffectiveOnlineStatus();
  const sim = isSimulatedOffline();
  const count = getPendingQueueCount();
  const lastSync = getLastSyncTime();

  listeners.forEach((listener) => {
    try {
      listener({
        isOnline,
        isSimulatedOffline: sim,
        pendingCount: count,
        lastSyncTime: lastSync,
      });
    } catch (e) {
      console.warn('Listener error', e);
    }
  });
}

// Subscribe to status updates
export function subscribeOfflineStatus(listener: StatusListener): () => void {
  listeners.add(listener);
  // Send immediate state
  listener({
    isOnline: getEffectiveOnlineStatus(),
    isSimulatedOffline: isSimulatedOffline(),
    pendingCount: getPendingQueueCount(),
    lastSyncTime: getLastSyncTime(),
  });
  return () => {
    listeners.delete(listener);
  };
}

// Enqueue action when offline
export function enqueueOfflineAction(
  type: QueuedAction['type'],
  payload: any
): QueuedAction {
  const queue = loadQueue();
  const action: QueuedAction = {
    id: `OFFLINE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    attempts: 0,
    status: 'PENDING',
  };

  queue.push(action);
  saveQueue(queue);
  notifyListeners();
  return action;
}

// Execute sync with backend
export async function triggerSync(
  onSuccessCallback?: (syncedCount: number) => void
): Promise<{ success: boolean; syncedCount: number; errors: number }> {
  if (!getEffectiveOnlineStatus()) {
    return { success: false, syncedCount: 0, errors: 0 };
  }

  const queue = loadQueue();
  const pending = queue.filter((q) => q.status === 'PENDING' || q.status === 'FAILED');

  if (pending.length === 0) {
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toLocaleTimeString('fr-FR'));
    notifyListeners();
    return { success: true, syncedCount: 0, errors: 0 };
  }

  let syncedCount = 0;
  let errors = 0;

  for (const item of pending) {
    item.status = 'SYNCING';
    item.attempts += 1;

    try {
      // Simulate/call appropriate endpoint
      const API_BASE_URL = 'http://localhost:5000/api';
      let endpoint = '';
      let method = 'POST';

      if (item.type === 'FUEL_LOG') endpoint = `${API_BASE_URL}/fuels`;
      else if (item.type === 'MAINTENANCE_ORDER') endpoint = `${API_BASE_URL}/maintenance`;
      else if (item.type === 'ASSIGNMENT') endpoint = `${API_BASE_URL}/assignments`;

      if (endpoint) {
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
          signal: AbortSignal.timeout(4000),
        });

        if (res.ok) {
          item.status = 'SYNCED';
          syncedCount++;
        } else {
          item.status = 'FAILED';
          item.error = `HTTP ${res.status}`;
          errors++;
        }
      } else {
        // Fallback simulation
        item.status = 'SYNCED';
        syncedCount++;
      }
    } catch (err: any) {
      item.status = 'FAILED';
      item.error = err.message || 'Réseau inaccessible';
      errors++;
    }
  }

  // Remove fully SYNCED items from queue
  const remaining = queue.filter((q) => q.status !== 'SYNCED');
  saveQueue(remaining);

  const now = new Date().toLocaleTimeString('fr-FR');
  localStorage.setItem(STORAGE_KEY_LAST_SYNC, now);
  notifyListeners();

  if (syncedCount > 0 && onSuccessCallback) {
    onSuccessCallback(syncedCount);
  }

  return { success: errors === 0, syncedCount, errors };
}

// Window network event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    notifyListeners();
    triggerSync();
  });

  window.addEventListener('offline', () => {
    notifyListeners();
  });
}
