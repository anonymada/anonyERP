import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mndpt.app',
  appName: 'mndpt401',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;
