const PREFIX = 'hireflow:';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const storage = {
  get<T>(key: string, fallback: T): T {
    return read<T>(key, fallback);
  },
  set<T>(key: string, value: T): void {
    write<T>(key, value);
  },
};
