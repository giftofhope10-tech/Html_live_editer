import { App } from './app';
import { registerSW } from 'virtual:pwa-register';
import './styles.css';

const app = new App();
app.init();

let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | undefined;

const showUpdateBanner = () => {
  const updateBanner = document.createElement('div');
  updateBanner.className = 'update-banner';
  updateBanner.innerHTML = `
    <div class="update-content">
      <span>New version available!</span>
      <button id="updateNowBtn">Update Now</button>
      <button id="updateLaterBtn">Later</button>
    </div>
  `;
  document.body.appendChild(updateBanner);
  
  document.getElementById('updateNowBtn')?.addEventListener('click', async () => {
    updateBanner.remove();
    if (updateServiceWorker) {
      await updateServiceWorker(true);
    }
  });
  
  document.getElementById('updateLaterBtn')?.addEventListener('click', () => {
    updateBanner.remove();
  });
};

updateServiceWorker = registerSW({
  immediate: true,
  onNeedRefresh() {
    showUpdateBanner();
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    }
  }
});
