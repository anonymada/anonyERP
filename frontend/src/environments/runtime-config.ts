interface RuntimeConfiguration {
  BACKEND_URL?: string;
  UPLOAD_URL?: string;
  DOWNLOAD_URL?: string;
}

declare global {
  interface Window {
    __env?: RuntimeConfiguration;
  }
}

const runtimeConfiguration = window.__env || {};

function normalizeBaseUrl(value: string | undefined, fallback: string): string {
  const url = value || fallback;
  return url.endsWith('/') ? url : `${url}/`;
}

export const BACKEND_URL = normalizeBaseUrl(
  runtimeConfiguration.BACKEND_URL,
  'https://192.168.2.254:8002/'
);
export const UPLOAD_URL = normalizeBaseUrl(
  runtimeConfiguration.UPLOAD_URL,
  'http://192.168.2.254:8003/'
);
export const DOWNLOAD_URL = normalizeBaseUrl(
  runtimeConfiguration.DOWNLOAD_URL,
  'http://192.168.2.254:8080/'
);