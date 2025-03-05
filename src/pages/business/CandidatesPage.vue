<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import TabMenu from 'primevue/tabmenu';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import Menu from 'primevue/menu';

const router = useRouter();
const goBack = () => {
  router.back();
};

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
    const application = applications.value.find(app => app.id === selectedApplication.value.id);
    if (application) {
      application.status = newStatus;
    }
  }
};

// 채용 제안 모달
const showOffersModal = ref(false);
const selectedOfferStatus = ref('all');
const offerStatusOptions = [
  { label: '전체', value: 'all' },
  { label: '대기중', value: 'pending' },
  { label: '수락', value: 'accepted' },
  { label: '거절', value: 'rejected' }
];

// 제안 목록 데이터 (테스트용)
const offers = ref([
  {
    id: 1,
    candidate: {
      name: '홍길동',
      career: '5년',
      job: '기획·전략',
      nationality: '대한민국'
    },
    jobPosting: {
      title: '시니어 프론트엔드 개발자'
    },
    status: 'pending',
    sentDate: '2024-03-20',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다...',
    responseDate: null
  },
  {
    id: 2,
    candidate: {
      name: '김철수',
      career: '3년',
      job: 'IT개발·데이터',
      nationality: '대한민국'
    },
    jobPosting: {
      title: '백엔드 개발자'
    },
    status: 'accepted',
    sentDate: '2024-03-15',
    message: '당사의 백엔드 개발자 포지션에 관심이 있으실까요?',
    responseDate: '2024-03-16'
  }
]);

// 상태별 스타일
const getStatusStyle = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-blue-100 text-blue-700';
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// 상태 텍스트
const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return '대기중';
    case 'accepted':
      return '수락';
    case 'rejected':
      return '거절';
    default:
      return '알 수 없음';
  }
};

// 샘플 지원자 데이터
const applications = ref([
  {
    id: 1,
    name: '홍길동',
    status: '서류검토',
    job: '기획·전략',
    career: '5년',
    nationality: '대한민국',
    applyDate: '2024-03-20'
  },
  {
    id: 2,
    name: '김철수',
    status: '면접대기',
    job: 'IT개발·데이터',
    career: '3년',
    nationality: '대한민국',
    applyDate: '2024-03-19'
  }
]);

// 필터링된 지원자 목록
const filteredApplications = computed(() => {
  const selectedTab = tabs[activeTab.value];
  if (!selectedTab || selectedTab.value === 'all') {
    return applications.value;
  }
  return applications.value.filter(app => app.status === selectedTab.value);
});

// 필터링된 제안 목록
const filteredOffers = computed(() => {
  if (selectedOfferStatus.value === 'all') {
    return offers.value;
  }
  return offers.value.filter(offer => offer.status === selectedOfferStatus.value);
});
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" 
          @click="router.back()"></i>
        <h1 class="text-3xl font-bold">지원자 관리</h1>
      </div>
      <Button 
        label="채용 제안 내역" 
        icon="pi pi-list" 
        class="p-button-outlined"
        @click="showOffersModal = true" />
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
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">{{ application.name }}</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                  {{ application.career }}
                </span>
                <span :class="{
                  'bg-blue-100 text-blue-700': application.status === APPLICATION_STATUS.REVIEW,
                  'bg-yellow-100 text-yellow-700': application.status === APPLICATION_STATUS.INTERVIEW,
                  'bg-green-100 text-green-700': application.status === APPLICATION_STATUS.ACCEPTED,
                  'bg-red-100 text-red-700': application.status === APPLICATION_STATUS.REJECTED
                }" class="px-3 py-1 rounded-full text-sm">
                  {{ application.status }}
                </span>
              </div>
              <h3 class="text-xl font-bold mb-4">{{ application.job }}</h3>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-globe"></i>
                  {{ application.nationality }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  지원일: {{ application.applyDate }}
                </span>
              </div>
            </div>
            <div class="flex gap-2">
              <Button label="이력서 보기" icon="pi pi-file" class="p-button-outlined" />
              <Button label="상태 변경" icon="pi pi-chevron-down" class="p-button-outlined" 
                @click="(event) => toggleStatusMenu(event, application)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 채용 제안 모달 -->
    <Dialog 
      v-model:visible="showOffersModal"
      modal
      :style="{ width: '90vw', maxWidth: '1000px' }"
      header="채용 제안 내역">
      <div class="flex justify-end mb-6">
        <Select v-model="selectedOfferStatus" 
          :options="offerStatusOptions" 
          optionLabel="label"
          optionValue="value"
          placeholder="상태 필터"
          class="w-[150px]" />
      </div>

      <div class="space-y-4">
        <div v-for="offer in filteredOffers" :key="offer.id"
          class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-bold">{{ offer.candidate.name }}</span>
                <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                  {{ offer.candidate.career }}
                </span>
                <span :class="[getStatusStyle(offer.status), 'px-3 py-1 rounded-full text-sm']">
                  {{ getStatusText(offer.status) }}
                </span>
              </div>
              <h3 class="text-xl font-bold mb-4">{{ offer.candidate.job }}</h3>
              <div class="flex gap-8 text-gray-600">
                <span class="flex items-center gap-2">
                  <i class="pi pi-globe"></i>
                  {{ offer.candidate.nationality }}
                </span>
                <span class="flex items-center gap-2">
                  <i class="pi pi-calendar"></i>
                  제안일: {{ offer.sentDate }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="border-t pt-4 mt-4">
            <h4 class="font-medium mb-2">제안한 포지션: {{ offer.jobPosting.title }}</h4>
            <p class="text-gray-600 line-clamp-2">{{ offer.message }}</p>
          </div>
        </div>
      </div>
    </Dialog>

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
  background-color: #F3F4F6;
}

:deep(.p-menu .p-menuitem-icon) {
  margin-right: 0.75rem;
}
</style>