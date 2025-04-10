<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { useMessagePop } from '@/plugins/commonutils';
import { fileUpload, getCodeList } from '@/apis/common/commonApis';
import { getAccount, resetPasswordByUser, updateAccount } from '@/apis/auth/authApis';

const router = useRouter();
const authStore = useAuthStore();
const messagePop = useMessagePop();

const { userInfo } = storeToRefs(authStore);

const basicInfo = ref({
  hasCriminalRecord: null,
  criminalRecordFileId: null
});

const profileImage = ref(null);
const profileRawData = ref();
const criminalRecordFile = ref(null);

const genders = ref([]);
const koreanLevels = ref([]);
const maritalStatuses = ref([
  { name: '미혼', code: false },
  { name: '기혼', code: true }
]);
const criminalRecordOptions = [
  { name: '없음', code: false },
  { name: '있음', code: true }
];

onMounted(() => {
  setGenderList();

  setKoreanLevel();

  setAccountInfo();
});

// 성별 세팅
const setGenderList = async () => {
  const response = await getCodeList(`GENDER_TY`);

  response.map((item) => {
    genders.value.push({ name: item.name, code: item.code });
  });
};

// 한국어 실력 세팅
const setKoreanLevel = async () => {
  const response = await getCodeList(`KOREAN_LV`);

  response.map((item) => {
    koreanLevels.value.push({ name: item.name, code: item.code });
  });
};

// 내 정보 세팅
const setAccountInfo = async () => {
  const response = await getAccount();

  basicInfo.value = response;

  basicInfo.value.gender = {
    name: basicInfo.value?.gender.name,
    code: basicInfo.value?.gender.code
  };

  // 프로필 이미지 세팅
  if (basicInfo.value.imageFile) {
    profileImage.value = `${import.meta.env.VITE_UPLOAD_PATH}/${basicInfo.value.imageFile.fileName}`;
  }
};

// 비밀번호 수정 모달 관련
const showPasswordModal = ref(false);
const passwordInfo = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 비밀번호 수정 모달 열기
const openPasswordModal = () => {
  showPasswordModal.value = true;
};

// 비밀번호 수정 모달 닫기
const closePasswordModal = () => {
  passwordInfo.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  showPasswordModal.value = false;
};

// 비밀번호 수정 처리
const updatePassword = () => {
  // 비밀번호 유효성 검사
  if (!passwordInfo.value.currentPassword) {
    messagePop.toast('현재 비밀번호를 입력해주세요.', 'warn');
    return;
  }
  if (!passwordInfo.value.newPassword) {
    messagePop.toast('새 비밀번호를 입력해주세요.', 'warn');
    return;
  }
  if (passwordInfo.value.newPassword !== passwordInfo.value.confirmPassword) {
    messagePop.toast('새 비밀번호가 일치하지 않습니다.', 'warn');
    return;
  }

  messagePop.confirm({
    message: '비밀번호를 변경하시겠습니까?',
    onCloseYes: async () => {
      const body = {
        password: passwordInfo.value.currentPassword,
        newPassword: passwordInfo.value.newPassword
      };

      const response = await resetPasswordByUser(body);

      if (response) {
        messagePop.alert('비밀번호가 변경되었습니다.', 'good');
      } else {
        messagePop.alert('시스템 오류입니다.', 'bad');
      }
      closePasswordModal();
    }
  });
};

const cancelEdit = () => {
  messagePop.confirm({
    message: '변경사항이 저장되지 않습니다. 취소하시겠습니까?',
    onCloseYes: () => {
      router.back();
    }
  });
};

