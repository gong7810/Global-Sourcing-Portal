<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import AppTopbar from '@/layout/AppTopbar.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const basicInfo = ref({
  name: '최예지',
  birthDate: '1996.09.01',
  gender: '여성',
  email: 'ye****@naver.com',
  phone: '010-****-7496',
  address: '윙스타워 505호'
});

const genders = [
  { label: '남성', value: 'male' },
  { label: '여성', value: 'female' }
];

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>

<template>
  <AppTopbar />
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="grid gap-4">
      <div class="profile-page">
        <!-- 기본 정보 섹션 -->
        <div class="bg-white rounded-lg p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">기본 정보</h2>
          </div>
          <div class="space-y-4 text-gray-600">
            <div class="flex items-center gap-4">
              <i class="pi pi-user"></i>
              <InputText v-model="basicInfo.name" placeholder="이름을 입력해주세요" class="w-full" />
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-calendar"></i>
              <DatePicker v-model="basicInfo.birthDate" format="yyyy-MM-dd" placeholder="생년월일을 선택해주세요" class="w-32" />
              <Select v-model="basicInfo.gender" :options="genders" optionLabel="label" placeholder="성별" class="w-32" />
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-envelope"></i>
              <InputText v-model="basicInfo.email" placeholder="이메일을 입력해주세요" class="w-full" />
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-phone"></i>
              <InputText v-model="basicInfo.phone" placeholder="전화번호를 입력해주세요" class="w-full" />
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-map-marker"></i>
              <InputText v-model="basicInfo.address" placeholder="주소를 입력해주세요" class="w-full" />
            </div>
            <!-- 취소 및 저장 버튼 -->
            <div class="flex justify-center gap-4 mt-6">
              <Button label="취소" class="p-button-secondary" @click="cancelEdit" />
              <Button label="저장" class="p-button-primary" @click="saveAll" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 푸터 추가 -->
  <div class="mt-12 border-t border-gray-200 bg-gray-50">
    <div class="max-w-[1200px] mx-auto px-4 pt-6">
      <div class="mb-6">
        <h2 class="text-lg font-bold mb-2">BTPOTAL</h2>
        <div class="text-gray-600 text-sm space-y-1">
          <p>대표: 김종진</p>
          <p>사업자 등록번호: 695-87-03015</p>
          <p>주소: 경상남도 진주시 동부로 169번길 12, B동 505호 (충무공동, 윙스타워)</p>
          <p>고객센터: 070-8211-3394</p>
          <p>이메일: jjkim@pbnt.kr</p>
          <p>직업정보제공사업:</p>
          <p class="pb-3 border-b border-gray-200">통신판매업:</p>
        </div>
      </div>

      <div class="flex gap-6 text-sm">
        <a href="#" class="text-blue-900 font-medium">개인정보처리방침</a>
        <a href="#" class="text-gray-600">이용약관</a>
        <a href="#" class="text-gray-600">이용자 준수사항</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-12.border-t.border-gray-200.bg-gray-50 {
  background-color: #f1f5f9;
}
</style>
