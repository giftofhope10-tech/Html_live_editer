import { App } from './app';
import './styles.css';

// Initialize the app first - this is critical for Android WebView
const app = new App();
app.init();

// Service worker registration - wrapped in try-catch for Android WebView compatibility
// Android WebView with file:// protocol doesn't support service workers
const initServiceWorker = async () => {
  try {
    // Only register service worker if not in file:// protocol (Android WebView)
    if (window.location.protocol !== 'file:') {
      const { registerSW } = await import('virtual:pwa-register');
      
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
    } else {
      console.log('Running in file:// mode - service worker disabled');
    }
  } catch (error) {
    console.log('Service worker registration skipped:', error);
  }
};

// Initialize service worker after app is ready
initServiceWorker();
