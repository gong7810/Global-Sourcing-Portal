<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLayout } from '@/layout/composables/layout';
import { useMessagePop } from '@/plugins/commonutils';

import { logout } from '@/apis/auth/authApis';
import { delNotificationAll, getNotificationList, updateNotification } from '@/apis/common/commonApis';
import { useAuthStore } from '@/store/auth/authStore';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

const route = useRoute();
const router = useRouter();
const messagePop = useMessagePop();

const authStore = useAuthStore();
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

// 노티 리스트
const notifications = ref([]);

const unreadCount = computed(() => {
  return notifications.value?.filter((notif) => !notif.isRead).length;
});

const overlayPanel = ref();

const toggleNotificationPanel = (event) => {
  overlayPanel.value.toggle(event);
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  if (loginFlag.value) getNotiByUser();
});

watch(
  () => route?.matched,
  () => {
    // 대시보드 접근시에만 재호출
    if (['/', '/company/index'].includes(route?.matched[1].path) && authStore.isLogin()) {
      getNotiByUser();
    }
  },
  { deep: true }
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value; // 메뉴 토글
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// 회원 알림 체크
const getNotiByUser = async () => {
  const response = await getNotificationList();

  notifications.value = response;
};

// 로그아웃 API 호출
const getLogout = () => {
  messagePop.confirm({
    icon: 'info',
    message: '로그아웃 하시겠습니까?',
    onCloseYes: async () => {
      try {
        const response = await logout();
        if (response.status === 400) throw new Error('400 Error');

        authStore.reset();

        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  });
};

// 외부 클릭 시 메뉴 닫기
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isMenuOpen.value = false;
  }
};

// 패널 클릭
const markAsRead = async (noti) => {
  noti.isRead = true;

  try {
    await updateNotification(noti.id);

    overlayPanel.value.hide(); // 알림 패널 닫기

    // 알림 타입에 따라 페이지 이동
    switch (noti.typeCd) {
      // 구직자용
      case 'NOTI_1': // 면접제안
        router.push('/user/jobOffers');
        break;
      case 'NOTI_2': // 면접일정조율
        router.push('/user/jobOffers');
        break;
      case 'NOTI_3': // 면접결과
        router.push('/user/jobSeekerInterviews');
        break;

      // 기업용
      case 'NOTI_4': // 면접제안 답변
        router.push('/company/InterviewOffers');
        break;
      case 'NOTI_5': // 면접일정 확정
        router.push('/company/InterviewOffers');
        break;
    }
  } catch (error) {
    console.error(error);
  }
};

// 알림 아이콘 및 색상 매핑
const getNotificationIcon = (typeCd) => {
  const iconMap = {
    // 구직자용
    NOTI_1: 'pi-envelope',
    NOTI_2: 'pi-calendar',
    NOTI_3: 'pi-check-circle',
    // 기업용
    NOTI_4: 'pi-check',
    NOTI_5: 'pi-calendar-plus'
    // interview_declined: 'pi-times-circle'
  };
  return iconMap[typeCd] || 'pi-bell';
};

const getNotificationColor = (typeCd) => {
  const colorMap = {
    // 구직자용
    NOTI_1: 'text-blue-500',
    NOTI_2: 'text-green-500',
    NOTI_3: 'text-purple-500',
    // 기업용
    NOTI_4: 'text-green-500',
    NOTI_5: 'text-blue-500'
    // interview_declined: 'text-red-500'
  };
  return colorMap[typeCd] || 'text-gray-500';
};

// 노티 타입별 타이틀
const getNotiTypeTitle = (typeCd) => {
  switch (typeCd) {
    case 'NOTI_1':
      return '새로운 면접 제안';
    case 'NOTI_2':
      return '면접 일정 조율';
    case 'NOTI_3':
      return '면접 결과';
    case 'NOTI_4':
      return '면접 제안 답변';
    case 'NOTI_5':
      return '면접 일정 확정';
  }
};

// 노티 타입별 내용
const getNotiTypeContent = (noti) => {
  switch (noti?.typeCd) {
    case 'NOTI_1':
      return '해당 포지션 면접제안이 도착했습니다.';
    case 'NOTI_2':
      return '해당 포지션 면접일정이 도착했습니다.';
    case 'NOTI_3':
      return '해당 포지션 면접결과가 도착했습니다.';
    case 'NOTI_4':
      return '면접 제안에 대한 답변이 도착했습니다.';
    case 'NOTI_5':
      return '면접 일정이 확정되었습니다.';
  }
};

// 다국어 번역
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

      const dispatchEventAsync = (element, event) => {
        return new Promise((resolve) => {
          element.dispatchEvent(new Event(event));
          setTimeout(resolve, 0);
        });
      };

      await dispatchEventAsync(selectElement, 'change');
      checkTranslation();
    }
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