// 내 정보 수정
const saveAll = () => {
  // 필수 필드 검사
  if (!profileImage.value) {
    messagePop.toast('프로필 사진을 등록해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.name) {
    messagePop.toast('이름을 입력해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.birth) {
    messagePop.toast('생년월일을 선택해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.gender) {
    messagePop.toast('성별을 선택해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.email) {
    messagePop.toast('이메일을 입력해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.mobile) {
    messagePop.toast('전화번호를 입력해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.address) {
    messagePop.toast('주소를 입력해주세요.', 'warn');
    return;
  }
  if (!basicInfo.value.criminalRecordFileId) {
    messagePop.toast('범죄경력 확인서를 업로드해주세요.', 'warn');
    return;
  }

  messagePop.confirm({
    message: '변경사항을 저장하시겠습니까?',
    onCloseYes: async () => {
      let body = {
        ...basicInfo.value,
        birth:
          typeof basicInfo.value.birth === 'string'
            ? basicInfo.value.birth
            : basicInfo.value.birth.toISOString().slice(0, 10).replaceAll('-', '.'),
        genderCd: basicInfo.value.gender.code
      };

      // 프로필 사진 수정 or 저장
      if (profileRawData.value) {
        const formData = saveImage(profileRawData.value);

        const res = await fileUpload(formData);

        body = { ...basicInfo.value, profileImage: res?.id };
      }
      // 범죄경력 증빙파일
      if (criminalRecordFile.value) {
        const formData = saveImage(criminalRecordFile.value);

        const res = await fileUpload(formData);

        body = { ...basicInfo.value, criminalRecordFileId: res?.id };
      }

      const response = await updateAccount(body);

      if (response && response.success === undefined) {
        userInfo.value = response;
        messagePop.alert('저장되었습니다.', 'good');
      } else {
        messagePop.alert('시스템 오류입니다.', 'bad');
      }
      router.back();
    }
  });
};

// 이미지 바이너리 변환
const saveImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return formData;
};

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

// 프로필 사진 처리
const handleImageUpload = (event) => {
  profileRawData.value = event.target.files[0];

  if (profileRawData.value) {
    // 파일 크기 체크 (3MB)
    if (profileRawData.value.size > 3 * 1024 * 1024) {
      messagePop.toast('파일 크기는 3MB 이하여야 합니다.', 'warn');
      return;
    }

    // 파일 형식 체크
    if (!['image/jpeg', 'image/png'].includes(profileRawData.value.type)) {
      messagePop.toast('JPG 또는 PNG 형식의 이미지만 업로드 가능합니다.', 'warn');
      return;
    }

    // 이미지 크기 체크
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (Math.abs(img.width / img.height - 3 / 4) > 0.1) {
        messagePop.confirm({
          message: '이미지의 비율이 3:4와 다릅니다. 계속하시겠습니까?',
          onCloseYes: () => {
            const imageUrl = URL.createObjectURL(profileRawData.value);
            profileImage.value = imageUrl;
          }
        });
      } else {
        const imageUrl = URL.createObjectURL(profileRawData.value);
        profileImage.value = imageUrl;
      }
    };

    img.src = URL.createObjectURL(profileRawData.value);
  }
};

const removeImage = () => {
  profileImage.value = '';
  profileRawData.value = '';
};

// 범죄경력증명 파일 처리
const handleCriminalRecordUpload = (event) => {
  criminalRecordFile.value = event.target.files[0];
  if (criminalRecordFile.value) {
    // 파일 크기 체크 (10MB)
    if (criminalRecordFile.value.size > 10 * 1024 * 1024) {
      messagePop.toast('파일 크기는 10MB 이하여야 합니다.', 'warn');
      return;
    }

    // 파일 형식 체크
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(criminalRecordFile.value.type)) {
      messagePop.toast('PDF, JPG 또는 PNG 형식의 파일만 업로드 가능합니다.', 'warn');
      return;
    }

    basicInfo.value.criminalRecordFile = criminalRecordFile.value;
  }
};

const removeCriminalRecord = () => {
  basicInfo.value.criminalRecordFile = null;
  criminalRecordFile.value = null;
};
</script>

<template>
  <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
  <div class="max-w-[1200px] mx-auto px-4 py-12">
    <!-- 제목 추가 -->
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">내 정보</h1>
    </div>
    <div class="grid gap-4">
      <div class="user-page">
        <!-- 계정 정보 섹션 -->
        <div class="bg-white rounded-lg p-6 mb-6" v-if="!basicInfo?.isSocialLogin">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">계정 정보</h2>
          </div>
          <div class="space-y-4 text-gray-600">
            <div class="flex items-center gap-4">
              <i class="pi pi-id-card"></i>
              <span class="w-20 text-gray-500">아이디</span>
              <span>{{ basicInfo.loginId }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-lock"></i>
              <span class="w-20 text-gray-500">비밀번호</span>
              <Button
                label="수정"
                class="p-button-text p-button-sm text-[#8FA1FF]"
                style="color: #8fa1ff"
                @click="openPasswordModal"
              />
            </div>
          </div>
        </div>

        <!-- 소셜 로그인 알림 -->
        <div class="bg-white rounded-lg p-6 mb-6" v-else>
          <div class="flex items-center gap-2 text-gray-600">
            <i class="pi pi-info-circle text-[#8FA1FF]"></i>
            <span>소셜 로그인으로 가입된 계정입니다.</span>
          </div>
        </div>

        <!-- 기본 정보 섹션 -->
        <div class="bg-white rounded-lg p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">기본 정보</h2>
            <span class="text-sm text-red-500">* 필수 입력 항목</span>
          </div>
          <div class="mb-6 flex flex-col items-center">
            <div class="relative w-[120px] h-[160px] mb-4">
              <img
                :src="profileImage || '/default-profile.jpg'"
                alt="프로필 이미지"
                class="w-full h-full object-cover border border-gray-200 rounded-sm"
              />
              <div class="absolute bottom-0 right-0">
                <label class="cursor-pointer bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
                  <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
                  <i class="pi pi-camera text-gray-600"></i>
                </label>
              </div>
              <button
                v-if="profileImage"
                @click="removeImage"
                class="absolute top-0 right-0 bg-red-500 text-white h-[23px] rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
            <div class="text-center space-y-1">
              <p class="text-sm text-gray-700 font-medium">증명사진 규격 (3x4) <span class="text-red-500">*</span></p>
              <p class="text-xs text-gray-500">
                - 이미지 크기: 120px x 160px (권장)<br />
                - 파일 형식: JPG, PNG<br />
                - 파일 크기: 3MB 이하
              </p>
            </div>
          </div>
          <div class="space-y-4 text-gray-600">
            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-user"></i>
                <label class="text-sm"> 이름 <span class="text-red-500">*</span> </label>
              </div>
              <InputText v-model="basicInfo.name" placeholder="이름을 입력해주세요" class="w-full" />
            </div>

            <div class="flex gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <i class="pi pi-calendar"></i>
                  <label class="text-sm">생년월일 <span class="text-red-500">*</span></label>
                </div>
                <DatePicker
                  v-model="basicInfo.birth"
                  dateFormat="yy.mm.dd"
                  placeholder="생년월일을 선택해주세요"
                  class="w-full"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <i class="pi pi-user"></i>
                  <label class="text-sm">성별 <span class="text-red-500">*</span></label>
                </div>
                <Select
                  class="w-full"
                  v-model="basicInfo.gender"
                  :options="genders"
                  optionLabel="name"
                  placeholder="성별"
                  checkmark
                  highlightOnSelect
                />
              </div>
            </div>

            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-envelope"></i>
                <label class="text-sm">이메일 <span class="text-red-500">*</span></label>
              </div>
              <InputText v-model="basicInfo.email" placeholder="이메일을 입력해주세요" class="w-full notranslate" />
            </div>

            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-phone"></i>
                <label class="text-sm">전화번호 <span class="text-red-500">*</span></label>
              </div>
              <InputText v-model="basicInfo.mobile" placeholder="전화번호를 입력해주세요" class="w-full" />
            </div>

            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-map-marker"></i>
                <label class="text-sm">주소 <span class="text-red-500">*</span></label>
              </div>
              <InputText v-model="basicInfo.address" placeholder="주소를 입력해주세요" class="w-full" />
            </div>

            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-file"></i>
                <label class="text-sm">범죄 여부<span class="text-red-500">*</span></label>
              </div>
              <!-- 범죄 여부 선택 -->
              <div class="flex gap-4 mb-3">
                <div v-for="option in criminalRecordOptions" :key="option.code" class="flex items-center gap-2">
                  <RadioButton
                    v-model="basicInfo.hasCriminalRecord"
                    :value="option.code"
                    :inputId="'criminalRecord_' + option.code"
                  />
                  <label :for="'criminalRecord_' + option.code">{{ option.name }}</label>
                </div>
              </div>

              <!-- 필요 서류 안내 -->
              <div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-3">
                <p class="font-medium mb-2">제출 가능한 서류:</p>
                <ul class="list-disc pl-5 space-y-1">
                  <li>범죄경력회보서</li>
                  <li>범죄경력증명서</li>
                  <li>신원보증서</li>
                  <li>신원진술서</li>
                </ul>
                <p class="mt-2 text-xs text-gray-500">* 발급일로부터 3개월 이내의 서류만 유효합니다.</p>
              </div>

              <!-- 파일 업로드 영역 -->
              <div class="border rounded-lg p-4">
                <div v-if="!basicInfo.criminalRecordFileId" class="flex flex-col items-center gap-2">
                  <label class="cursor-pointer text-center">
                    <input type="file" accept=".pdf,image/*" class="hidden" @change="handleCriminalRecordUpload" />
                    <i class="pi pi-upload text-2xl text-gray-400"></i>
                    <p class="text-sm text-gray-600">클릭하여 파일 업로드</p>
                    <p class="text-xs text-gray-400">PDF, JPG, PNG 형식 (10MB 이하)</p>
                  </label>
                </div>
                <div v-else class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">{{
                    basicInfo.criminalRecordFile?.name || '범죄기록서류 : 제출완료'
                  }}</span>
                  <button
                    v-if="basicInfo.criminalRecordFile?.name"
                    class="text-red-500 hover:text-red-600"
                    @click="removeCriminalRecord"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-globe"></i>
                <label class="text-sm">한국 방문 경험</label>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox v-model="basicInfo.hasVisitedKorea" :binary="true" />
                <span>한국에 방문한 적이 있습니다.</span>
              </div>
            </div>

            <div class="flex-grow">
              <div class="flex items-center gap-2 mb-1">
                <i class="pi pi-heart"></i>
                <label class="text-sm">혼인사항</label>
              </div>
              <Select
                v-model="basicInfo.isMarried"
                :options="maritalStatuses"
                optionLabel="name"
                optionValue="code"
                placeholder="혼인사항 선택"
                checkmark
                class="w-full"
              />
            </div>

            <div class="flex gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <i class="pi pi-comment"></i>
                  <label class="text-sm">한국어 실력</label>
                </div>
                <Select
                  v-model="basicInfo.koreanProficiencyCd"
                  :options="koreanLevels"
                  optionLabel="name"
                  optionValue="code"
                  placeholder="한국어 실력 선택"
                  checkmark
                  class="w-full"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <i class="pi pi-clock"></i>
                  <label class="text-sm">한국어 학습 기간</label>
                </div>
                <InputText v-model="basicInfo.koreanStudyPeriod" placeholder="예: 2년 3개월" class="w-full" />
              </div>
            </div>
            <!-- 버튼 영역 -->
            <div class="px-8 py-6 bg-gray-50 border-t flex justify-center gap-4">
              <Button
                label="취소"
                class="bt_btn secondary p-button-secondary px-6 hover:bg-gray-100"
                @click="cancelEdit"
              />
              <Button
                class="bt_btn primary p-button-primary px-6 bg-gradient-to-r from-[#8FA1FF] to-[#8B8BF5] border-none hover:bg-gradient-to-r hover:from-[#7B8FFF] hover:to-[#7878F2]"
                label="저장"
                @click="saveAll"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 비밀번호 수정 모달 -->
  <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[400px]">
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-bold">비밀번호 수정</h2>
        <button @click="closePasswordModal" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">현재 비밀번호</label>
          <InputText
            v-model="passwordInfo.currentPassword"
            type="password"
            class="w-full"
            placeholder="현재 비밀번호 입력"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">새 비밀번호</label>
          <InputText v-model="passwordInfo.newPassword" type="password" class="w-full" placeholder="새 비밀번호 입력" />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
          <InputText
            v-model="passwordInfo.confirmPassword"
            type="password"
            class="w-full"
            placeholder="새 비밀번호 확인"
          />
        </div>
      </div>

      <div class="p-6 border-t bg-gray-50 flex justify-center">
        <Button label="변경하기" class="bt_btn primary w-full" @click="updatePassword" />
      </div>
    </div>
  </div>
</template>
