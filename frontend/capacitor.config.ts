import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.checkpoint.healthintelligence',
  appName: 'CheckPoint!!',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
