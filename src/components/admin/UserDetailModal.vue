<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  user: Object
});

const emit = defineEmits(['close', 'update', 'delete']);

const isEditMode = ref(false);
const editedUser = ref({});

// 권한 옵션 수정
const roleOptions = [
  { label: 'USER', value: 'ROLE_USER' },
  { label: 'MANAGER', value: 'ROLE_MANAGER' },
  { label: 'ADMIN', value: 'ROLE_ADMIN' }
];

// 성별 옵션은 그대로 유지
const genderOptions = [
  { label: '남', value: 'GENDER_MALE' },
  { label: '여', value: 'GENDER_FEMALE' }
];

// 프로필 이미지 관련 상태 추가
const profileImage = ref(null);
const imagePreview = ref(null);

// 파일 선택 처리
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
      // 실제로는 여기서 이미지를 서버에 업로드하고 URL을 받아와야 함
    };
    reader.readAsDataURL(file);

    // 모의 업로드 성공 메시지
    setTimeout(() => {
      toast.add({
        severity: 'success',
        summary: '업로드 완료',
        detail: '프로필 이미지가 업데이트되었습니다.',
        life: 3000
      });
    }, 500);
  }
};

// 이미지 제거
const removeImage = () => {
  imagePreview.value = null;
  profileImage.value = null;
};

// 사용자 정보가 변경될 때마다 편집용 객체 초기화
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      // console.log('New User:', newUser); // 디버깅용

      // 권한과 성별 데이터 추출
      let roleValue = '';
      let genderValue = '';

      // 권한 데이터 추출
      if (newUser.roleCd) {
        roleValue = newUser.roleCd;
      } else if (newUser.role && typeof newUser.role === 'object' && newUser.role.code) {
        roleValue = newUser.role.code;
      } else if (newUser.role) {
        roleValue = newUser.role;
      }

      // 성별 데이터 추출
      if (newUser.genderCd) {
        genderValue = newUser.genderCd;
      } else if (newUser.gender && typeof newUser.gender === 'object' && newUser.gender.code) {
        genderValue = newUser.gender.code;
      } else if (newUser.gender) {
        genderValue = newUser.gender;
      }

      // 기본 정보 복사
      editedUser.value = {
        ...newUser,
        birthDate: newUser.birth || newUser.birthDate || '',
        role: roleValue,
        gender: genderValue,
        active: newUser.enabled || false,
        employer: newUser.isCompany || false,
        mobile: newUser.mobile || '',
        email: newUser.email || '',
        name: newUser.name || '',
        loginId: newUser.loginId || ''
      };
      // console.log('Initialized editedUser:', editedUser.value); // 디버깅용

      // 이미지 설정
      imagePreview.value = newUser.profileImage || null;
    }
  },
  { immediate: true }
);

// 모달이 닫힐 때 편집 모드 초기화
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      isEditMode.value = false;
    }
  }
);

const toggleEditMode = () => {
  if (isEditMode.value) {
    // 편집 모드가 끝날 때 (저장 버튼 클릭)
    // 업데이트할 데이터 준비
    const updatedData = {
      id: editedUser.value.id,
      loginId: editedUser.value.loginId,
      name: editedUser.value.name,
      birthDate: editedUser.value.birthDate,
      mobile: editedUser.value.mobile,
      email: editedUser.value.email,
      role: editedUser.value.role,
      gender: editedUser.value.gender,
      isCompany: editedUser.value.employer,
      enabled: editedUser.value.active,
      profileImage: imagePreview.value
    };
    // console.log('Updated Data:', updatedData); // 디버깅용
    // console.log('Original editedUser:', editedUser.value); // 디버깅용
    emit('update', updatedData);
    isEditMode.value = false; // 편집 모드만 종료
  } else {
    isEditMode.value = true;
  }
};

const cancelEdit = () => {
  isEditMode.value = false;

  // 권한과 성별 데이터 추출
  let roleValue = '';
  let genderValue = '';

  // 권한 데이터 추출
  if (props.user.roleCd) {
    roleValue = props.user.roleCd;
  } else if (props.user.role && typeof props.user.role === 'object' && props.user.role.code) {
    roleValue = props.user.role.code;
  } else if (props.user.role) {
    roleValue = props.user.role;
  }

  // 성별 데이터 추출
  if (props.user.genderCd) {
    genderValue = props.user.genderCd;
  } else if (props.user.gender && typeof props.user.gender === 'object' && props.user.gender.code) {
    genderValue = props.user.gender.code;
  } else if (props.user.gender) {
    genderValue = props.user.gender;
  }

  // 원본 데이터로 복원
  editedUser.value = {
    ...props.user,
    birthDate: props.user.birth || props.user.birthDate || '',
    role: roleValue,
    gender: genderValue,
    active: props.user.enabled || false,
    employer: props.user.isCompany || false,
    mobile: props.user.mobile || '',
    email: props.user.email || '',
    name: props.user.name || '',
    loginId: props.user.loginId || ''
  };
};

const closeModal = () => {
  isEditMode.value = false;
  emit('close');
};

const handleDelete = () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    emit('delete', props.user.id);
  }
};

// 권한 레이블 변환 함수 수정
const getRoleLabel = (role) => {
  if (!role) return '-';
  if (typeof role === 'object' && role.name) {
    return role.name;
  }
  // 코드 값을 레이블로 변환
  const roleMap = {
    ROLE_USER: 'USER',
    ROLE_MANAGER: 'MANAGER',
    ROLE_ADMIN: 'ADMIN',
    User: 'USER',
    Manager: 'MANAGER',
    Admin: 'ADMIN'
  };
  return roleMap[role] || role;
};

