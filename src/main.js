import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// PrimeVue 컴포넌트 추가
import primevue from '@/plugins/commonprimevue';
import commonutils from '@/plugins/commonutils';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark'
    }
  },
  pt: {
    checkbox: {
      root: { class: 'custom-checkbox' },
      box: ({ props, state }) => ({
        class: 'custom-checkbox-box',
        style: {
          'background-color': props.modelValue ? '#8FA1FF' : 'transparent',
          'border-color': state.focused ? '#8FA1FF' : props.modelValue ? '#8FA1FF' : '#ced4da',
          transition: 'background-color 0.2s, border-color 0.2s'
        }
      }),
      input: { class: 'custom-checkbox-input' }
    }
  }
});

// 컴포넌트 전역 등록
app.use(primevue);
app.use(commonutils);
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
