type BrowserEnvironment = {
  API_BASE_URL?: string;
};

const runtimeEnvironment = (
  globalThis as typeof globalThis & { __env?: BrowserEnvironment }
).__env;

if (typeof window !== 'undefined' && !runtimeEnvironment?.API_BASE_URL) {
  throw new Error('Frontend API_BASE_URL is not configured. Generate public/env.js before starting the app.');
}

export const environment = {
  apiBaseUrl: runtimeEnvironment?.API_BASE_URL || '',
};