// formatDate 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 모든 알림 삭제 처리
const markAllAsRead = async () => {
  const readNotiList = [];

  notifications.value.map((noti) => {
    readNotiList.push(noti.id);
  });

  const body = {
    ids: readNotiList
  };
  try {
    await delNotificationAll(body);

    getNotiByUser();
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
  }
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
          <OverlayPanel ref="overlayPanel" class="w-96">
            <div class="p-3">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">알림</h3>
                <button
                  v-if="unreadCount > 0"
                  @click="markAllAsRead"
                  class="w-8 h-8 inline-flex items-center justify-center bg-[#8FA1FF] text-white rounded-full hover:bg-[#7C8EFF] transition-colors notranslate"
                  title="clear"
                >
                  <i class="pi pi-trash pr-[0.5px]"></i>
                </button>
              </div>
              <div v-if="notifications.length === 0" class="text-gray-500 text-center py-4">
                새로운 알림이 없습니다.
              </div>
              <div v-else class="space-y-3 max-h-[400px] overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification?.id"
                  class="p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  :class="{ 'bg-blue-50': !notification?.isRead }"
                  @click="markAsRead(notification)"
                >
                  <div class="flex items-start gap-3">
                    <i
                      class="pi"
                      :class="[getNotificationIcon(notification?.typeCd), getNotificationColor(notification?.typeCd)]"
                    ></i>
                    <div class="flex-1">
                      <!-- <div class="font-semibold text-gray-900">{{ getNotiTypeTitle(notification?.typeCd) }}</div> -->
                      <div class="font-semibold text-gray-900">{{ notification?.type?.name }}</div>
                      <!-- 구직자용 알림일 경우 -->
                      <div v-if="!userInfo?.isCompany" class="text-sm text-gray-600 mb-1">
                        {{ notification?.subData?.companyName }} | {{ notification?.subData?.position }}
                      </div>
                      <!-- 기업용 알림일 경우 -->
                      <div v-else class="text-sm text-gray-600 mb-1">
                        {{ notification?.subData?.userName }} | {{ notification?.subData?.position }}
                      </div>
                      <div class="text-sm text-gray-700" v-html="getNotiTypeContent(notification)"></div>
                      <div class="text-xs text-gray-500 mt-1">{{ formatDate(notification?.createdAt) }}</div>
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
            <div class="flex items-center cursor-pointer" @click="toggleMenu">
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
                  v-if="!userInfo?.isCompany"
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  style="cursor: pointer"
                  @click="
                    () => {
                      router.push('/user/resume');
                      closeMenu();
                    }
                  "
                >
                  <i class="pi pi-file-edit text-[#8FA1FF]"></i>
                  <span class="font-medium">이력서 관리</span>
                </a>
                <a
                  v-else
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  style="cursor: pointer"
                  @click="
                    () => {
                      router.push('/company/index');
                      closeMenu();
                    }
                  "
                >
                  <i class="pi pi-users text-[#8FA1FF]"></i>
                  <span class="font-medium">북마크 인재 관리</span>
                </a>
                <a
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  style="cursor: pointer"
                  @click="
                    () => {
                      router.push('/faq');
                      closeMenu();
                    }
                  "
                >
                  <i class="pi pi-question-circle text-[#8FA1FF]"></i>
                  <span class="font-medium">FAQ</span>
                </a>
                <a
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  style="cursor: pointer"
                  @click="
                    () => {
                      router.push('/inquiry');
                      closeMenu();
                    }
                  "
                >
                  <i class="pi pi-comments text-[#8FA1FF]"></i>
                  <span class="font-medium">문의하기</span>
                </a>
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
              checkmark
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
