interface RuntimeConfiguration {
  BACKEND_URL?: string;
  UPLOAD_URL?: string;
  DOWNLOAD_URL?: string;
  WEBDAV_URL?: string;
}

declare global {
  interface Window {
    __env?: RuntimeConfiguration;
  }
}

const runtimeConfiguration = window.__env || {};
const publicOrigin = 'https://192.168.2.254:8001';

function normalizeBaseUrl(value: string | undefined, fallback: string): string {
  const url = value || fallback;
  return url.endsWith('/') ? url : `${url}/`;
}

export const BACKEND_URL = normalizeBaseUrl(
  runtimeConfiguration.BACKEND_URL,
  publicOrigin
);
export const UPLOAD_URL = normalizeBaseUrl(
  runtimeConfiguration.UPLOAD_URL,
  publicOrigin
);
export const DOWNLOAD_URL = normalizeBaseUrl(
  runtimeConfiguration.DOWNLOAD_URL,
  `${publicOrigin}/image`
);
export const WEBDAV_URL = normalizeBaseUrl(
  runtimeConfiguration.WEBDAV_URL,
  `${publicOrigin}/webdav`
);