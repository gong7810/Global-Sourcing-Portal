<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const activeTab = ref(0);
const showNotificationSettings = ref(false);
const confirm = useConfirm();
const toast = useToast();

const tabs = [
  { label: '전체', icon: 'pi pi-list' },
  { label: '열람', icon: 'pi pi-eye' },
  { label: '미열람', icon: 'pi pi-eye-slash' },
  { label: '지원취소', icon: 'pi pi-times' }
];

// 알림 설정
const notificationSettings = ref({
  deadline: true, // 마감 3일 전 알림
  status: true // 지원 상태 변경 알림
});

// 샘플 지원내역 데이터 (마감일 정보 추가)
const supportDetailInfo = ref([
  {
    id: 1,
    companyName: '(주)비티포탈',
    position: '프론트엔드 개발자',
    location: '경남 진주시',
    applicationDate: '2024.03.15',
    deadline: '2024.04.15',
    status: '미열람',
    daysUntilDeadline: 15
  },
  {
    id: 2,
    companyName: '테크솔루션',
    position: '웹 개발자',
    location: '서울 강남구',
    applicationDate: '2024.03.10',
    deadline: '2024.03.30',
    status: '열람',
    daysUntilDeadline: 3
  },
  {
    id: 3,
    companyName: '스마트시스템즈',
    position: 'Vue.js 개발자',
    location: '부산 해운대구',
    applicationDate: '2024.03.05',
    deadline: '2024.03.25',
    status: '지원취소',
    daysUntilDeadline: -2
  }
]);

onMounted(() => {
  // TODO: 지원내역 조회 api
  // const body = {
  //   id: user.id
  // }
});

// 마감 임박한 지원 내역 필터링
const upcomingDeadlines = computed(() => {
  return supportDetailInfo.value.filter(
    (app) => app.daysUntilDeadline > 0 && app.daysUntilDeadline <= 3 && app.status !== '지원취소'
  );
});

const saveNotificationSettings = () => {
  // 알림 설정 저장 로직
  showNotificationSettings.value = false;
  // 실제 구현시에는 서버에 설정을 저장
};

const filteredSupports = computed(() => {
  switch (activeTab.value) {
    case 1:
      return supportDetailInfo.value.filter((app) => app.status === '열람');
    case 2:
      return supportDetailInfo.value.filter((app) => app.status === '미열람');
    case 3:
      return supportDetailInfo.value.filter((app) => app.status === '지원취소');
    default:
      return supportDetailInfo.value;
  }
});

const goToJobDetail = (applicationId) => {
  router.push({ name: 'JobDetail', params: { id: applicationId } }); // ToDo: 라우터 수정하기
};

