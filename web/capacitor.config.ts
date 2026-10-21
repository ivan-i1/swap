import type { CapacitorConfig } from '@capacitor/cli';

// The store listing identity. appId is permanent once uploaded to either store.
const config: CapacitorConfig = {
  appId: 'org.dinosaurriders.swap',
  appName: 'Swap',
  webDir: 'dist',
  backgroundColor: '#000000',
  android: {
    // Game assets are bundled; nothing is loaded from the network.
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'never',
    scrollEnabled: false,
  },
};

export default config;
