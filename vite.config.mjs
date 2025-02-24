import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    noDiscovery: true
  },
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  //   server: {
  //     port: 5173,
  //     proxy: {
  //       // 여권 확인 API
  //       '/passport': {
  //         target: 'https://api.codef.io/v1/kr/public/mj/hi-korea/passport-number-identification',
  //         changeOrigin: true
  //         // rewrite: (path) => path.replace(/^\/passport/, '')
  //       }
  //     }
  //   }
});
