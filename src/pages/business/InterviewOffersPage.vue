<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';

const router = useRouter();

// 면접 제안 내역 데이터
const interviewOffers = ref([
  {
    id: 1,
    candidate: {
      name: '최예지',
      nationality: '베트남',
      career: '5년',
      birth: '1996.09.01',
      gender: '여성',
      phone: '010-1234-7496',
      email: 'yeji@naver.com',
      address: '홍스타워 505호',
      passportName: 'CHOI YEJI',
      visaInfo: {
        type: 'M1234****',
        country: '대한민국',
        expiryDate: '2030-01-01'
      },
      careerHistory: [
        {
          company: '(주)비티로봇',
          period: '2023.03 - 2024.03',
          position: '프론트엔드 개발자/개발팀',
          description: '웹 서비스 프론트엔드 개발'
        }
      ],
      education: {
        school: '한국대학교',
        degree: '대학교(4년)',
        major: '컴퓨터공학과',
        period: '2015.03 - 2019.02',
        description: '컴퓨터공학과 활동'
      },
      skills: ['JavaScript', 'React', 'Node.js']
    },
    position: 'Frontend Developer',
    jobDescription: '웹 서비스 프론트엔드 개발 및 유지보수',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
    status: 'pending',
    offerDate: '2024-03-20',
    responseDate: null
  },
  {
    id: 2,
    candidate: {
      name: '김철수',
      nationality: '중국',
      career: '3년',
      birth: '1997.05.15',
      gender: '남성',
      phone: '010-5678-1234',
      email: 'kim@example.com',
      address: '서울시 강남구',
      passportName: 'KIM CHULSOO',
      visaInfo: {
        type: 'M5678****',
        country: '중국',
        expiryDate: '2025-12-31'
      },
      careerHistory: [
        {
          company: '(주)테크솔루션',
          period: '2021.01 - 2024.03',
          position: '백엔드 개발자/서버팀',
          description: 'REST API 개발 및 서버 관리'
        }
      ],
      education: {
        school: '베이징대학교',
        degree: '대학교(4년)',
        major: '소프트웨어공학',
        period: '2016.09 - 2020.06',
        description: '소프트웨어공학 전공'
      },
      skills: ['Python', 'Django', 'AWS']
    },
    position: 'Backend Developer',
    jobDescription: 'REST API 개발 및 서버 관리',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
    status: 'accepted',
    offerDate: '2024-03-15',
    responseDate: '2024-03-16'
  },
  {
    id: 3,
    candidate: {
      name: '이영희',
      nationality: '일본',
      career: '4년',
      birth: '1995.12.20',
      gender: '여성',
      phone: '010-9012-3456',
      email: 'lee@example.com',
      address: '서울시 서초구',
      passportName: 'LEE YOUNGHEE',
      visaInfo: {
        type: 'M9012****',
        country: '일본',
        expiryDate: '2026-06-30'
      },
      careerHistory: [
        {
          company: '(주)소프트뱅크',
          period: '2020.04 - 2024.03',
          position: '백엔드 개발자/서버개발팀',
          description: '자바 기반 백엔드 서버 개발'
        }
      ],
      education: {
        school: '도쿄대학교',
        degree: '대학교(4년)',
        major: '정보공학',
        period: '2014.04 - 2018.03',
        description: '정보공학 전공'
      },
      skills: ['Java', 'Spring', 'MySQL']
    },
    position: 'Backend Developer',
    jobDescription: '자바 기반 백엔드 서버 개발',
    message: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
    status: 'declined',
    offerDate: '2024-03-14',
    responseDate: '2024-03-15',
    declineReason: '현재 회사에서 계속 근무하기로 결정했습니다.'
  }
]);

// 상태에 따른 스타일과 텍스트
const getStatusInfo = (status) => {
  switch (status) {
    case 'pending':
      return {
        text: '대기중',
        class: 'bg-yellow-50 text-yellow-600'
      };
    case 'accepted':
      return {
        text: '수락됨',
        class: 'bg-green-50 text-green-600'
      };
    case 'declined':
      return {
        text: '거절됨',
        class: 'bg-red-50 text-red-600'
      };
  }
};

const showDetailModal = ref(false);
const selectedOffer = ref(null);

