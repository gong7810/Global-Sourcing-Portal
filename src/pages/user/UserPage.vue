<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMessagePop } from '@/plugins/commonutils';
import { useUserStore } from '@/store/user/userStore';

const router = useRouter();
const messagePop = useMessagePop();
const userStore = useUserStore();

const basicInfo = ref({
  name: '최예지',
  birthDate: '1996.09.01',
  gender: { label: '여성', value: 'female' },
  email: 'yeji@naver.com',
  phone: '010-1234-7496',
  address: '윙스타워 505호',
  profileImage: '',
  userId: 'yeji123',
  isSocialLogin: true // 소셜로그인이 아니면 false
});

const genders = [
  { label: '남성', value: 'male' },
  { label: '여성', value: 'female' }
];

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
    onCloseYes: () => {
      // API 호출 후 성공 시
      messagePop.alert('비밀번호가 변경되었습니다.', 'good');
      closePasswordModal();
    }
  });
};

onMounted(() => {
  // TODO: 내 정보 조회 api
  // const body = {
  //   id: user.id
  // }
  // basicInfo.value = response

  // store에 저장된 이미지가 있다면 사용
  if (userStore.profileImage) {
    basicInfo.value.profileImage = userStore.profileImage;
  }
});

const cancelEdit = () => {
  console.log(basicInfo.value.gender);
  messagePop.confirm({
    message: '변경사항이 저장되지 않습니다. 취소하시겠습니까?',
    onCloseYes: () => {
      router.back();
    }
  });
};

const saveAll = () => {
  messagePop.confirm({
    message: '변경사항을 저장하시겠습니까?',
    onCloseYes: () => {
      // TODO: 내 정보 수정 api
      // const body = {
      //   id: user.id,
      //   userInfo: basicInfo.value
      // }
      messagePop.alert('저장되었습니다.', 'good');
      router.back();
    }
  });
};

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 크기 체크 (3MB)
    if (file.size > 3 * 1024 * 1024) {
      messagePop.toast('파일 크기는 3MB 이하여야 합니다.', 'warn');
      return;
    }

    // 파일 형식 체크
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      messagePop.toast('JPG 또는 PNG 형식의 이미지만 업로드 가능합니다.', 'warn');
      return;
    }

    // 이미지 크기 체크
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (Math.abs(img.width / img.height - 3/4) > 0.1) {
        messagePop.confirm({
          message: '이미지의 비율이 3:4와 다릅니다. 계속하시겠습니까?',
          onCloseYes: () => {
            const imageUrl = URL.createObjectURL(file);
            basicInfo.value.profileImage = imageUrl;
            userStore.updateProfileImage(imageUrl); // store 업데이트
            // TODO: 이미지 업로드 API 호출
          }
        });
      } else {
        const imageUrl = URL.createObjectURL(file);
        basicInfo.value.profileImage = imageUrl;
        userStore.updateProfileImage(imageUrl); // store 업데이트
        // TODO: 이미지 업로드 API 호출
      }
    };
    img.src = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  basicInfo.value.profileImage = '';
  userStore.updateProfileImage(''); // store 업데이트
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
              <Button 
                label="수정" 
                class="p-button-text p-button-sm text-[#8FA1FF]" 
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
          </div>
          <div class="mb-6 flex flex-col items-center">
            <div class="relative w-[120px] h-[160px] mb-4">
              <img
                :src="basicInfo.profileImage || '/default-profile.png'"
                alt="프로필 이미지"
                class="w-full h-full object-cover border border-gray-200 rounded-sm"
              />
              <div class="absolute bottom-0 right-0">
                <label class="cursor-pointer bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleImageUpload"
                  />
                  <i class="pi pi-camera text-gray-600"></i>
                </label>
              </div>
              <button
                v-if="basicInfo.profileImage"
                @click="removeImage"
                class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
            <div class="text-center space-y-1">
              <p class="text-sm text-gray-700 font-medium">증명사진 규격 (3x4)</p>
              <p class="text-xs text-gray-500">
                - 이미지 크기: 120px x 160px (권장)<br/>
                - 파일 형식: JPG, PNG<br/>
                - 파일 크기: 3MB 이하
              </p>
            </div>
          </div>
          <div class="space-y-4 text-gray-600">
            <div class="flex items-center gap-4">
              <i class="pi pi-user"></i>
              <InputText v-model="basicInfo.name" placeholder="이름을 입력해주세요" class="w-full" />
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-calendar"></i>
              <DatePicker
                v-model="basicInfo.birthDate"
                format="yyyy-MM-dd"
                placeholder="생년월일을 선택해주세요"
                class="w-32"
              />
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
            <div class="flex items-center gap-4">
              <i class="pi pi-envelope"></i>
              <InputText v-model="basicInfo.email" placeholder="이메일을 입력해주세요" class="w-full notranslate" />
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-phone"></i>
              <InputText v-model="basicInfo.phone" placeholder="전화번호를 입력해주세요" class="w-full" />
            </div>
            <div class="flex items-center gap-4">
              <i class="pi pi-map-marker"></i>
              <InputText v-model="basicInfo.address" placeholder="주소를 입력해주세요" class="w-full" />
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
          <InputText 
            v-model="passwordInfo.newPassword" 
            type="password" 
            class="w-full" 
            placeholder="새 비밀번호 입력"
          />
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
