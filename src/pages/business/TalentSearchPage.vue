<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';

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

const toggleBookmark = (talent) => {
  talent.isBookmarked = !talent.isBookmarked;
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 키워드 검색 -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">키워드</label>
          <InputText 
            v-model="searchKeyword"
            placeholder="이름, 학교, 전공 등"
            class="w-full"
          />
        </div>

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

        <!-- 기술 스택 필터 -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">기술 스택</label>
          <MultiSelect
            v-model="selectedSkills"
            :options="skillOptions"
            optionLabel="label"
            placeholder="기술 스택 선택"
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
        class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-4 mb-3">
              <h3 class="text-xl font-bold">{{ talent.name }}</h3>
              <span class="text-sm text-gray-600">{{ talent.nationality }}</span>
              <span class="bg-[#8B8BF5] bg-opacity-10 text-[#8B8BF5] px-3 py-1 rounded-full text-sm">
                경력 {{ talent.career }}
              </span>
            </div>
            
            <div class="mb-3">
              <p class="text-gray-600">{{ talent.education }} · {{ talent.major }}</p>
            </div>

            <div class="flex flex-wrap gap-2">
              <span v-for="skill in talent.skills" :key="skill"
                class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {{ skill }}
              </span>
            </div>
          </div>

          <button @click="toggleBookmark(talent)" class="text-gray-400 hover:text-[#8B8BF5]">
            <i :class="['pi', talent.isBookmarked ? 'pi-bookmark-fill' : 'pi-bookmark']"></i>
          </button>
        </div>
      </div>
    </div>
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