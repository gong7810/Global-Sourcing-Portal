<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { useMessagePop } from '@/plugins/commonutils';
import OverlayPanel from 'primevue/overlaypanel';
import { storeToRefs } from 'pinia';
import { useApi } from '@/apis';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

const api = useApi();
const router = useRouter();
const authStore = useAuthStore();
const messagePop = useMessagePop();
const { userInfo } = storeToRefs(authStore);

const isMenuOpen = ref(false); // 메뉴 열림 상태
// 로그인 여부 체크
const loginFlag = computed(() => {
  return authStore.isLogin();
});

// 다국어 지원 관련
const selectedLanguage = ref('ko');
const languages = ref([
  { name: '한국어', code: 'ko' },
  { name: 'English', code: 'en' },
  { name: 'Tiếng Việt', code: 'vi' }
]);

// 기업용 알림 데이터
const companyNotifications = ref([
  {
    id: 1,
    type: 'interview_accepted',
    title: '면접 제안 수락',
    userName: '김지원',
    position: '시스템 엔지니어',
    message: '면접 제안을 수락했습니다.',
    createdAt: '2024-03-20',
    isRead: false
  },
  {
    id: 2,
    type: 'schedule_selected',
    title: '면접 일정 선택됨',
    userName: '이둘리',
    position: '시스템 엔지니어',
    message: '3월 25일 오후 2시 면접 일정이 선택되었습니다.',
    createdAt: '2024-03-19',
    isRead: false
  },
  {
    id: 3,
    type: 'interview_declined',
    title: '면접 제안 거절',
    userName: '박항공',
    position: '항공정비사',
    message: '면접 제안을 거절했습니다.',
    createdAt: '2024-03-18',
    isRead: true
  }
]);

// 구직자용 알림 데이터
const jobSeekerNotifications = ref([
  {
    id: 1,
    type: 'interview_offer',
    title: '새로운 면접 제안',
    companyName: '한국항공우주산업(주)',
    position: '항공기계설계',
    message: '항공기계설계 포지션에 대한 면접 제안이 도착했습니다.',
    createdAt: '2024-03-20',
    isRead: false
  },
  {
    id: 2,
    type: 'interview_schedule',
    title: '면접 일정 확정',
    companyName: 'LIG넥스원',
    position: '시스템 엔지니어',
    message: '3월 25일 오후 2시 화상면접이 확정되었습니다.',
    createdAt: '2024-03-19',
    isRead: false
  },
  {
    id: 3,
    type: 'result',
    title: '면접 결과',
    companyName: '대한항공',
    position: '항공정비사',
    message: '항공정비사 포지션 합격입니다.',
    createdAt: '2024-03-18',
    isRead: true
  }
]);

// 사용자 타입에 따라 알림 데이터 선택
const notifications = computed(() => {
  return userInfo.value?.isCompany ? companyNotifications.value : jobSeekerNotifications.value;
});

const unreadCount = computed(() => {
  return notifications.value.filter((notif) => !notif.isRead).length;
});

const overlayPanel = ref();

const toggleNotificationPanel = (event) => {
  overlayPanel.value.toggle(event);
};

const markAsRead = (notification) => {
  notification.isRead = true;
  overlayPanel.value.hide(); // 알림 패널 닫기

  // 알림 타입에 따라 페이지 이동
  switch (notification.type) {
    // 구직자용 알림 라우팅
    case 'interview_offer':
      router.push('/user/jobOffers'); // 면접제안 페이지로 이동
      break;
    case 'interview_schedule':
      router.push('/user/jobOffers'); // 면접제안 페이지로 이동
      break;
    case 'result':
      router.push('/user/jobSeekerInterviews'); // 면접결과 페이지로 이동
      break;

    // 기업용 알림 라우팅
    case 'interview_accepted':
      router.push('/business/InterviewOffers'); // 면접제안 관리 페이지로 이동
      break;
    case 'schedule_selected':
      router.push('/business/InterviewOffers'); // 면접제안 관리 페이지로 이동
      break;
    case 'interview_declined':
      router.push('/business/InterviewOffers'); // 면접제안 관리 페이지로 이동
      break;
  }
};

