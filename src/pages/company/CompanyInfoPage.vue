<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { cloneDeep } from 'es-toolkit/compat';
import { useMessagePop } from '@/plugins/commonutils';

import { getCompanyInfo, updateCompanyInfo } from '@/apis/company/companyApis';
import { getCodeList } from '@/apis/common/commonApis';

const router = useRouter();
const messagePop = useMessagePop();

// 수정 모드 상태
const isEditing = ref(false);

// 기업 정보 데이터
let initCompanyInfo = {};
const companyInfo = ref({});

// 기업 구분 옵션
const companyTypes = ref([]);

// {
//   name: '(주)비티포탈',
//   businessNumber: '123-45-67890',
//   companyType: 'corporation',
//   ceoName: '김관리',
//   phone: '010-1234-5678',
//   email: 'manager@btportal.com',
//   mainBusiness: '',
//   address: '' // 회사주소
//   // zipCode: '',        // 우편번호
//   // address: '',        // 기본주소
//   // addressDetail: ''   // 상세주소
// }

const goBack = () => {
  router.back();
};

onMounted(() => {
  setCompanyType();

  setCompanyInfo();
});

// 기업 형태 코드 조회
const setCompanyType = async () => {
  const response = await getCodeList(`COMPANY_TY`);

  response.map((item) => {
    companyTypes.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 회사 정보 조회
const setCompanyInfo = async () => {
  const response = await getCompanyInfo();

  companyInfo.value = {
    ...response,
    email: response.user.email,
    companyType: { name: response.companyType.name, code: response.companyType.code }
  };

  initCompanyInfo = cloneDeep(companyInfo.value);
};

// 수정 모드 토글
const toggleEdit = () => {
  if (isEditing.value) {
    // 수정 완료
    console.log(companyInfo.value);
    messagePop.confirm({
      icon: 'info',
      message: '수정 하시겠습니까?',
      onCloseYes: async () => {
        const body = { ...companyInfo.value, companyTypeCd: companyInfo.value.companyType.code };

        const response = await updateCompanyInfo(body);

        if (response) {
          router.back();
        } else {
          messagePop.toast('시스템 오류입니다.', 'error');
        }

        isEditing.value = false;
      }
    });
  } else {
    // 수정 시작
    isEditing.value = true;
  }
};

// 수정 취소
const cancelEdit = () => {
  companyInfo.value = cloneDeep(initCompanyInfo);
  isEditing.value = false;
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 헤더 -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <i
          class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
          @click="goBack"
        ></i>
        <h1 class="text-3xl font-bold">기업 정보</h1>
      </div>
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
            <InputText
              v-model="companyInfo.name"
              :disabled="!isEditing"
              placeholder="기업명을 입력해주세요"
              class="w-full"
            />
          </div>

          <!-- 사업자등록번호 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-id-card"></i>
            <InputText
              v-model="companyInfo.businessNumber"
              :disabled="!isEditing"
              placeholder="사업자등록번호를 입력해주세요"
              class="w-full"
            />
          </div>

          <!-- 기업구분 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-briefcase"></i>
            <Select
              v-model="companyInfo.companyType"
              :options="companyTypes"
              optionLabel="name"
              :disabled="!isEditing"
              placeholder="기업구분을 선택해주세요"
              class="w-full"
              checkmark
              highlightOnSelect
            />
          </div>

          <!-- 가입자명 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-user"></i>
            <InputText
              v-model="companyInfo.ceoName"
              :disabled="!isEditing"
              placeholder="가입자명을 입력해주세요"
              class="w-full"
            />
          </div>

          <!-- 연락처 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-phone"></i>
            <InputText
              v-model="companyInfo.phone"
              :disabled="!isEditing"
              placeholder="연락처를 입력해주세요"
              class="w-full"
            />
          </div>

          <!-- 이메일 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-envelope"></i>
            <InputText
              v-model="companyInfo.email"
              :disabled="!isEditing"
              placeholder="이메일을 입력해주세요"
              class="w-full"
            />
          </div>

          <!-- 회사주소 -->
          <div class="flex items-center gap-4">
            <i class="pi pi-map-marker"></i>
            <InputText
              v-model="companyInfo.address"
              :disabled="!isEditing"
              placeholder="회사주소를 입력해주세요"
              class="w-full"
            />
          </div>

          <!-- 주요사업 -->
          <div class="flex items-start gap-4">
            <i class="pi pi-list mt-2"></i>
            <Textarea
              v-model="companyInfo.content"
              :disabled="!isEditing"
              placeholder="주요사업 내용을 입력해주세요"
              rows="4"
              class="w-full"
            />
          </div>

          <!-- 버튼 영역 -->
          <div class="px-8 py-6 bg-gray-50 border-t flex justify-center gap-4">
            <template v-if="isEditing">
              <Button class="bt_btn secondary px-6 hover:bg-gray-100" type="button" label="취소" @click="cancelEdit" />
              <Button
                class="bt_btn primary px-6 bg-gradient-to-r from-[#8FA1FF] to-[#8B8BF5] border-none hover:bg-gradient-to-r hover:from-[#7B8FFF] hover:to-[#7878F2]"
                type="submit"
                label="저장"
              />
            </template>
            <Button
              v-else
              class="bt_btn primary px-6 bg-gradient-to-r from-[#8FA1FF] to-[#8B8BF5] border-none hover:bg-gradient-to-r hover:from-[#7B8FFF] hover:to-[#7878F2]"
              type="button"
              label="수정"
              @click="toggleEdit"
            />
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

:deep(.p-inputtextarea) {
  width: 100%;
  border-radius: 8px;
}

:deep(.p-inputtextarea:disabled) {
  background-color: #f3f4f6;
  opacity: 1;
  cursor: not-allowed;
}

/* 주소 검색 버튼 스타일 */
:deep(.p-button-secondary:disabled) {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
  opacity: 1;
  cursor: not-allowed;
}
</style>
