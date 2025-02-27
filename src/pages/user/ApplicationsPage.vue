<script setup>
import { ref, computed } from 'vue';
import AppTopbar from '@/layout/AppTopbar.vue';
import TabMenu from 'primevue/tabmenu';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeTab = ref(0);

const tabs = [
  { label: '전체', icon: 'pi pi-list' },
  { label: '열람', icon: 'pi pi-eye' },
  { label: '미열람', icon: 'pi pi-eye-slash' },
  { label: '지원취소', icon: 'pi pi-times' }
];

// 샘플 지원내역 데이터
const applications = ref([
  {
    id: 1,
    companyName: '(주)비티포탈',
    position: '프론트엔드 개발자',
    location: '경남 진주시',
    salary: '3,500만원',
    applicationDate: '2024.03.15',
    status: '미열람'
  },
  {
    id: 2,
    companyName: '테크솔루션',
    position: '웹 개발자',
    location: '서울 강남구',
    salary: '4,000만원',
    applicationDate: '2024.03.10',
    status: '열람'
  },
  {
    id: 3,
    companyName: '스마트시스템즈',
    position: 'Vue.js 개발자',
    location: '부산 해운대구',
    salary: '3,800만원',
    applicationDate: '2024.03.05',
    status: '지원취소'
  }
]);

const filteredApplications = computed(() => {
  switch (activeTab.value) {
    case 1:
      return applications.value.filter(app => app.status === '열람');
    case 2:
      return applications.value.filter(app => app.status === '미열람');
    case 3:
      return applications.value.filter(app => app.status === '지원취소');
    default:
      return applications.value;
  }
});

const goToJobDetail = (applicationId) => {
  router.push({ name: 'JobDetail', params: { id: applicationId } });
};
</script>

<template>
  <AppTopbar />
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <h1 class="text-2xl font-bold mb-8">지원 내역</h1>

    <!-- 탭 메뉴와 내용 -->
    <div class="bg-white rounded-lg p-6">
      <TabMenu :model="tabs" v-model:activeIndex="activeTab" class="mb-6" />

      <div v-if="filteredApplications.length === 0" class="flex flex-col items-center justify-center py-16">
        <i class="pi pi-file-edit text-[#8FA1FF]" style="font-size: 4rem"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2 mt-4">아직 지원내역이 없습니다</h3>
        <p class="text-gray-600 mb-6">관심있는 공고에 지원해보세요!</p>
        <Button label="채용공고 보러가기" icon="pi pi-search" class="p-button-outlined" @click="router.push({ name: 'Jobs' })" />
      </div>

      <div v-else class="space-y-4">
        <div v-for="application in filteredApplications" :key="application.id"
          class="border-b border-gray-200 last:border-0 pb-4 last:pb-0 hover:bg-gray-50 transition-all cursor-pointer p-4 rounded-lg"
          @click="goToJobDetail(application.id)">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <h4 class="font-medium text-lg">{{ application.position }}</h4>
                <span :class="{
                  'bg-blue-100 text-blue-700': application.status === '미열람',
                  'bg-green-100 text-green-700': application.status === '열람',
                  'bg-gray-100 text-gray-700': application.status === '지원취소'
                }" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ application.status }}
                </span>
              </div>
              <p class="text-[#8FA1FF] font-medium">{{ application.companyName }}</p>
              <div class="flex gap-4 text-sm text-gray-600 mt-2">
                <span class="flex items-center gap-1">
                  <i class="pi pi-map-marker"></i>
                  {{ application.location }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="pi pi-money-bill"></i>
                  {{ application.salary }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="pi pi-calendar"></i>
                  지원일: {{ application.applicationDate }}
                </span>
              </div>
            </div>
            <Button icon="pi pi-chevron-right" class="p-button-text p-button-rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 푸터 추가 -->
  <div class="mt-12 border-t border-gray-200 bg-gray-50">
    <div class="max-w-[1200px] mx-auto px-4 py-6">
      <div class="mb-6">
        <h2 class="text-lg font-bold mb-2">BTPOTAL</h2>
        <div class="text-gray-600 text-sm space-y-1">
          <p>대표: 김종진</p>
          <p>사업자 등록번호: 695-87-03015</p>
          <p>주소: 경상남도 진주시 동부로 169번길 12, B동 505호 (충무공동, 윙스타워)</p>
          <p>고객센터: 070-8211-3394</p>
          <p>이메일: jjkim@pbnt.kr</p>
          <p>직업정보제공사업:</p>
          <p class="pb-3 border-b border-gray-200">통신판매업:</p>
        </div>
      </div>

      <div class="flex gap-6 text-sm">
        <a href="#" class="text-blue-900 font-medium">개인정보처리방침</a>
        <a href="#" class="text-gray-600">이용약관</a>
        <a href="#" class="text-gray-600">이용자 준수사항</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-tabmenu .p-tabmenu-nav {
  border: none;
  background: transparent;
}

.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link {
  background: transparent;
  border: none;
  border-radius: 9999px;
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
}

.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link {
  background: #8FA1FF;
  color: white;
}

.p-tabmenu .p-tabmenu-nav .p-tabmenuitem:not(.p-highlight):not(.p-disabled):hover .p-menuitem-link {
  background: rgba(143, 161, 255, 0.1);
  border: none;
  color: #8FA1FF;
}

:deep(.p-button.p-button-outlined) {
  color: #8FA1FF;
  border-color: #8FA1FF;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(143, 161, 255, 0.1);
  border-color: #8FA1FF;
  color: #8FA1FF;
}

:deep(.p-button.p-button-text) {
  color: #8FA1FF;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(143, 161, 255, 0.1);
}

.mt-12.border-t.border-gray-200.bg-gray-50 {
  background-color: #f1f5f9;
}
</style> 