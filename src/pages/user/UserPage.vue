<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { useMessagePop } from '@/plugins/commonutils';
import { useUserStore } from '@/store/user/userStore';
import { fileUpload, getGenderList } from '@/apis/common/commonApis';
import { getAccount, resetPassword, updateAccount } from '@/apis/auth/authApis';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const messagePop = useMessagePop();

const { userInfo } = storeToRefs(authStore);

const basicInfo = ref({});
// {
//   name: '최예지',
//   birth: '1996.09.01',
//   gender: { label: '여성', value: 'GENDER_FEMALE' },
//   email: 'yeji@naver.com',
//   mobile: '010-1234-7496',
//   address: '윙스타워 505호',
//   userId: 'yeji123',
//   isSocialLogin: true,
//   visitedKorea: false,
//   maritalStatus: null,
//   koreanLevel: null,
//   koreanStudyPeriod: ''
// }

const genders = ref([]);

const profileImage = ref(null);
const profileRawData = ref();
const criminalRecordFile = ref(null);

const maritalStatuses = [
  { label: '미혼', value: 'single' },
  { label: '기혼', value: 'married' }
];

const koreanLevels = [
  { label: '초급', value: 'beginner' },
  { label: '중급', value: 'intermediate' },
  { label: '고급', value: 'advanced' },
  { label: '원어민 수준', value: 'native' }
];

onMounted(() => {
  setGenderList();

  setAccountInfo();
});

// 성별 세팅
const setGenderList = async () => {
  const response = await getGenderList();

  response.map((item) => {
    genders.value.push({ label: `${item.name}성`, value: item.code });
  });
};

// 내 정보 세팅
const setAccountInfo = async () => {
  const response = await getAccount();

  basicInfo.value = response;

  basicInfo.value.gender = {
    label: `${basicInfo.value.gender.name}성`,
    value: basicInfo.value.gender.code
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

  // TODO: 비밀번호 변경 API 호출
  messagePop.confirm({
    message: '비밀번호를 변경하시겠습니까?',
    onCloseYes: async () => {
      const body = {
        password: passwordInfo.value.newPassword
      };

      const response = await resetPassword(body);

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
  console.log(basicInfo.value.gender);
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
  // if (!basicInfo.value.address) {
  //   messagePop.toast('주소를 입력해주세요.', 'warn');
  //   return;
  // }
  // if (!basicInfo.value.criminalRecordFile) {
  //   messagePop.toast('범죄경력 확인서를 업로드해주세요.', 'warn');
  //   return;
  // }

  messagePop.confirm({
    message: '변경사항을 저장하시겠습니까?',
    onCloseYes: async () => {
      let body = { ...basicInfo.value };

      console.log(profileRawData.value);
      // 프로필 사진 수정 or 저장
      if (profileRawData.value) {
        const formData = saveImage();

        const res = await fileUpload(formData);

        body = { ...basicInfo.value, profileImage: res?.id };
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
const saveImage = () => {
  const formData = new FormData();
  formData.append('file', profileRawData.value);

  return formData;
};

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

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
            userStore.updateProfileImage(imageUrl); // store 업데이트
            // TODO: 이미지 업로드 API 호출
          }
        });
      } else {
        const imageUrl = URL.createObjectURL(profileRawData.value);
        console.log(imageUrl);
        profileImage.value = imageUrl;
        userStore.updateProfileImage(imageUrl); // store 업데이트
        // TODO: 이미지 업로드 API 호출
      }
    };

    img.src = URL.createObjectURL(profileRawData.value);
  }
};

const removeImage = () => {
  profileImage.value = '';
  profileRawData.value = '';
  userStore.updateProfileImage(''); // store 업데이트
};

const handleCriminalRecordUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      messagePop.toast('파일 크기는 10MB 이하여야 합니다.', 'warn');
      return;
    }

    // 파일 형식 체크
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      messagePop.toast('PDF, JPG 또는 PNG 형식의 파일만 업로드 가능합니다.', 'warn');
      return;
    }

    basicInfo.value.criminalRecordFile = file;
    // TODO: 파일 업로드 API 호출
  }
};

