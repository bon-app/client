import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'life.bonapp.app',
  appName: 'Bonapp',
  webDir: 'www',
  plugins: {
    SplashScreen: { launchAutoHide: false, showSpinner: false },
    StatusBar: { style: 'DEFAULT' },
  },
};

export default config;
