<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import TabMenu from 'primevue/tabmenu';

const router = useRouter();
const goBack = () => {
  router.back();
};

// 공고 상태 탭 수정 (아이콘 추가)
const activeTab = ref(0);  // activeTab을 숫자형으로 변경
const tabs = [
  { label: '전체', icon: 'pi pi-list' },
  { label: '진행중', icon: 'pi pi-check-circle' },
  { label: '마감', icon: 'pi pi-clock' }
];

// 샘플 공고 데이터
const jobPosts = ref([
  {
    id: 1,
    title: '프론트엔드 개발자 (React/Vue)',
    status: '진행중',
    deadline: '2024-04-20',
    applicants: 12,
    views: 234,
    jobType: '정규직',
    career: '경력 3년↑',
    location: '서울 강남구'
  },
  {
    id: 2,
    title: '백엔드 개발자 (Node.js/Python)',
    status: '마감',
    deadline: '2024-03-15',
    applicants: 8,
    views: 156,
    jobType: '정규직',
    career: '신입',
    location: '서울 서초구'
  }
]);

// 필터링된 공고 목록 추가
const filteredJobPosts = computed(() => {
  switch (activeTab.value) {
    case 1:
      return jobPosts.value.filter(post => post.status === '진행중');
    case 2:
      return jobPosts.value.filter(post => post.status === '마감');
    default:
      return jobPosts.value;
  }
});
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 영역 통일 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 mb-8">
        <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" @click="router.back()"></i>
        <h1 class="text-3xl font-bold">공고 관리</h1>
      </div>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="bg-white rounded-lg p-6">
      <!-- 탭 메뉴 -->
      <TabMenu :model="tabs" v-model:activeIndex="activeTab" class="mb-6" />

      <!-- 공고 목록 -->
      <div v-if="filteredJobPosts.length === 0" class="flex flex-col items-center justify-center py-16">
        <i class="pi pi-file-edit text-[#8FA1FF]" style="font-size: 4rem"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2 mt-4">등록된 공고가 없습니다</h3>
        <p class="text-gray-600 mb-6">새로운 채용공고를 등록해보세요!</p>
        <Button label="공고 등록하기" icon="pi pi-plus" class="p-button-outlined" @click="router.push('/business/post-job')" />
      </div>

      <div v-else class="space-y-4">
        <div v-for="post in filteredJobPosts" :key="post.id"
          class="border-b border-gray-200 last:border-0 py-6 hover:bg-gray-50 transition-all px-4 rounded-lg">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-lg mb-2">{{ post.title }}</h3>
              <div class="flex gap-4 text-sm text-gray-600 mt-2">
                <span class="flex items-center gap-1">
                  <i class="pi pi-briefcase"></i>
                  {{ post.jobType }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="pi pi-user"></i>
                  {{ post.career }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="pi pi-map-marker"></i>
                  {{ post.location }}
                </span>
              </div>
              <div class="flex gap-6 mt-4 text-sm text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-users"></i>
                  지원자 {{ post.applicants }}명
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-eye"></i>
                  조회수 {{ post.views }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  마감일 {{ post.deadline }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-4">
              <span :class="{
                'bg-[#8FA1FF] bg-opacity-10 text-[#8FA1FF]': post.status === '진행중',
                'bg-gray-100 text-gray-600': post.status === '마감'
              }" class="px-3 py-1 rounded-full text-sm font-medium">
                {{ post.status }}
              </span>
              <div class="flex gap-2">
                <Button label="수정" class="p-button-outlined" />
                <Button v-if="post.status === '진행중'" 
                  label="마감" 
                  class="p-button-outlined p-button-danger" />
              </div>
            </div>
          </div>
        </div>
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
  border-radius: 8px;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(143, 161, 255, 0.1);
  border-color: #8FA1FF;
  color: #8FA1FF;
}

:deep(.p-button.p-button-outlined.p-button-danger) {
  color: #ff4b4b;
  border-color: #ff4b4b;
}

:deep(.p-button.p-button-outlined.p-button-danger:hover) {
  background: rgba(255, 75, 75, 0.1);
}

:deep(.p-button.p-button-text) {
  color: #8FA1FF;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(143, 161, 255, 0.1);
}

/* 탭 메뉴 아이콘 스타일 추가 */
:deep(.p-menuitem-icon) {
  margin-right: 0.5rem;
}
</style>

