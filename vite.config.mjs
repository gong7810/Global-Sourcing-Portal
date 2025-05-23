import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 세 번째 매개변수를 ''로 설정하면 `VITE_` 접두사에 관계없이 모든 환경 변수를 불러옴
  const env = loadEnv(mode, process.cwd());
  let outDir = 'dist';

  if (mode === 'development') {
    outDir = 'dist/dist_dev'; // 개발 모드
  } else if (mode === 'production') {
    outDir = 'dist/dist_prod'; // 프로덕션 모드
  }

  return {
    build: {
      outDir: outDir
    },
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
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL,
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true
        }
      }
    }
  };
});