// 알림 아이콘 및 색상 매핑
const getNotificationIcon = (type) => {
  const iconMap = {
    // 구직자용 알림 아이콘
    interview_offer: 'pi-envelope',
    interview_schedule: 'pi-calendar',
    result: 'pi-check-circle',
    // 기업용 알림 아이콘
    interview_accepted: 'pi-check',
    schedule_selected: 'pi-calendar-plus',
    interview_declined: 'pi-times-circle'
  };
  return iconMap[type] || 'pi-bell';
};

const getNotificationColor = (type) => {
  const colorMap = {
    // 구직자용 알림 색상
    interview_offer: 'text-blue-500',
    interview_schedule: 'text-green-500',
    result: 'text-purple-500',
    // 기업용 알림 색상
    interview_accepted: 'text-green-500',
    schedule_selected: 'text-blue-500',
    interview_declined: 'text-red-500'
  };
  return colorMap[type] || 'text-gray-500';
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value; // 메뉴 토글
};

const getLogout = () => {
  messagePop.confirm({
    icon: 'info',
    message: '로그아웃 하시겠습니까?',
    onCloseYes: async () => {
      // 구조적인 이슈로 logout api는 Topbar에서 직접 호출
      await api.get('/auth/logout');

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

const changeLanguage = async () => {
  const translateElement = document.getElementById('google_translate_element');
  const selectElement = translateElement?.querySelector('.goog-te-combo');

  if (selectElement) {
    if (selectedLanguage.value === 'ko') {
      // 한국어로 변경 시 번역을 취소하고 원본으로 복원
      const googleFrame = document.querySelector('.VIpgJd-ZVi9od-ORHb-OEVmcd');
      if (googleFrame) {
        // 구글 번역 쿠키 제거
        document.cookie.split(';').forEach((cookie) => {
          const [name] = cookie.split('=');
          if (name.trim().startsWith('googtrans')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
          }
        });
        // 페이지 새로고침하여 원본 상태로 복원
        window.location.reload();
      }
    } else {
      // 다른 언어로 변경 시 기존 번역 로직 실행
      selectElement.value = selectedLanguage.value;
      selectElement.dispatchEvent(new Event('change'));
    }

    setTimeout(() => {
      checkTranslation();
    }, 200);
  }
};

// 번역 체크 로직
const checkTranslation = () => {
  const loginElement = document.getElementsByClassName('loginSpan')[0];
  if (loginElement) {
    const currentText = loginElement.textContent.trim();

    // 선택된 언어에 따라 예상되는 텍스트
    const expectedTranslations = {
      ko: '로그인',
      en: 'log in',
      vi: 'đăng nhập'
    };

    const isCorrectTranslation = currentText === expectedTranslations[selectedLanguage.value];

    if (!isCorrectTranslation) {
      changeLanguage();
    }
  }
};

const test = () => {
  console.log(selectedLanguage.value);
};

// formatDate 함수 추가
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>

<template>
  <div class="w-full bg-gradient-to-r from-[#8FA1FF] to-[#A5B4FF] shadow-sm">
    <div class="max-w-[1200px] mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <!-- 왼쪽 로고 -->
        <router-link to="/" class="flex items-center gap-2">
          <span class="font-bold text-2xl text-white tracking-tight notranslate">Global Sourcing Portal</span>
        </router-link>

        <!-- 오른쪽 메뉴들 -->
        <div class="flex items-center gap-4">
          <!-- 알림 버튼 (로그인 시에만 표시) -->
          <button
            v-if="loginFlag"
            class="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all relative"
            @click="toggleNotificationPanel"
          >
            <i class="pi pi-bell text-white"></i>
            <!-- 읽지 않은 알림이 있을 경우 표시되는 배지 -->
            <div
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full"
            >
              {{ unreadCount }}
            </div>
          </button>

          <!-- 알림 패널 -->
          <OverlayPanel ref="overlayPanel" :showCloseIcon="true" class="w-96">
            <div class="p-3">
              <h3 class="text-lg font-bold mb-4">알림</h3>
              <div v-if="notifications.length === 0" class="text-gray-500 text-center py-4">
                새로운 알림이 없습니다.
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  :class="{ 'bg-blue-50': !notification.isRead }"
                  @click="markAsRead(notification)"
                >
                  <div class="flex items-start gap-3">
                    <i
                      class="pi"
                      :class="[getNotificationIcon(notification.type), getNotificationColor(notification.type)]"
                    ></i>
                    <div class="flex-1">
                      <div class="font-semibold text-gray-900">{{ notification.title }}</div>
                      <!-- 구직자용 알림일 경우 -->
                      <div v-if="!userInfo?.isCompany" class="text-sm text-gray-600 mb-1">
                        {{ notification.companyName }} | {{ notification.position }}
                      </div>
                      <!-- 기업용 알림일 경우 -->
                      <div v-else class="text-sm text-gray-600 mb-1">
                        {{ notification.userName }} | {{ notification.position }}
                      </div>
                      <div class="text-sm text-gray-700">{{ notification.message }}</div>
                      <div class="text-xs text-gray-500 mt-1">{{ formatDate(notification.createdAt) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </OverlayPanel>

          <!-- 로그인 버튼 -->
          <button
            v-if="!loginFlag"
            class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            @click="router.push('/login')"
          >
            <i class="pi pi-user text-white"></i>
            <span class="text-sm text-white font-medium loginSpan">로그인</span>
          </button>
          <button
            v-if="loginFlag"
            class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            @click="getLogout"
          >
            <i class="pi pi-user text-white"></i>
            <span class="text-sm text-white font-medium">로그아웃</span>
          </button>

          <!-- 메뉴 버튼 -->
          <div class="relative">
            <div
              class="flex items-center cursor-pointer"
              @click="toggleMenu"
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
              v-show="isMenuOpen"
              class="absolute right-0 top-[3.8rem] w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 transition-all duration-200"
            >
              <!-- 메뉴 열림 상태에 따라 표시 -->
              <div class="py-2">
                <a
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  style="cursor: pointer"
                  @click="router.push('/user/resume')"
                >
                  <i class="pi pi-file-edit text-[#8FA1FF]"></i>
                  <span class="font-medium">이력서 관리</span>
                </a>
                <!-- <a class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50" style="cursor: pointer">
                  <i class="pi pi-chart-line text-[#8FA1FF]"></i>
                  <span class="font-medium">지원 현황</span>
                </a> -->
                <a
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  style="cursor: pointer"
                  @click="router.push('/faq')"
                >
                  <i class="pi pi-question-circle text-[#8FA1FF]"></i>
                  <span class="font-medium">FAQ</span>
                </a>
                <a
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  style="cursor: pointer"
                  @click="loginFlag ? router.push('/inquiry') : router.push('/login')"
                >
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

          <!-- 다국어 지원 -->
          <div class="language-selector notranslate">
            <Select
              v-model="selectedLanguage"
              class="custom-dropdown notranslate"
              :options="languages"
              optionLabel="name"
              optionValue="code"
              @change="changeLanguage"
              placeholder="언어 선택"
            >
              <template #option="{ option }">
                <div class="notranslate">{{ option.name }}</div>
              </template>
              <template #value="{ value }">
                <div class="notranslate">
                  {{ value ? languages.find((lang) => lang.code === value)?.name : '언어 선택' }}
                </div>
              </template>
            </Select>
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

.language-selector :deep(.custom-dropdown) {
  width: 120px;
  border: 1px solid #8884d8;
}

.language-selector :deep(.p-select) {
  border-color: #8884d8;
}

.language-selector :deep(.p-select:not(.p-disabled):hover) {
  border-color: #6c63ff;
}

.language-selector :deep(.p-select:not(.p-disabled).p-focus) {
  box-shadow: 0 0 0 1px #8884d8;
  border-color: #8884d8;
}

.language-selector :deep(.p-select-panel) {
  background: #ffffff;
  border: 1px solid #8884d8;
}

.language-selector :deep(.p-select-item:hover) {
  background: #f0f0ff;
  color: #6c63ff;
}

.language-selector :deep(.p-select-item.p-highlight) {
  background: #e8e8ff;
  color: #6c63ff;
}

/* 알림 패널 스타일 */
:deep(.p-overlaypanel) {
  border-radius: 12px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

:deep(.p-overlaypanel-content) {
  padding: 0;
}

:deep(.p-overlaypanel::before),
:deep(.p-overlaypanel::after) {
  border-bottom-color: white;
}
</style>