const removeCriminalRecord = () => {
  basicInfo.value.criminalRecordFile = null;
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
        <div class="bg-white rounded-lg p-6 mb-6" v-if="!basicInfo.isSocialLogin">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">계정 정보</h2>
          </div>
          <div class="space-y-4 text-gray-600">
            <div class="flex items-center gap-4">
              <i class="pi pi-id-card"></i>
              <span class="w-20 text-gray-500">아이디</span>
              <span>{{ basicInfo.userId }}</span>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-lock"></i>
              <span class="w-20 text-gray-500">비밀번호</span>
              <Button label="수정" class="p-button-text p-button-sm text-[#8FA1FF]" @click="openPasswordModal" />
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
                :src="profileImage || '/default-profile.png'"
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
            <div class="flex items-center gap-4">
              <i class="pi pi-user"></i>
              <div class="flex-grow">
                <label class="flex items-center gap-1 mb-1 text-sm"> 이름 <span class="text-red-500">*</span> </label>
                <InputText v-model="basicInfo.name" placeholder="이름을 입력해주세요" class="w-full" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-calendar"></i>
              <div class="flex gap-4">
                <div>
                  <label class="flex items-center gap-1 mb-1 text-sm">
                    생년월일 <span class="text-red-500">*</span>
                  </label>
                  <DatePicker
                    v-model="basicInfo.birth"
                    dateFormat="yymmdd"
                    placeholder="생년월일을 선택해주세요"
                    class="w-32"
                  />
                </div>
                <div>
                  <label class="flex items-center gap-1 mb-1 text-sm"> 성별 <span class="text-red-500">*</span> </label>
                  <Select
                    class="w-32"
                    v-model="basicInfo.gender"
                    :options="genders"
                    optionLabel="label"
                    placeholder="성별"
                    checkmark
                    highlightOnSelect
                  />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-envelope"></i>
              <div class="flex-grow">
                <label class="flex items-center gap-1 mb-1 text-sm"> 이메일 <span class="text-red-500">*</span> </label>
                <InputText v-model="basicInfo.email" placeholder="이메일을 입력해주세요" class="w-full notranslate" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-phone"></i>
              <div class="flex-grow">
                <label class="flex items-center gap-1 mb-1 text-sm">
                  전화번호 <span class="text-red-500">*</span>
                </label>
                <InputText v-model="basicInfo.mobile" placeholder="전화번호를 입력해주세요" class="w-full" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-map-marker"></i>
              <div class="flex-grow">
                <label class="flex items-center gap-1 mb-1 text-sm"> 주소 <span class="text-red-500">*</span> </label>
                <InputText v-model="basicInfo.address" placeholder="주소를 입력해주세요" class="w-full" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-file"></i>
              <div class="flex-grow">
                <label class="flex items-center gap-1 mb-1 text-sm">
                  범죄경력 확인서 <span class="text-red-500">*</span>
                </label>
                <div class="border rounded-lg p-4">
                  <div v-if="!basicInfo.criminalRecordFile" class="flex flex-col items-center gap-2">
                    <label class="cursor-pointer text-center">
                      <input type="file" accept=".pdf,image/*" class="hidden" @change="handleCriminalRecordUpload" />
                      <i class="pi pi-upload text-2xl text-gray-400"></i>
                      <p class="text-sm text-gray-600">클릭하여 파일 업로드</p>
                      <p class="text-xs text-gray-400">(신원조회서, 범죄경력회보서, 범죄경력 사실 없음 확인서 등)</p>
                    </label>
                  </div>
                  <div v-else class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">{{ basicInfo.criminalRecordFile.name }}</span>
                    <button @click="removeCriminalRecord" class="text-red-500 hover:text-red-600">
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-globe"></i>
              <div class="flex-grow">
                <label class="mb-1 text-sm">한국 방문 경험</label>
                <div class="flex items-center gap-2">
                  <Checkbox v-model="basicInfo.visitedKorea" :binary="true" />
                  <span>한국에 방문한 적이 있습니다.</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-heart"></i>
              <div class="flex-grow">
                <label class="mb-1 text-sm">혼인사항</label>
                <Select
                  v-model="basicInfo.maritalStatus"
                  :options="maritalStatuses"
                  optionLabel="label"
                  placeholder="혼인사항 선택"
                  class="w-full"
                />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-comment"></i>
              <div class="flex gap-4 flex-grow">
                <div class="flex-1">
                  <label class="mb-1 text-sm">한국어 실력</label>
                  <Select
                    v-model="basicInfo.koreanLevel"
                    :options="koreanLevels"
                    optionLabel="label"
                    placeholder="한국어 실력 선택"
                    class="w-full"
                  />
                </div>
                <div class="flex-1">
                  <label class="mb-1 text-sm">한국어 학습 기간</label>
                  <InputText v-model="basicInfo.koreanStudyPeriod" placeholder="예: 2년 3개월" class="w-full" />
                </div>
              </div>
            </div>
            <!-- 버튼 영역 -->
            <div class="px-8 py-6 bg-gray-50 border-t flex justify-center gap-4">
              <Button label="취소" class="p-button-secondary px-6 hover:bg-gray-100" @click="cancelEdit" />
              <Button
                label="저장"
                class="p-button-primary px-6 bg-gradient-to-r from-[#8FA1FF] to-[#8B8BF5] border-none hover:bg-gradient-to-r hover:from-[#7B8FFF] hover:to-[#7878F2]"
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
        <Button label="변경하기" class="w-full" @click="updatePassword" />
      </div>
    </div>
  </div>
</template>
