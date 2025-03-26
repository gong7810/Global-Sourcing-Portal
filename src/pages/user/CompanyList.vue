<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

// 회사 정보 데이터
const companies = ref([
  {
    name: '밥스(주)',
    business: '산업용 CFRP 물러, 디스플레이용 로봇핸드, 자동차 부품',
    address: '대전 유성구 국제과학로46(신동)'
  },
  {
    name: '한국항공우주산업(주)',
    business: '기체구조물, 성능개량, 원재기 제작',
    address: '서울사무소: 서울특별시 강남구 테헤란로 309 6층 (역삼동, 삼성제일빌딩)\n부사: 경남 사천시 사남면 유천리 802'
  },
  {
    name: 'LIG넥스원',
    business: '항공전자, 유도 및 수중 무기, 사격통제, 전자광학',
    address: '경기도 용인시 기흥구 마북로 207'
  },
  {
    name: '대한항공',
    business: '항공기 및 위성 부품 제작, 정비 및 개조',
    address: '서울시 중구 서소문동 41-3 대한항공 서소문빌딩 10층'
  },
  {
    name: '한국로스트왁스',
    business: '항공기 엔진 부품',
    address: '경기도 안산시 단원구 성곡동 702-5(시화공단 4마 409)'
  }
]);

// 검색어에 따라 필터링된 회사 목록
const filteredCompanies = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return companies.value;
  
  return companies.value.filter(company => 
    company.name.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 영역 -->
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">기업 목록</h1>
    </div>
    
    <!-- 검색 및 필터 영역 -->
    <div class="mb-6">
      <div class="flex gap-4">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="기업명 검색" 
          class="flex-1 p-2 border border-gray-300 rounded-lg focus:border-[#8B8BF5] focus:outline-none"
        >
      </div>
    </div>

    <!-- 회사 목록 -->
    <div class="space-y-4">
      <div
        v-for="company in filteredCompanies"
        :key="company.name"
        class="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-[#8B8BF5] cursor-pointer"
      >
        <div class="flex justify-between items-start">
          <div class="flex-grow">
            <div class="flex items-center gap-2 mb-3">
              <h3 class="text-xl font-bold">{{ company.name }}</h3>
            </div>
            <div class="flex gap-8 text-gray-600 mb-3">
              <span class="flex items-center gap-2">
                <i class="pi pi-briefcase"></i>
                {{ company.business }}
              </span>
            </div>
            <div class="flex gap-8 text-gray-600">
              <span class="flex items-center gap-2 text-sm">
                <i class="pi pi-map-marker"></i>
                {{ company.address }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-sm {
  white-space: pre-line;
}
</style> 