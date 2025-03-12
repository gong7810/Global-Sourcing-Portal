<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

// 검색 필터 상태 관리
const searchKeyword = ref('');
const selectedCareer = ref(null);
const selectedNationalities = ref([]);
const selectedSkills = ref([]);

const router = useRouter();

// 필터 옵션
const careerOptions = [
  { label: '신입', value: 'entry' },
  { label: '1~3년', value: 'junior' },
  { label: '4~7년', value: 'middle' },
  { label: '8년 이상', value: 'senior' }
];

const nationalityOptions = [
  { label: '베트남', value: 'VN' },
  { label: '중국', value: 'CN' },
  { label: '일본', value: 'JP' },
  { label: '기타', value: 'OTHER' }
];

const skillOptions = [
  { label: 'JavaScript', value: 'js' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'React', value: 'react' },
  { label: 'Vue.js', value: 'vue' }
];

// 임시 인재 데이터
const talents = ref([
  {
    id: 1,
    name: '홍길동',
    nationality: '베트남',
    career: '5년',
    skills: ['JavaScript', 'React', 'Node.js'],
    education: '하노이공과대학교',
    major: '컴퓨터공학',
    isBookmarked: false
  },
  // 더미 데이터 추가 가능
]);

const showResumeModal = ref(false);
const selectedCandidate = ref(null);
const isBookmarked = ref(false);
const isAccepted = ref(false);

const openResumeModal = (candidate) => {
  selectedCandidate.value = candidate;
  showResumeModal.value = true;
};

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
};

const openInterviewOffer = (talent) => {
  router.push(`/business/interview-offer/create/${talent.id}`);
};

