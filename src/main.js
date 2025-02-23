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
import Button from 'primevue/button';
import Sidebar from 'primevue/sidebar';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import Tag from 'primevue/tag';

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
  }
});
app.use(ToastService);
app.use(ConfirmationService);

// 컴포넌트 전역 등록
app.component('Button', Button);
app.component('Sidebar', Sidebar);
app.component('Dropdown', Dropdown);
app.component('Card', Card);
app.component('Tag', Tag);

app.mount('#app');
