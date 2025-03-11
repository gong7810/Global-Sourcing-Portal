<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useMessagePop } from '@/plugins/commonutils';
import { useUserStore } from '@/store/user/userStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore();
const { jobOfferList } = storeToRefs(userStore);

const toast = useToast();
const messagePop = useMessagePop();

// 채용제안 목록 상태
const jobOffers = computed(() => {
  // 실제 API 연동 전까지는 mockJobOffers 사용
  return mockJobOffers;
  // return jobOfferList.value; // API 연동 후 사용할 코드
});

// 상세 보기 모달 상태
const showDetailModal = ref(false);
const selectedOffer = ref(null);

// 제안 상세 보기
const viewOfferDetail = (offer) => {
  selectedOffer.value = offer;
  if (!offer.isRead) {
    offer.isRead = true;
    // API 호출하여 읽음 상태 업데이트
  }
  showDetailModal.value = true;
};

// 제안 수락
const acceptOffer = async (offer) => {
  try {
    // 현재 이력서 정보 가져오기
    const currentResume = await getCurrentResume();  // API 호출 필요
    
    // 제안 수락 처리
    offer.status = 'accepted';
    offer.resumeSnapshot = currentResume;  // 현재 이력서 정보를 스냅샷으로 저장
    
    // API 호출하여 서버에 저장
    await updateJobOffer(offer);  // API 호출 필요

    toast.add({
      severity: 'success',
      summary: '제안 수락',
      detail: `${offer.companyName}의 채용제안을 수락했습니다.`,
      life: 3000
    });
    
    showDetailModal.value = false;
  } catch (error) {
    console.error('제안 수락 중 오류 발생:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '제안 수락 중 문제가 발생했습니다.',
      life: 3000
    });
  }
};

// 제안 거절
const rejectOffer = (offer) => {
  offer.status = 'rejected';
  toast.add({
    severity: 'info',
    summary: '제안 거절',
    detail: `${offer.companyName}의 채용제안을 거절했습니다.`,
    life: 3000
  });
  showDetailModal.value = false;
};

// 제안 상태에 따른 스타일 클래스
const getStatusClass = (status) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-100 text-green-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

// 제안 상태 텍스트
const getStatusText = (status) => {
  switch (status) {
    case 'accepted':
      return '수락됨';
    case 'rejected':
      return '거절됨';
    default:
      return '대기중';
  }
};