const searchTalents = () => {
  // 검색 로직 구현
  console.log('Searching with filters:', {
    keyword: searchKeyword.value,
    career: selectedCareer.value,
    nationalities: selectedNationalities.value,
    skills: selectedSkills.value
  });
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
        <h1 class="text-3xl font-bold">인재 검색</h1>
      </div>
    </div>

    <!-- 검색 필터 섹션 -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 경력 필터 -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">경력</label>
          <Dropdown
            v-model="selectedCareer"
            :options="careerOptions"
            optionLabel="label"
            placeholder="경력 선택"
            class="w-full"
          />
        </div>

        <!-- 국적 필터 -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">국적</label>
          <MultiSelect
            v-model="selectedNationalities"
            :options="nationalityOptions"
            optionLabel="label"
            placeholder="국적 선택"
            class="w-full"
          />
        </div>

        <!-- 키워드 검색 -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">키워드</label>
          <InputText 
            v-model="searchKeyword"
            placeholder="이름, 학교, 전공 등"
            class="w-full"
          />
        </div>
      </div>

      <!-- 검색 버튼 -->
      <div class="mt-4 flex justify-end">
        <Button @click="searchTalents" class="bg-[#8B8BF5] text-white px-6">
          검색하기
        </Button>
      </div>
    </div>

    <!-- 인재 목록 -->
    <div class="grid grid-cols-1 gap-4">
      <div v-for="talent in talents" :key="talent.id" 
        class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-lg font-bold">{{ talent.name }}</h3>
              <span class="text-sm text-gray-600">{{ talent.nationality }}</span>
              <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                경력 {{ talent.career }}
              </span>
            </div>
            
            <p class="text-gray-600">{{ talent.education }} · {{ talent.major }}</p>
          </div>

          <div class="flex flex-col items-end gap-3">
            <button @click="toggleBookmark" class="text-gray-400 hover:text-[#8B8BF5]">
              <i :class="['pi', isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']"></i>
            </button>
            <button 
              @click="openResumeModal(talent)" 
              class="w-[140px] px-4 py-2 border border-[#8B8BF5] text-[#8B8BF5] rounded-lg hover:bg-gray-50"
            >
              이력서 보기
            </button>
            <button 
              @click="openInterviewOffer(talent)" 
              class="w-[140px] px-4 py-2 bg-[#8B8BF5] text-white rounded-lg hover:bg-[#7A7AE6]"
            >
              면접 제안하기
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 이력서 상세 모달 -->
    <Dialog 
      v-model:visible="showResumeModal" 
      :modal="true"
      :style="{ width: '80vw' }"
      :maximizable="true"
    >
      <template #header>
        <div class="text-2xl font-bold">이력서</div>
      </template>

      <div class="p-4">
        <!-- 기본 정보 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">기본 정보</h3>
          <div class="grid grid-cols-2 gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedCandidate?.name }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">생년월일</span>
              <span>{{ selectedCandidate?.birthdate }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">성별</span>
              <span>{{ selectedCandidate?.gender }}</span>
            </div>
            <!-- 연락처 정보는 면접 제안 수락 후에만 표시 -->
            <div v-if="isAccepted" class="flex gap-8">
              <span class="text-gray-600 w-20">연락처</span>
              <span>{{ selectedCandidate?.phone }}</span>
            </div>
            <div v-if="isAccepted" class="flex gap-8">
              <span class="text-gray-600 w-20">이메일</span>
              <span>{{ selectedCandidate?.email }}</span>
            </div>
            <div v-if="isAccepted" class="flex gap-8">
              <span class="text-gray-600 w-20">주소</span>
              <span>{{ selectedCandidate?.address }}</span>
            </div>
            <!-- 연락처 정보가 없을 때 표시할 메시지 -->
            <div v-else class="col-span-2 text-gray-500 italic">
              * 연락처 정보는 면접 제안이 수락된 후 확인하실 수 있습니다
            </div>
          </div>
        </div>

        <!-- 국가 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">국가</h3>
          <div>
            <span>{{ selectedCandidate?.nationality }}</span>
          </div>
        </div>

        <!-- 여권 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">여권</h3>
          <div class="grid gap-y-4">
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">이름</span>
              <span>{{ selectedCandidate?.passportName }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">여권번호</span>
              <span>{{ selectedCandidate?.passportNumber }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">국적</span>
              <span>{{ selectedCandidate?.nationality }}</span>
            </div>
            <div class="flex gap-8">
              <span class="text-gray-600 w-20">만료일</span>
              <span>{{ selectedCandidate?.passportExpiry }}</span>
            </div>
          </div>
        </div>

        <!-- 경력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">경력 사항</h3>
          <div v-for="(career, index) in selectedCandidate?.careers" :key="index" class="mb-4">
            <div class="font-medium">{{ career.company }}</div>
            <div class="text-gray-600">{{ career.period }}</div>
            <div class="text-gray-600">{{ career.position }}/{{ career.department }}</div>
            <div class="mt-2">{{ career.description }}</div>
          </div>
        </div>

        <!-- 학력 사항 -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 class="text-lg font-medium mb-4">학력 사항</h3>
          <div v-for="(edu, index) in selectedCandidate?.education" :key="index" class="mb-4">
            <div class="font-medium">{{ edu.school }}</div>
            <div class="text-gray-600">{{ edu.type }}</div>
            <div class="text-gray-600">{{ edu.major }}</div>
            <div class="text-gray-600">{{ edu.period }}</div>
            <div>{{ edu.description }}</div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-4">
          <Button 
            @click="toggleBookmark" 
            :class="['p-button-text', isBookmarked ? 'text-[#8B8BF5]' : 'text-gray-400']"
          >
            <i :class="['pi', isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']" style="font-size: 1.5rem"></i>
          </Button>
          <Button 
            @click="openInterviewOffer(selectedCandidate)" 
            class="bg-[#8B8BF5] hover:bg-[#7A7AE6]"
          >
            면접 제안하기
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
:deep(.p-dropdown),
:deep(.p-multiselect) {
  width: 100%;
}

:deep(.p-dropdown-panel),
:deep(.p-multiselect-panel) {
  width: 100%;
}
</style> 