// 지원 취소 함수
const cancelSupports = (app) => {
  if (app.status !== '미열람') {
    toast.add({
      severity: 'info',
      summary: '취소 불가',
      detail: '이미 기업이 확인한 지원내역은 취소할 수 없습니다.',
      life: 3000
    });
    return;
  }

  confirm.require({
    message: '지원을 취소하시겠습니까?',
    header: '지원 취소 확인',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '취소하기',
    rejectLabel: '돌아가기',
    accept: () => {
      // TODO: 지원 취소 api
      app.status = '지원취소';

      // const body = {
      //   id: user.id,
      //   supportDetailInfo: app
      // }

      toast.add({
        severity: 'success',
        summary: '지원 취소 완료',
        detail: '지원이 취소되었습니다.',
        life: 3000
      });
    }
  });
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 mb-8">
        <i
          class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
          @click="router.back()"
        ></i>
        <h1 class="text-3xl font-bold">지원 내역</h1>
        <!-- 알림 설정 버튼 -->
        <Button
          icon="pi pi-bell"
          class="p-button-rounded p-button-text notification-btn"
          @click="showNotificationSettings = true"
        />
      </div>
    </div>

    <!-- 마감 임박 알림 -->
    <div v-if="upcomingDeadlines.length > 0" class="mb-6">
      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
        <div class="flex items-center">
          <i class="pi pi-clock text-orange-500 mr-3 text-xl"></i>
          <div>
            <h3 class="font-medium text-orange-800">마감 임박한 지원 공고</h3>
            <ul class="mt-2 space-y-1">
              <li v-for="app in upcomingDeadlines" :key="app.id" class="text-orange-700">
                {{ app.companyName }} - {{ app.position }} (마감까지 {{ app.daysUntilDeadline }}일)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 알림 설정 다이얼로그 -->
    <Dialog v-model:visible="showNotificationSettings" header="알림 설정" :modal="true" :style="{ width: '400px' }">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span>마감 3일 전 알림</span>
          <ToggleButton v-model="notificationSettings.deadline" />
        </div>
        <div class="flex items-center justify-between">
          <span>지원 상태 변경 알림</span>
          <ToggleButton v-model="notificationSettings.status" />
        </div>
      </div>
      <template #footer>
        <Button label="저장" @click="saveNotificationSettings" class="p-button-primary" />
      </template>
    </Dialog>

    <!-- 탭 메뉴와 내용 -->
    <div class="bg-white rounded-lg p-6">
      <TabMenu :model="tabs" v-model:activeIndex="activeTab" class="mb-6" />

      <div v-if="filteredSupports.length === 0" class="flex flex-col items-center justify-center py-16">
        <i class="pi pi-file-edit text-[#8FA1FF]" style="font-size: 4rem"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2 mt-4">아직 지원내역이 없습니다</h3>
        <p class="text-gray-600 mb-6">관심있는 공고에 지원해보세요!</p>
        <Button label="채용공고 보러가기" icon="pi pi-search" class="p-button-outlined" @click="router.push('/')" />
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="support in filteredSupports"
          :key="support.id"
          class="border-b border-gray-200 last:border-0 py-6 px-4 rounded-lg"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <h4 class="font-medium text-lg">{{ support.position }}</h4>
                <span
                  :class="{
                    'bg-blue-100 text-blue-700': support.status === '미열람',
                    'bg-green-100 text-green-700': support.status === '열람',
                    'bg-gray-100 text-gray-700': support.status === '지원취소'
                  }"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ support.status }}
                </span>
              </div>
              <p class="text-[#8FA1FF] font-medium">{{ support.companyName }}</p>
              <div class="flex gap-4 text-sm text-gray-600 mt-2">
                <span class="flex items-center gap-1">
                  <i class="pi pi-map-marker"></i>
                  {{ support.location }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="pi pi-calendar"></i>
                  지원일: {{ support.applicationDate }}
                </span>
              </div>
            </div>
            <!-- 지원 취소 버튼 (미열람 상태일 때만 표시) -->
            <Button
              v-if="support.status === '미열람'"
              label="지원취소"
              class="p-button-text p-button-danger"
              @click="cancelSupports(support)"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Toast와 Confirm 컴포넌트 추가 -->
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.notification-btn {
  width: 48px;
  height: 48px;
}

.notification-btn :deep(.p-button-icon) {
  font-size: 1.5rem; /* 아이콘 크기 증가 */
  color: #8fa1ff; /* 브랜드 컬러로 변경 */
}

.notification-btn:hover :deep(.p-button-icon) {
  color: #7878f2; /* 호버 시 색상 변경 */
}

/* 알림 버튼에 배지 효과 추가 */
.notification-btn {
  position: relative;
}

.notification-btn::after {
  content: '';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background-color: #ff4b4b;
  border-radius: 50%;
  display: block;
}

/* 알림이 있을 때만 배지 표시 */
.notification-btn.has-notification::after {
  display: block;
}

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
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(143, 161, 255, 0.1);
  border-color: #8fa1ff;
  color: #8fa1ff;
}

:deep(.p-button.p-button-text) {
  color: #8fa1ff;
}

:deep(.p-button.p-button-text:hover) {
  background: rgba(143, 161, 255, 0.1);
}

/* 취소 버튼 스타일 */
:deep(.p-button.p-button-danger.p-button-text) {
  color: #ef4444;
}

:deep(.p-button.p-button-danger.p-button-text:hover) {
  background: rgba(239, 68, 68, 0.1);
}
</style>
