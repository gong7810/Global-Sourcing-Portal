<script setup>
import { useRouter } from 'vue-router';
import { logout } from '@/apis/auth/authApis';
import { useAuthStore } from '@/store/auth/authStore';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await logout();

  authStore.reset();

  router.push('/admin');
};
</script>

<template>
  <header class="admin-header">
    <div class="header-content">
      <div class="flex items-center gap-2">
        <i class="pi pi-shield text-[#8B8BF5] text-xl"></i>
        <h2 class="text-lg font-semibold text-gray-800">관리자</h2>
      </div>
      <button @click="handleLogout" class="logout-btn">
        <i class="pi pi-sign-out text-gray-600 mr-1"></i>
        <span class="text-gray-600">로그아웃</span>
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.admin-header {
  background-color: white;
  padding: 0.75rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      background-color: #f3f4f6;
    }
  }
}
</style>
