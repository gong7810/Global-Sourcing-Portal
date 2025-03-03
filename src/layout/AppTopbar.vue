<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { useMessagePop } from '@/plugins/commonutils';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

const router = useRouter();
const authStore = useAuthStore();
const messagePop = useMessagePop();

const isMenuOpen = ref(false); // 메뉴 열림 상태
const loginFlag = ref(false); // 로그인 여부 체크

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  if (authStore.isLogin()) {
    loginFlag.value = true;
  } else {
    loginFlag.value = false;
  }
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value; // 메뉴 토글
};

const logout = () => {
  messagePop.confirm({
    icon: 'info',
    message: '로그아웃 하시겠습니까?',
    onCloseYes: () => {
      authStore.reset();

      window.location.reload();
    }
  });
  // messagePop.alert('test', 'info');
};

// 외부 클릭 시 메뉴 닫기
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isMenuOpen.value = false;
  }
};
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
          <button
            v-if="!loginFlag"
            class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            @click="router.push('/login')"
          >
            <i class="pi pi-user text-white"></i>
            <span class="text-sm text-white font-medium">로그인</span>
          </button>
          <button
            v-if="loginFlag"
            class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            @click="logout"
          >
            <i class="pi pi-user text-white"></i>
            <span class="text-sm text-white font-medium">로그아웃</span>
          </button>

          <!-- 메뉴 버튼 -->
          <div class="relative">
            <div
              class="flex items-center cursor-pointer"
              @click="toggleMenu"
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
            <div
              v-if="isMenuOpen"
              class="absolute right-0 top-[3.8rem] w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-100"
            >
              <!-- 메뉴 열림 상태에 따라 표시 -->
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
                  <i class="pi pi-question-circle text-[#8FA1FF]"></i>
                  <span class="font-medium">FAQ</span>
                </a>
                <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <i class="pi pi-comments text-[#8FA1FF]"></i>
                  <span class="font-medium">문의하기</span>
                </a>
                <!-- <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <i class="pi pi-bookmark text-[#8FA1FF]"></i>
                  <span class="font-medium">스크랩</span>
                </a> -->
                <!-- <a href="#" class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                  <i class="pi pi-cog text-[#8FA1FF]"></i>
                  <span class="font-medium">설정</span>
                </a> -->
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
