<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
  <div class="w-full bg-gradient-to-r from-[#8FA1FF] to-[#A5B4FF] shadow-sm">
    <div class="max-w-[1200px] mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <!-- 왼쪽 로고 -->
        <router-link to="/" class="flex items-center gap-2">
          <span class="font-bold text-2xl text-white tracking-tight">BT</span>
          <span class="font-semibold text-xl text-white/90">POTAL</span>
        </router-link>

        <!-- 오른쪽 메뉴들 -->
        <div class="flex items-center gap-4">
          <!-- 로그인 버튼 -->
          <router-link to="/login">
            <button
              class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <i class="pi pi-user text-white"></i>
              <span class="text-sm text-white font-medium">로그인</span>
            </button>
          </router-link>

          <!-- 메뉴 버튼 -->
          <div class="relative">
            <div
              class="flex items-center cursor-pointer"
              v-styleclass="{
                selector: '@next',
                enterFromClass: 'hidden opacity-0 translate-y-2',
                enterActiveClass: 'transition-all duration-200',
                enterToClass: 'opacity-100 translate-y-0',
                leaveToClass: 'hidden',
                hideOnOutsideClick: true
              }"
            >
              <button
                class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <i class="pi pi-bars text-white"></i>
                <span class="text-sm text-white font-medium">메뉴</span>
              </button>
            </div>

            <!-- 메뉴 드롭다운 -->
            <div class="hidden absolute right-0 top-[3.8rem] w-56 bg-white rounded-xl shadow-lg border border-gray-100">
              <div class="py-2">
                <a
                  @click="router.push('/uikit/formlayout')"
                  href="#"
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                >
                  <i class="pi pi-file-edit text-[#8FA1FF]"></i>
                  <span class="font-medium">이력서 관리</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <i class="pi pi-chart-line text-[#8FA1FF]"></i>
                  <span class="font-medium">지원 현황</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <i class="pi pi-bookmark text-[#8FA1FF]"></i>
                  <span class="font-medium">스크랩</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <i class="pi pi-cog text-[#8FA1FF]"></i>
                  <span class="font-medium">설정</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 추가적인 애니메이션 효과 */
.animate-scalein {
  animation: scalein 0.15s ease-in-out;
}

@keyframes scalein {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
