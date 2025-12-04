import { App } from './app';
import { registerSW } from 'virtual:pwa-register';
import './styles.css';

const app = new App();
app.init();

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version available. Update now?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  }
});
