<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import TabMenu from 'primevue/tabmenu';

const router = useRouter();
const goBack = () => {
  router.back();
};

// 지원자 상태 탭
const activeTab = ref(0);
const tabs = [
  { label: '전체', icon: 'pi pi-list' },
  { label: '서류검토', icon: 'pi pi-file' },
  { label: '면접대기', icon: 'pi pi-user' },
  { label: '최종합격', icon: 'pi pi-check-circle' },
  { label: '불합격', icon: 'pi pi-times-circle' }
];

// 샘플 지원자 데이터
const applications = ref([
  {
    id: 1,
    name: '홍길동',
    status: '서류검토',
    position: '프론트엔드 개발자 (React/Vue)',
    applyDate: '2024-03-20',
    career: '경력 5년',
    education: '서울대학교 컴퓨터공학과',
    skills: ['React', 'Vue.js', 'TypeScript'],
    lastCompany: '(주)카카오',
    lastPosition: '프론트엔드 개발자'
  },
  {
    id: 2,
    name: '김철수',
    status: '면접대기',
    position: '프론트엔드 개발자 (React/Vue)',
    applyDate: '2024-03-19',
    career: '경력 3년',
    education: '연세대학교 소프트웨어학과',
    skills: ['JavaScript', 'Vue.js', 'Node.js'],
    lastCompany: '(주)네이버',
    lastPosition: '웹 개발자'
  }
]);

// 필터링된 지원자 목록
const filteredApplications = computed(() => {
  switch (activeTab.value) {
    case 1:
      return applications.value.filter(app => app.status === '서류검토');
    case 2:
      return applications.value.filter(app => app.status === '면접대기');
    case 3:
      return applications.value.filter(app => app.status === '최종합격');
    case 4:
      return applications.value.filter(app => app.status === '불합격');
    default:
      return applications.value;
  }
});
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 mb-8">
        <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" @click="router.back()"></i>
        <h1 class="text-3xl font-bold">지원자 관리</h1>
      </div>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="bg-white rounded-lg p-6">
      <!-- 탭 메뉴 -->
      <TabMenu :model="tabs" v-model:activeIndex="activeTab" class="mb-6" />

      <!-- 지원자 목록 -->
      <div v-if="filteredApplications.length === 0" class="flex flex-col items-center justify-center py-16">
        <i class="pi pi-users text-[#8FA1FF]" style="font-size: 4rem"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2 mt-4">지원자가 없습니다</h3>
        <p class="text-gray-600 mb-6">아직 해당 상태의 지원자가 없습니다</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="application in filteredApplications" :key="application.id"
          class="border-b border-gray-200 last:border-0 py-6 hover:bg-gray-50 transition-all px-4 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-4 mb-2">
                <h3 class="font-medium text-lg">{{ application.name }}</h3>
                <span :class="{
                  'bg-blue-100 text-blue-700': application.status === '서류검토',
                  'bg-yellow-100 text-yellow-700': application.status === '면접대기',
                  'bg-green-100 text-green-700': application.status === '최종합격',
                  'bg-red-100 text-red-700': application.status === '불합격'
                }" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ application.status }}
                </span>
              </div>
              <p class="text-[#8FA1FF] font-medium mb-2">{{ application.position }}</p>
              <div class="flex gap-4 text-sm text-gray-600">
                <span class="flex items-center gap-1">
                  <i class="pi pi-briefcase"></i>
                  {{ application.lastCompany }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="pi pi-user"></i>
                  {{ application.career }}
                </span>
              </div>
              <div class="flex gap-4 mt-2">
                <span v-for="skill in application.skills" :key="skill"
                  class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                  {{ skill }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-4">
              <span class="text-sm text-gray-500">지원일: {{ application.applyDate }}</span>
              <div class="flex gap-2">
                <Button label="이력서 보기" icon="pi pi-file" class="p-button-outlined" />
                <Button label="상태 변경" icon="pi pi-chevron-down" class="p-button-outlined" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* JobPostsPage.vue와 동일한 스타일 적용 */
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
  border-radius: 8px;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(143, 161, 255, 0.1);
  border-color: #8FA1FF;
  color: #8FA1FF;
}

:deep(.p-menuitem-icon) {
  margin-right: 0.5rem;
}
</style>