const openDetailModal = (offer) => {
  selectedOffer.value = offer;
  showDetailModal.value = true;
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">면접 제안 내역</h1>
    </div>

    <!-- 제안 목록 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="offer in interviewOffers" :key="offer.id"
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-bold">{{ offer.candidate.name }}</h3>
            <span class="text-sm text-gray-600">{{ offer.candidate.nationality }}</span>
            <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
              경력 {{ offer.candidate.career }}
            </span>
            <span :class="`px-3 py-1 rounded-full text-sm ${getStatusInfo(offer.status).class}`">
              {{ getStatusInfo(offer.status).text }}
            </span>
          </div>
          <div class="text-sm text-gray-500">
            제안일: {{ offer.offerDate }}
          </div>
        </div>

        <div class="mb-4">
          <p class="text-gray-600 mb-2">{{ offer.candidate.education.school }} · {{ offer.candidate.education.major }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in offer.candidate.skills" :key="skill"
              class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">제안 포지션</h4>
            <p class="text-gray-600">{{ offer.position }}</p>
          </div>
          <div class="mb-3">
            <h4 class="font-medium text-gray-900 mb-1">상세 업무</h4>
            <p class="text-gray-600">{{ offer.jobDescription }}</p>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 mb-1">메시지</h4>
            <p class="text-gray-600">{{ offer.message }}</p>
          </div>
        </div>

        <div v-if="offer.status === 'accepted'" class="mt-4 border-t pt-4">
          <p class="text-green-600">
            <i class="pi pi-check-circle mr-2"></i>
            {{ offer.responseDate }}에 수락되었습니다
          </p>
        </div>

        <div v-if="offer.status === 'declined'" class="mt-4 border-t pt-4">
          <p class="text-red-600">
            <i class="pi pi-times-circle mr-2"></i>
            {{ offer.responseDate }}에 거절되었습니다
          </p>
          <p class="text-gray-600 mt-2">
            거절 사유: {{ offer.declineReason }}
          </p>
        </div>

        <div class="mt-4">
          <button
            class="text-[#8B8BF5] hover:text-[#7A7AE6] flex items-center gap-1"
            @click.stop="openDetailModal(offer)"
          >
            <span>상세 정보 보기</span>
            <i class="pi pi-arrow-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 상세 정보 모달 -->
    <Dialog 
      v-model:visible="showDetailModal"
      modal
      :style="{ width: '80vw', maxHeight: '90vh' }"
      :header="'제안 당시 이력서 정보'"
      :closable="true"
      :closeOnEscape="true"
    >
      <div v-if="selectedOffer" class="p-4">
        <!-- 기본 정보 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">기본 정보</h3>
          <div class="grid grid-cols-2 gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedOffer.candidate.name }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">생년월일</span>
              <span>{{ selectedOffer.candidate.birth }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">성별</span>
              <span>{{ selectedOffer.candidate.gender }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">휴대폰</span>
              <span>{{ selectedOffer.candidate.phone }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이메일</span>
              <span>{{ selectedOffer.candidate.email }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">주소</span>
              <span>{{ selectedOffer.candidate.address }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">경력</span>
              <span>{{ selectedOffer.candidate.career }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">학력</span>
              <span>{{ selectedOffer.candidate.education.degree }}</span>
            </div>
          </div>
        </div>

        <!-- 국가 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">국가</h3>
          <div>
            <span>{{ selectedOffer.candidate.visaInfo.country }}</span>
          </div>
        </div>

        <!-- 여권 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">여권</h3>
          <div class="grid gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedOffer.candidate.passportName }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">여권번호</span>
              <span>{{ selectedOffer.candidate.visaInfo.type }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">국적</span>
              <span>{{ selectedOffer.candidate.visaInfo.country }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">만료일</span>
              <span>{{ selectedOffer.candidate.visaInfo.expiryDate }}</span>
            </div>
          </div>
        </div>

        <!-- 경력 사항 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">경력 사항</h3>
          <div v-for="(career, index) in selectedOffer.candidate.careerHistory" 
            :key="index" 
            class="mb-4"
          >
            <div class="font-medium">{{ career.company }}</div>
            <div class="text-gray-600">{{ career.period }}</div>
            <div class="text-gray-600">{{ career.position }}</div>
            <div class="mt-2">{{ career.description }}</div>
          </div>
        </div>

        <!-- 학력 사항 -->
        <div class="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 class="text-lg font-medium mb-4">학력 사항</h3>
          <div>
            <div class="mb-2">{{ selectedOffer.candidate.education.school }}</div>
            <div class="text-gray-600">{{ selectedOffer.candidate.education.degree }}</div>
            <div class="text-gray-600">{{ selectedOffer.candidate.education.major }}</div>
            <div class="text-gray-600">{{ selectedOffer.candidate.education.period }}</div>
            <div>{{ selectedOffer.candidate.education.description }}</div>
          </div>
        </div>

        <!-- 자격증 사항 -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">자격증 사항</h3>
          <div class="text-center text-gray-500">
            등록된 자격증이 없습니다
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}
</style> 