// 성별 레이블 변환 함수 수정
const getGenderLabel = (gender) => {
  if (!gender) return '-';
  if (typeof gender === 'object' && gender.name) {
    return gender.name;
  }
  // 코드 값을 레이블로 변환
  const genderMap = {
    GENDER_MALE: '남',
    GENDER_FEMALE: '여',
    Male: '남',
    Female: '여'
  };
  return genderMap[gender] || gender;
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>사용자 정보</h2>
        <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="closeModal" />
      </div>
      <div class="modal-body">
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

                    <div v-if="isEditMode" class="image-actions">
                      <label class="upload-button">
                        <input type="file" accept="image/*" @change="handleFileSelect" class="hidden" />
                        <span>이미지 {{ imagePreview ? '변경' : '업로드' }}</span>
                      </label>
                      <Button
                        v-if="imagePreview"
                        icon="pi pi-trash"
                        class="p-button-danger p-button-text"
                        @click="removeImage"
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th>로그인 ID</th>
                <td>{{ user?.loginId }}</td>
              </tr>
              <tr>
                <th>이름</th>
                <td>
                  <template v-if="isEditMode">
                    <InputText v-model="editedUser.name" class="w-full" />
                  </template>
                  <template v-else>{{ user?.name }}</template>
                </td>
              </tr>
              <tr>
                <th>생년월일</th>
                <td>
                  <template v-if="isEditMode">
                    <InputText v-model="editedUser.birthDate" class="w-full" />
                  </template>
                  <template v-else>{{ user?.birthDate || '001212' }}</template>
                </td>
              </tr>
              <tr>
                <th>모바일</th>
                <td>
                  <template v-if="isEditMode">
                    <InputText v-model="editedUser.mobile" class="w-full" />
                  </template>
                  <template v-else>{{ user?.mobile }}</template>
                </td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>
                  <template v-if="isEditMode">
                    <InputText v-model="editedUser.email" class="w-full" />
                  </template>
                  <template v-else>{{ user?.email }}</template>
                </td>
              </tr>
              <tr>
                <th>권한</th>
                <td>
                  <template v-if="isEditMode">
                    <select v-model="editedUser.role" class="w-full p-2 border rounded">
                      <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </template>
                  <template v-else>{{ getRoleLabel(user?.role) }}</template>
                </td>
              </tr>
              <tr>
                <th>성별</th>
                <td>
                  <template v-if="isEditMode">
                    <select v-model="editedUser.gender" class="w-full p-2 border rounded">
                      <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </template>
                  <template v-else>{{ getGenderLabel(user?.gender) }}</template>
                </td>
              </tr>
              <tr>
                <th>고용주 여부</th>
                <td>
                  <template v-if="isEditMode">
                    <InputSwitch v-model="editedUser.employer" class="custom-switch" />
                  </template>
                  <template v-else>
                    {{ user?.isCompany ? '예' : '아니오' }}
                  </template>
                </td>
              </tr>
              <tr>
                <th>활성여부</th>
                <td>
                  <template v-if="isEditMode">
                    <InputSwitch v-model="editedUser.active" class="custom-switch" />
                  </template>
                  <template v-else>
                    {{ user?.enabled ? '활성' : '비활성' }}
                  </template>
                </td>
              </tr>
              <tr>
                <th>최근 로그인</th>
                <td>{{ user?.lastLoginAt || '-' }}</td>
              </tr>
              <tr>
                <th>생성일시</th>
                <td>{{ user?.createdAt }}</td>
              </tr>
              <tr>
                <th>수정일시</th>
                <td>{{ user?.updatedAt || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <template v-if="isEditMode">
          <Button
            label="취소"
            class="p-button-text"
            @click="
              () => {
                // console.log('취소 버튼 클릭');
                cancelEdit();
              }
            "
          />
          <Button
            label="저장"
            class="p-button-primary"
            @click="
              () => {
                // console.log('저장 버튼 클릭');
                toggleEditMode();
              }
            "
          />
        </template>
        <template v-else>
          <Button
            label="닫기"
            class="p-button-text"
            @click="
              () => {
                // console.log('닫기 버튼 클릭');
                closeModal();
              }
            "
          />
          <Button
            label="편집"
            class="p-button-primary"
            @click="
              () => {
                toggleEditMode();
              }
            "
          />
          <Button
            label="삭제"
            class="p-button-danger"
            @click="
              () => {
                handleDelete();
              }
            "
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1100;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background-color: white;

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

      .p-dropdown-label {
        padding: 0.5rem;
      }

      .p-dropdown-panel {
        z-index: 1200;
      }

      &.p-dropdown-clearable .p-dropdown-label {
        padding-right: 2rem;
      }

      .p-dropdown-trigger {
        width: 2.5rem;
      }
    }

    :deep(.p-dropdown-panel) {
      background: #ffffff;
      border: 1px solid #ced4da;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    :deep(.p-dropdown-items) {
      padding: 0.5rem 0;
    }

    :deep(.p-dropdown-item) {
      padding: 0.5rem 1rem;
      margin: 0;
      cursor: pointer;

      &:hover {
        background-color: #f3f4f6;
      }
    }

    :deep(.p-select) {
      width: 100%;

      .p-select-label {
        padding: 0.5rem;
      }
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
        width: 120px; // 증명사진 비율 (3:4)
        height: 160px;
        border-radius: 0; // 둥근 모서리 제거
        object-fit: cover;
        border: 1px solid #e5e7eb; // 테두리 스타일 변경
        background-color: white;
      }

      .profile-placeholder {
        width: 120px;
        height: 160px;
        border-radius: 0; // 둥근 모서리 제거
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

:deep(.p-dropdown-panel) {
  z-index: 1200 !important;
}

:deep(.p-select-panel) {
  z-index: 1200 !important;
}
</style>
