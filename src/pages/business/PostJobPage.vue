<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const jobTitle = ref('');
const deadline = ref(null);
const jobType = ref(null);
const careerLevel = ref(null);
const education = ref(null);
const salaryMin = ref(null);
const salaryMax = ref(null);
const workLocation = ref('');
const requiredSkills = ref('');
const preferredSkills = ref('');

const jobTypes = [
  { label: '정규직', value: 'full-time' },
  { label: '계약직', value: 'contract' },
  { label: '인턴', value: 'intern' },
  { label: '프리랜서', value: 'freelance' }
];

const careerLevels = [
  { label: '신입', value: 'entry' },
  { label: '1~3년', value: 'junior' },
  { label: '4~7년', value: 'middle' },
  { label: '8년 이상', value: 'senior' }
];

const educationLevels = [
  { label: '학력무관', value: 'none' },
  { label: '고졸이상', value: 'high-school' },
  { label: '대졸이상', value: 'bachelor' },
  { label: '석사이상', value: 'master' },
  { label: '박사이상', value: 'phd' }
];

const router = useRouter();
const goBack = () => {
  router.back();
};

const handleSubmit = () => {
  // TODO: 공고 등록 로직 구현
  console.log('공고 등록');
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <i
          class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
          @click="router.back()"
        ></i>
        <h1 class="text-3xl font-bold">공고 등록</h1>
      </div>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="bg-white rounded-xl shadow-sm">
      <form @submit.prevent="handleSubmit" class="divide-y divide-gray-200">
        <!-- 기본 정보 -->
        <div class="p-6">
          <h2 class="text-lg font-bold mb-6">기본 정보</h2>
          
          <div class="space-y-6">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">공고 제목*</label>
              <InputText v-model="jobTitle" class="w-full" placeholder="공고 제목을 입력해주세요" />
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">마감일*</label>
              <DatePicker v-model="deadline" class="w-full" placeholder="마감일을 선택해주세요" />
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">고용형태*</label>
                <Select v-model="jobType" :options="jobTypes" optionLabel="label" 
                  placeholder="고용형태를 선택해주세요" class="w-full" />
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">경력*</label>
                <Select v-model="careerLevel" :options="careerLevels" optionLabel="label" 
                  placeholder="경력을 선택해주세요" class="w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">학력</label>
                <Select v-model="education" :options="educationLevels" optionLabel="label" 
                  placeholder="학력을 선택해주세요" class="w-full" />
              </div>
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">근무지역*</label>
                <InputText v-model="workLocation" class="w-full" placeholder="근무지역을 입력해주세요" />
              </div>
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">연봉</label>
              <div class="flex items-center gap-4">
                <InputNumber v-model="salaryMin" placeholder="최소 연봉" suffix=" 만원" class="w-full" />
                <span>~</span>
                <InputNumber v-model="salaryMax" placeholder="최대 연봉" suffix=" 만원" class="w-full" />
              </div>
            </div>
          </div>
        </div>

        <!-- 자격 요건 -->
        <div class="p-6">
          <h2 class="text-lg font-bold mb-6">자격 요건</h2>
          
          <div class="space-y-6">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">필수 스킬</label>
              <InputText v-model="requiredSkills" class="w-full" 
                placeholder="필수 스킬을 입력해주세요 (쉼표로 구분)" />
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">우대 사항</label>
              <InputText v-model="preferredSkills" class="w-full" 
                placeholder="우대 사항을 입력해주세요 (쉼표로 구분)" />
            </div>
          </div>
        </div>

        <!-- 버튼 영역을 폼 내부 마지막으로 이동 -->
        <div class="p-6">
          <div class="flex justify-end gap-4">
            <Button label="취소" class="p-button-outlined" @click="goBack" />
            <Button type="submit" label="등록하기" class="p-button-primary" @click="handleSubmit" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-datepicker),
:deep(.p-inputnumber) {
  width: 100%;
  border-radius: 8px;
}

:deep(.p-select-panel) {
  width: auto !important;
}

:deep(.p-button) {
  border-radius: 8px;
}

:deep(.p-button.p-button-rounded) {
  border-radius: 50%;
}

.form-group {
  margin-bottom: 1rem;
}
</style>

