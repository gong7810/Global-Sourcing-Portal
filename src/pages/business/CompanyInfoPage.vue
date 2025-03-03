<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

const router = useRouter();
const goBack = () => {
  router.back();
};

// 기업 정보 데이터
const companyInfo = ref({
  companyName: '(주)비티포탈',
  businessNumber: '123-45-67890',
  companyType: 'corporation',
  managerName: '김관리',
  phoneNumber: '010-1234-5678',
  email: 'manager@btportal.com'
});

// 기업 구분 옵션
const companyTypes = [
  { label: '법인', value: 'corporation' },
  { label: '개인', value: 'individual' },
  { label: '공공기관', value: 'public' }
];

// 수정 모드 상태
const isEditing = ref(false);

// 수정된 정보를 임시 저장
const editedInfo = ref({ ...companyInfo.value });

// 수정 모드 토글
const toggleEdit = () => {
  if (isEditing.value) {
    // 수정 완료 시 정보 업데이트
    companyInfo.value = { ...editedInfo.value };
    isEditing.value = false;
  } else {
    // 수정 모드 시작 시 현재 정보 복사
    editedInfo.value = { ...companyInfo.value };
    isEditing.value = true;
  }
};

// 수정 취소
const cancelEdit = () => {
  editedInfo.value = { ...companyInfo.value };
  isEditing.value = false;
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center gap-4 mb-8">
      <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" 
        @click="goBack"></i>
      <h1 class="text-3xl font-bold">기업 정보</h1>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="grid gap-4">
      <div class="bg-white rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">기업 정보</h2>
        </div>
        <form @submit.prevent="toggleEdit" class="space-y-4 text-gray-600">
          <!-- 기업명 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-building"></i>
            <InputText v-model="editedInfo.companyName" 
              :disabled="!isEditing"
              placeholder="기업명을 입력해주세요"
              class="w-full" />
          </div>

          <!-- 사업자등록번호 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-id-card"></i>
            <InputText v-model="editedInfo.businessNumber" 
              :disabled="!isEditing"
              placeholder="사업자등록번호를 입력해주세요"
              class="w-full" />
          </div>

          <!-- 기업구분 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-briefcase"></i>
            <Select v-model="editedInfo.companyType" 
              :options="companyTypes" 
              optionLabel="label"
              :disabled="!isEditing"
              placeholder="기업구분을 선택해주세요"
              class="w-full"
              checkmark
              highlightOnSelect />
          </div>

          <!-- 담당자명 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-user"></i>
            <InputText v-model="editedInfo.managerName" 
              :disabled="!isEditing"
              placeholder="담당자명을 입력해주세요"
              class="w-full" />
          </div>

          <!-- 연락처 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-phone"></i>
            <InputText v-model="editedInfo.phoneNumber" 
              :disabled="!isEditing"
              placeholder="연락처를 입력해주세요"
              class="w-full" />
          </div>

          <!-- 이메일 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-envelope"></i>
            <InputText v-model="editedInfo.email" 
              :disabled="!isEditing"
              placeholder="이메일을 입력해주세요"
              class="w-full" />
          </div>

          <!-- 버튼 영역 -->
          <div class="px-8 py-6 bg-gray-50 border-t flex justify-center gap-4">
            <template v-if="isEditing">
              <Button type="button" 
                label="취소" 
                class="p-button-secondary px-6 hover:bg-gray-100" 
                @click="cancelEdit" />
              <Button type="submit" 
                label="저장" 
                class="p-button-primary px-6 bg-gradient-to-r from-[#8FA1FF] to-[#8B8BF5] border-none hover:bg-gradient-to-r hover:from-[#7B8FFF] hover:to-[#7878F2]" />
            </template>
            <Button v-else 
              type="button" 
              label="수정" 
              class="p-button-primary px-6 bg-gradient-to-r from-[#8FA1FF] to-[#8B8BF5] border-none hover:bg-gradient-to-r hover:from-[#7B8FFF] hover:to-[#7878F2]"
              @click="toggleEdit" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-dropdown) {
  width: 100%;
  border-radius: 8px;
}

:deep(.p-inputtext:disabled) {
  background-color: #f3f4f6;
  opacity: 1;
  cursor: not-allowed;
}

:deep(.p-button) {
  border-radius: 8px;
}

:deep(.p-button.p-button-secondary) {
  background-color: white;
  border-color: #e5e7eb;
  color: #374151;
}

:deep(.p-button.p-button-secondary:hover) {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
  color: #374151;
}
</style>