// 남은 기한 계산
const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// jobOffers 데이터 예시
const mockJobOffers = [
  {
    id: 1,
    companyName: '밥스(주)',
    business: '산업용 CFRP 물러, 디스플레이용 로봇핸드, 자동차 부품',
    address: '대전 유성구 국제과학로46(신동)',
    positions: [
      { title: '항공기계설계', career: '경력 3년 이상', count: 2 },
      { title: '제품개발', career: '신입/경력', count: 1 }
    ],
    message: '귀하의 경력과 기술이 저희 회사와 잘 맞을 것 같아 채용제안을 드립니다...',
    deadline: '2025-03-15',
    status: 'pending',
    isRead: false,
    resumeSnapshot: null
  },
  {
    id: 2,
    companyName: '한국항공우주산업(주)',
    business: '항공기 제조 및 개발',
    address: '경상남도 사천시 사남면 공단1로 78',
    positions: [
      { title: '항공전자 개발', career: '경력 3년 이상', count: 2 }
    ],
    message: '귀하의 경력이 저희 회사의 항공전자 개발 직무와 잘 맞을 것 같습니다...',
    deadline: '2025-03-25',
    status: 'accepted',
    isRead: true,
    resumeSnapshot: {
      basicInfo: {
        name: '홍길동',
        email: 'hong@email.com',
        phone: '010-1234-5678'
      },
      careers: [
        {
          company: '이전회사',
          position: '항공전자 개발',
          period: '2020-01 ~ 2023-12',
          description: '...',
          certificate: 'career_cert_1.pdf'
        }
      ],
      educations: [
        {
          school: '한국대학교',
          major: '항공우주공학과',
          degree: '학사',
          period: '2016-03 ~ 2020-02',
          status: '졸업',
          description: '...'
        }
      ],
      certifications: [
        {
          name: '항공정비사 자격증',
          date: '2021-06',
          organization: '한국산업인력공단',
          certificate: 'cert_1.pdf'
        },
        {
          name: '정보처리기사',
          date: '2020-12',
          organization: '한국산업인력공단',
          certificate: 'cert_2.pdf'
        }
      ]
    }
  },
  {
    id: 3,
    companyName: 'LIG넥스원',
    business: '방위산업 체계 개발',
    address: '서울특별시 강남구 언주로 45',
    positions: [
      { title: '시스템 엔지니어', career: '신입/경력', count: 3 }
    ],
    message: '귀하의 프로필을 보고 연락드립니다...',
    deadline: '2025-04-05',
    status: 'rejected',
    isRead: true
  }
];
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">채용제안</h1>
    </div>

    <!-- 제안 목록 -->
    <div class="space-y-4">
      <div
        v-for="offer in jobOffers"
        :key="offer.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer w-full"
        @click="viewOfferDetail(offer)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-grow">
              <!-- 회사명과 상태 -->
              <div class="flex items-center gap-2 mb-4">
                <h3 class="text-lg font-bold">{{ offer.companyName }}</h3>
                <span :class="getStatusClass(offer.status)" class="px-2 py-1 text-xs rounded">
                  {{ getStatusText(offer.status) }}
                </span>
                <span v-if="!offer.isRead" class="bg-red-500 text-white px-2 py-1 rounded text-xs">New</span>
              </div>

              <!-- 회사 사업 분야 -->
              <p class="text-gray-600 text-sm mb-4">{{ offer.business }}</p>

              <!-- 주소 -->
              <p class="text-gray-500 text-sm mb-4 flex items-center gap-2">
                <i class="pi pi-map-marker"></i>
                {{ offer.address }}
              </p>

              <!-- 채용 중인 포지션 -->
              <div>
                <h4 class="font-medium text-gray-900 mb-3">
                  <span class="flex items-center gap-2">
                    <i class="pi pi-users text-[#8B8BF5]"></i>
                    채용 중인 포지션
                  </span>
                </h4>
                <div class="grid grid-cols-2 gap-3">
                  <div v-for="position in offer.positions" :key="position.title"
                    class="bg-gray-50 p-3 rounded-lg">
                    <div class="font-medium text-gray-900">{{ position.title }}</div>
                    <div class="flex justify-between items-center mt-1">
                      <span class="text-sm text-gray-600">{{ position.career }}</span>
                      <span class="text-sm text-[#8B8BF5] font-medium">{{ position.count }}명</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 회신기한 -->
            <div class="ml-6 text-right">
              <span class="text-sm text-gray-500 flex items-center gap-2 justify-end">
                <i class="pi pi-calendar"></i>
                회신기한: D-{{ getDaysUntilDeadline(offer.deadline) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 상세 보기 모달 -->
    <Dialog
      v-model:visible="showDetailModal"
      :modal="true"
      :style="{ width: '60vw' }"
    >
      <!-- 헤더 커스텀 -->
      <template #header>
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold">{{ selectedOffer?.companyName }}</span>
          <span v-if="selectedOffer" :class="getStatusClass(selectedOffer.status)" class="px-2 py-1 text-xs rounded">
            {{ getStatusText(selectedOffer.status) }}
          </span>
        </div>
      </template>

      <div v-if="selectedOffer" class="p-6 space-y-6">
        <!-- 회사 기본 정보 -->
        <div class="flex gap-8 text-gray-600 mb-3">
          <span class="flex items-center gap-2">
            <i class="pi pi-briefcase"></i>
            {{ selectedOffer.business }}
          </span>
        </div>

        <!-- 채용 중인 포지션 -->
        <div class="mb-3">
          <h4 class="font-medium text-gray-900 mb-2">
            <span class="flex items-center gap-2">
              <i class="pi pi-users text-[#8B8BF5]"></i>
              채용 중인 포지션
            </span>
          </h4>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="position in selectedOffer.positions" :key="position.title"
              class="bg-gray-50 p-3 rounded-lg">
              <div class="font-medium text-gray-900">{{ position.title }}</div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-sm text-gray-600">{{ position.career }}</span>
                <span class="text-sm text-[#8B8BF5] font-medium">{{ position.count }}명</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 채용제안 메시지 -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-medium mb-2">채용제안 메시지</h4>
          <p class="text-gray-700 whitespace-pre-line">{{ selectedOffer.message }}</p>
        </div>

        <!-- 회신기한 -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center gap-2 text-blue-700">
            <i class="pi pi-info-circle"></i>
            <span>회신기한: {{ selectedOffer.deadline }} (D-{{ getDaysUntilDeadline(selectedOffer.deadline) }})</span>
          </div>
        </div>

        <!-- 지원 당시 이력서 정보 표시 (수락된 경우) -->
        <div v-if="selectedOffer?.status === 'accepted' && selectedOffer?.resumeSnapshot">
          <div class="border-t mt-6 pt-6">
            <h4 class="font-medium text-gray-900 mb-4">지원 당시 이력서 정보</h4>
            <!-- 스냅샷에서 이력서 정보 표시 -->
            <div class="space-y-4">
              <!-- 기본 정보 -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h5 class="font-medium mb-2">기본 정보</h5>
                <div class="text-sm text-gray-600">
                  <p>{{ selectedOffer.resumeSnapshot.basicInfo.name }}</p>
                  <p>{{ selectedOffer.resumeSnapshot.basicInfo.email }}</p>
                  <p>{{ selectedOffer.resumeSnapshot.basicInfo.phone }}</p>
                </div>
              </div>
              
              <!-- 경력 정보 -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h5 class="font-medium mb-2">경력 사항</h5>
                <div v-for="career in selectedOffer.resumeSnapshot.careers" 
                    :key="career.company" 
                    class="mb-3">
                  <p>{{ career.company }}</p>
                  <p>{{ career.position }}</p>
                  <p>{{ career.period }}</p>
                  <p>{{ career.description }}</p>
                  <p>{{ career.certificate }}</p>
                </div>
              </div>
              
              <!-- 교육 정보 -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h5 class="font-medium mb-2">교육 사항</h5>
                <div v-for="education in selectedOffer.resumeSnapshot.educations" 
                    :key="education.school" 
                    class="mb-3">
                  <p>{{ education.school }}</p>
                  <p>{{ education.major }}</p>
                  <p>{{ education.degree }}</p>
                  <p>{{ education.period }}</p>
                  <p>{{ education.status }}</p>
                  <p>{{ education.description }}</p>
                </div>
              </div>
              
              <!-- 자격증 정보 -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h5 class="font-medium mb-2">자격증 사항</h5>
                <div v-for="certification in selectedOffer.resumeSnapshot.certifications" 
                    :key="certification.name" 
                    class="mb-3">
                  <p>{{ certification.name }}</p>
                  <p>{{ certification.date }}</p>
                  <p>{{ certification.organization }}</p>
                  <p>{{ certification.certificate }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div v-if="selectedOffer.status === 'pending'" class="flex justify-end gap-4">
          <Button label="거절하기" class="p-button-danger" @click="rejectOffer(selectedOffer)" />
          <Button label="수락하기" class="p-button-success" @click="acceptOffer(selectedOffer)" />
        </div>
      </div>
    </Dialog>

    <!-- 토스트 메시지 -->
    <Toast />
  </div>
</template>

<style scoped>
.group {
  position: relative;
  overflow: hidden;
}

.group::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
  pointer-events: none;
  transition: all 0.2s ease;
}

.group:hover::after {
  box-shadow: inset 0 0 0 2px #8b8bf5;
}

/* 호버 시 살짝 들어올리는 효과 */
.group:hover {
  transform: translateY(-2px);
}

:deep(.p-dialog-header) {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-dialog-content) {
  padding: 0;
}

:deep(.p-button.p-button-success) {
  background: #10b981;
  border-color: #10b981;
}

:deep(.p-button.p-button-success:hover) {
  background: #059669;
  border-color: #059669;
}

:deep(.p-button.p-button-danger) {
  background: #ef4444;
  border-color: #ef4444;
}

:deep(.p-button.p-button-danger:hover) {
  background: #dc2626;
  border-color: #dc2626;
}
</style>
