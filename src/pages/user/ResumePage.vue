<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
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
  { label: '여성', value: 'female' },
  { label: '비공개', value: 'private' }
];

const genderSaved = ref(false);
const addressSaved = ref(false);

const saveGender = () => {
  // 성별 저장 로직 추가
  console.log('성별 저장:', basicInfo.value.gender);
  genderSaved.value = true;
  setTimeout(() => (genderSaved.value = false), 2000); // 2초 후 메시지 숨김
};

const saveAddress = () => {
  // 주소 저장 로직 추가
  console.log('주소 저장:', basicInfo.value.address);
  addressSaved.value = true;
  setTimeout(() => (addressSaved.value = false), 2000); // 2초 후 메시지 숨김
};

const details = ref([
  { title: '국가', placeholder: '국가를 입력해주세요' },
  { title: '비자', placeholder: '보유한 비자를 입력해주세요' },
  { title: '경력', placeholder: '회사명, 재직기간, 직무' },
  { title: '학력', placeholder: '학교명, 재학기간, 전공, 학력' },
  { title: '자격증 · 증명서', placeholder: '자격증 및 증명서, 발급기관, 취득일' },
  { title: '첨부링크', placeholder: 'URL을 입력해주세요' },
]);

const goToEditInfo = () => {
  router.push({ name: 'Profile' });
};

const editDetail = (index) => {
  details.value[index].isEditing = true;
};

const cancelEdit = (index) => {
  details.value[index].isEditing = false;
};

const saveDetail = (index) => {
  details.value[index].isEditing = false;
  // 여기에 저장 로직 추가
};

const addDetail = (index) => {
  // 여기에 항목 추가 로직 구현
};

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>

<template>
  <AppTopbar />
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <div class="grid gap-4">
      <div class="resume-page">
        <!-- 페이지 제목 -->
        <h1 class="text-2xl font-bold mb-6">이력서 관리</h1>
        <!-- 기본 정보 섹션 -->
        <div class="bg-white rounded-lg p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">기본 정보</h2>
            <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="goToEditInfo" />
          </div>
          <div class="space-y-4 text-gray-600">
            <div class="flex items-center gap-4">
              <i class="pi pi-user"></i>
              <span>{{ basicInfo.name }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-calendar"></i>
              <span>{{ basicInfo.birthDate }}</span>
              <Select v-model="basicInfo.gender" :options="genders" optionLabel="label" placeholder="성별" class="w-32" />
              <Button icon="pi pi-pencil" class="p-button-text" @click="saveGender" />
              <span v-if="genderSaved" class="text-green-500">수정되었습니다!</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-envelope"></i>
              <span>{{ basicInfo.email }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-phone"></i>
              <span>{{ basicInfo.phone }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-map-marker"></i>
              <InputText v-model="basicInfo.address" placeholder="주소를 입력해주세요" class="w-96" />
              <Button icon="pi pi-pencil" class="p-button-text" @click="saveAddress" />
              <span v-if="addressSaved" class="text-green-500">수정되었습니다!</span>
            </div>
          </div>
        </div>

        <!-- 상세 정보 섹션 -->
        <div class="space-y-4">
          <div v-for="(item, index) in details" :key="index" class="bg-white rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold">{{ item.title }}</h3>
              <div class="flex gap-2">
                <Button icon="pi pi-plus" class="p-button-text p-button-sm" @click="addDetail(index)" />
                <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editDetail(index)" />
              </div>
            </div>
            <div v-if="item.isEditing">
              <InputText v-model="item.value" :placeholder="item.placeholder" rows="3" class="w-full" />
              <div class="flex justify-end gap-2 mt-2">
                <Button label="취소" class="p-button-text" @click="cancelEdit(index)" />
                <Button label="저장" @click="saveDetail(index)" />
              </div>
            </div>
            <p v-else class="text-gray-500">{{ item.value || item.placeholder }}</p>
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
.w-96 {
  width: 36rem;
}

.mt-12.border-t.border-gray-200.bg-gray-50 {
  background-color: #f1f5f9;
}
</style>
