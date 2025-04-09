<script setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { createUser } from '@/apis/admin/adminApis';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close', 'created']);

const toast = useToast();
const dialogVisible = ref(false);

// 권한 옵션
const roleOptions = [
  { label: 'User', value: 'ROLE_USER' },
  { label: 'Manager', value: 'ROLE_MANAGER' },
  { label: 'Admin', value: 'ROLE_ADMIN' }
];

// 성별 옵션
const genderOptions = [
  { label: '남성', value: 'MALE' },
  { label: '여성', value: 'FEMALE' }
];

// 새 사용자 데이터
const newUser = ref({
  loginId: '',
  name: '',
  mobile: '',
  email: '',
  password: '',
  birthDate: '',
  role: 'ROLE_USER',
  gender: '',
  isCompany: false,
  enabled: true,
  profileImage: null
});

// 이미지 업로드 관련 상태
const uploadedFile = ref(null);
const imagePreview = ref(null);

// 이미지 업로드 핸들러
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedFile.value = file;
    newUser.value.profileImage = file;
    
    // 이미지 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 이미지 삭제 핸들러
const handleImageDelete = () => {
  uploadedFile.value = null;
  imagePreview.value = null;
  newUser.value.profileImage = null;
};

// 사용자 생성 핸들러
const handleCreateUser = async () => {
  try {
    await createUser(newUser.value);
    emit('created');
    closeModal();
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '사용자가 추가되었습니다.',
      life: 3000
    });
  } catch (error) {
    console.error('사용자 추가 실패:', error);
    toast.add({
      severity: 'error',
      summary: '실패',
      detail: '사용자 추가 중 오류가 발생했습니다.',
      life: 3000
    });
  }
};

// 모달 닫기
const closeModal = () => {
  // 입력 필드 초기화
  newUser.value = {
    loginId: '',
    name: '',
    mobile: '',
    email: '',
    password: '',
    birthDate: '',
    role: 'ROLE_USER',
    gender: '',
    isCompany: false,
    enabled: true,
    profileImage: null
  };
  uploadedFile.value = null;
  imagePreview.value = null;
  dialogVisible.value = false;
  emit('close');
};

// isOpen prop이 변경될 때 dialogVisible 동기화
watch(
  () => props.isOpen,
  (newValue) => {
    dialogVisible.value = newValue;
  },
  { immediate: true }
);

// dialogVisible이 변경될 때 isOpen prop 업데이트
watch(
  () => dialogVisible.value,
  (newValue) => {
    if (!newValue) {
      closeModal();
    }
  }
);
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    header="사용자 추가"
    :style="{ width: '600px' }"
    :closable="false"
    :draggable="false"
    :resizable="false"
    class="user-detail-dialog"
  >
    <div class="user-info">
      <table class="info-table">
        <tbody>
          <tr>
            <th colspan="2" class="section-header">프로필 이미지</th>
          </tr>
          <tr>
            <td colspan="2" class="profile-cell">
              <div class="profile-image-container">
                <img v-if="imagePreview" :src="imagePreview" class="profile-image" alt="프로필 이미지" />
                <div v-else class="profile-placeholder">
                  <i class="pi pi-user"></i>
                </div>

                <div class="image-actions">
                  <label class="upload-button">
                    <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
                    <span>이미지 {{ imagePreview ? '변경' : '업로드' }}</span>
                  </label>
                  <Button
                    v-if="imagePreview"
                    icon="pi pi-trash"
                    class="p-button-danger p-button-text"
                    @click="handleImageDelete"
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>로그인 ID</th>
            <td>
              <InputText v-model="newUser.loginId" class="w-full" required />
            </td>
          </tr>
          <tr>
            <th>이름</th>
            <td>
              <InputText v-model="newUser.name" class="w-full" required />
            </td>
          </tr>
          <tr>
            <th>모바일</th>
            <td>
              <InputText v-model="newUser.mobile" class="w-full" />
            </td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>
              <InputText v-model="newUser.email" class="w-full" />
            </td>
          </tr>
          <tr>
            <th>비밀번호</th>
            <td>
              <InputText v-model="newUser.password" type="password" class="w-full" required />
            </td>
          </tr>
          <tr>
            <th>생년월일</th>
            <td>
              <Calendar 
                v-model="newUser.birthDate" 
                dateFormat="yy-mm-dd" 
                showIcon 
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <th>권한</th>
            <td>
              <Dropdown 
                v-model="newUser.role" 
                :options="roleOptions" 
                optionLabel="label" 
                optionValue="value"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <th>성별</th>
            <td>
              <Dropdown 
                v-model="newUser.gender" 
                :options="genderOptions" 
                optionLabel="label" 
                optionValue="value"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <th>고용주 여부</th>
            <td>
              <InputSwitch v-model="newUser.isCompany" class="custom-switch" />
            </td>
          </tr>
          <tr>
            <th>활성여부</th>
            <td>
              <InputSwitch v-model="newUser.enabled" class="custom-switch" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <template #footer>
      <Button label="취소" icon="pi pi-times" class="p-button-text" @click="closeModal" />
      <Button label="추가" icon="pi pi-check" class="p-button-primary" @click="handleCreateUser" />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped>
.user-detail-dialog {
  :deep(.p-dialog-content) {
    padding: 1.5rem;
    overflow-y: auto;
  }

  :deep(.p-dialog-header) {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  :deep(.p-dialog-footer) {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
}

.info-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    width: 120px;
    background-color: #f8f9fa;
    font-weight: 500;
  }

  td {
    :deep(.p-inputtext),
    :deep(.p-dropdown) {
      width: 100%;
      height: 2.5rem;
    }

    :deep(.p-dropdown) {
      width: 100%;
      min-height: 2.5rem;
    }

    :deep(.custom-switch) {
      .p-inputswitch-slider {
        background-color: #e5e7eb;
      }

      &.p-inputswitch-checked {
        .p-inputswitch-slider {
          background-color: #8b8bf5;
        }
      }
    }
  }

  .section-header {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  .profile-cell {
    padding: 1.5rem;
    text-align: center;
    background-color: #f8f9fa;

    .profile-image-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      .profile-image {
        width: 120px;
        height: 160px;
        border-radius: 0;
        object-fit: cover;
        border: 1px solid #e5e7eb;
        background-color: white;
      }

      .profile-placeholder {
        width: 120px;
        height: 160px;
        border-radius: 0;
        background-color: #f3f4f6;
        border: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 3rem;
          color: #9ca3af;
        }
      }

      .image-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-top: 0.5rem;

        .upload-button {
          background-color: #8b8bf5;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;

          &:hover {
            background-color: #7070f4;
          }

          input[type='file'] {
            display: none;
          }
        }
      }
    }
  }
}

:deep(.p-button) {
  &.p-button-text {
    color: #6b7280;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  &.p-button-primary {
    background-color: #8b8bf5;
    border-color: #8b8bf5;

    &:hover {
      background-color: #7070f4;
      border-color: #7070f4;
    }
  }

  &.p-button-danger {
    &:hover {
      background-color: #b91c1c;
      border-color: #b91c1c;
    }
  }
}
</style> 