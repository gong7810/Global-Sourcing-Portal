<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import TabMenu from 'primevue/tabmenu';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import Menu from 'primevue/menu';

const router = useRouter();
// const goBack = () => {
//   router.back();
// };

// 지원자 상태 탭
const activeTab = ref(0);
const APPLICATION_STATUS = {
  REVIEW: '서류검토',
  INTERVIEW: '면접대기',
  ACCEPTED: '최종합격',
  REJECTED: '불합격'
};

const tabs = [
  { label: '전체', icon: 'pi pi-list', value: 'all' },
  { label: APPLICATION_STATUS.REVIEW, icon: 'pi pi-file', value: APPLICATION_STATUS.REVIEW },
  { label: APPLICATION_STATUS.INTERVIEW, icon: 'pi pi-user', value: APPLICATION_STATUS.INTERVIEW },
  { label: APPLICATION_STATUS.ACCEPTED, icon: 'pi pi-check-circle', value: APPLICATION_STATUS.ACCEPTED },
  { label: APPLICATION_STATUS.REJECTED, icon: 'pi pi-times-circle', value: APPLICATION_STATUS.REJECTED }
];

// 상태 변경 메뉴
const statusMenu = ref();
const selectedApplication = ref(null);
const statusMenuItems = [
  {
    label: APPLICATION_STATUS.REVIEW,
    icon: 'pi pi-file',
    class: 'text-blue-700',
    command: () => updateApplicationStatus(APPLICATION_STATUS.REVIEW)
  },
  {
    label: APPLICATION_STATUS.INTERVIEW,
    icon: 'pi pi-user',
    class: 'text-yellow-700',
    command: () => updateApplicationStatus(APPLICATION_STATUS.INTERVIEW)
  },
  {
    label: APPLICATION_STATUS.ACCEPTED,
    icon: 'pi pi-check-circle',
    class: 'text-green-700',
    command: () => updateApplicationStatus(APPLICATION_STATUS.ACCEPTED)
  },
  {
    label: APPLICATION_STATUS.REJECTED,
    icon: 'pi pi-times-circle',
    class: 'text-red-700',
    command: () => updateApplicationStatus(APPLICATION_STATUS.REJECTED)
  }
];

const toggleStatusMenu = (event, application) => {
  selectedApplication.value = application;
  statusMenu.value.toggle(event);
};

const updateApplicationStatus = (newStatus) => {
  if (selectedApplication.value) {
    const application = applications.value.find((app) => app.id === selectedApplication.value.id);
    if (application) {
      application.status = newStatus;
    }
  }
};

// 샘플 지원자 데이터 수정
const applications = ref([
  {
    id: 1,
    candidate: {
      id: 1,
      name: '홍길동',
      job: 'IT개발·데이터',
      career: '5년',
      education: '경상국립대학교(4년) 전자·전기공학과 졸업',
      age: '28',
      gender: '남성',
      nationality: '대한민국'
    },
    status: APPLICATION_STATUS.REVIEW,
    appliedDate: '2024-03-20'
  },
  {
    id: 2,
    candidate: {
      id: 2,
      name: '김철수',
      job: '경영·사무',
      career: '신입',
      education: '부산외국어대학교(4년) 경영학과 졸업',
      age: '26',
      gender: '남성',
      nationality: '대한민국'
    },
    status: APPLICATION_STATUS.INTERVIEW,
    appliedDate: '2024-03-19'
  },
  {
    id: 3,
    candidate: {
      // candidate 객체 추가
      id: 3,
      name: '이영희',
      job: '', // 직무 없음
      career: '신입',
      education: '호원대학교(4년) 전자·전기공학과 졸업',
      age: '25',
      gender: '여성',
      nationality: '대한민국'
    },
    status: APPLICATION_STATUS.REVIEW,
    appliedDate: '2024-03-18'
  }
]);

// 필터링된 지원자 목록
const filteredApplications = computed(() => {
  const selectedTab = tabs[activeTab.value];
  if (!selectedTab || selectedTab.value === 'all') {
    return applications.value;
  }
  return applications.value.filter((app) => app.status === selectedTab.value);
});

// 상태별 스타일 함수 수정
const getStatusClass = (status) => {
  switch (status) {
    case APPLICATION_STATUS.REVIEW:
      return 'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm';
    case APPLICATION_STATUS.INTERVIEW:
      return 'bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm';
    case APPLICATION_STATUS.ACCEPTED:
      return 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm';
    case APPLICATION_STATUS.REJECTED:
      return 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm';
    default:
      return 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm';
  }
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <i
          class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
          @click="router.back()"
        ></i>
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
        <div
          v-for="application in filteredApplications"
          :key="application.id"
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5] group"
        >
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-lg">{{ application.candidate.name }}</span>
                <span :class="getStatusClass(application.status)">
                  {{ application.status }}
                </span>
              </div>
              <div v-if="application.candidate.career === '신입' && !application.candidate.job" class="mb-2">
                <span class="text-gray-600">
                  <i class="pi pi-book mr-1"></i>
                  {{ application.candidate.education }}
                </span>
              </div>
              <div v-else class="flex items-center gap-2 mb-2">
                <span class="text-[#8B8BF5] font-medium text-lg">{{ application.candidate.job }}</span>
                <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {{ application.candidate.career }}
                </span>
                <span v-if="application.candidate.career === '신입'" class="text-gray-600">
                  <i class="pi pi-book mr-1"></i>
                  {{ application.candidate.education }}
                </span>
              </div>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-user"></i>
                  {{ application.candidate.age }}세 / {{ application.candidate.gender }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-globe"></i>
                  {{ application.candidate.nationality }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  지원일: {{ application.appliedDate }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <Button label="이력서 보기" icon="pi pi-file" class="p-button-outlined" />
              <Button
                label="상태 변경"
                icon="pi pi-chevron-down"
                class="p-button-outlined"
                @click="(event) => toggleStatusMenu(event, application)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 상태 변경 메뉴 -->
    <Menu ref="statusMenu" :model="statusMenuItems" :popup="true" />
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
  background: #8fa1ff;
  color: white;
}

.p-tabmenu .p-tabmenu-nav .p-tabmenuitem:not(.p-highlight):not(.p-disabled):hover .p-menuitem-link {
  background: rgba(143, 161, 255, 0.1);
  border: none;
  color: #8fa1ff;
}

:deep(.p-button.p-button-outlined) {
  color: #8fa1ff;
  border-color: #8fa1ff;
  border-radius: 8px;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(143, 161, 255, 0.1);
  border-color: #8fa1ff;
  color: #8fa1ff;
}

:deep(.p-menuitem-icon) {
  margin-right: 0.5rem;
}

:deep(.p-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.p-dialog-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog-content) {
  padding: 1.5rem;
}

:deep(.p-dropdown) {
  border-radius: 8px;
}

:deep(.p-menu) {
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 200px;
}

:deep(.p-menu .p-menuitem) {
  margin-bottom: 0.25rem;
}

:deep(.p-menu .p-menuitem:last-child) {
  margin-bottom: 0;
}

:deep(.p-menu .p-menuitem-link) {
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

:deep(.p-menu .p-menuitem-link:hover) {
  background-color: #f3f4f6;
}

:deep(.p-menu .p-menuitem-icon) {
  margin-right: 0.75rem;
}
</style>
