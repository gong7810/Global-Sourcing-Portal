<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue'; // 사이드바 컴포넌트 임포트
import UserDetailModal from '@/components/admin/UserDetailModal.vue';

const router = useRouter();
const toast = useToast();

// 사용자 상태 상수 추가
const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE'
};

// 샘플 사용자 데이터 수정
const users = ref([
  {
    id: 9,
    loginId: 'user9',
    name: '고용주9',
    mobile: '01011110000',
    email: 'user10@gmail.com',
    role: 'Admin',
    gender: '남',
    employer: 'Y',
    active: 'N',
    createdAt: '2025-03-29 13:09:21',
    updatedAt: null
  },
  {
    id: 8,
    loginId: 'user10',
    name: '구직자10',
    mobile: '01011110000',
    email: 'user3@gmail.com',
    role: null,
    gender: '남',
    employer: 'N',
    active: 'Y',
    createdAt: '2025-03-29 13:07:50',
    updatedAt: null
  },
  {
    id: 7,
    loginId: 'user6',
    name: '고용주2',
    mobile: null,
    email: null,
    role: null,
    gender: null,
    employer: 'Y',
    active: 'Y',
    createdAt: '2025-03-27 22:36:03',
    updatedAt: '2025-03-27 22:36:13'
  },
  {
    id: 6,
    loginId: 'user5',
    name: '고용주1',
    mobile: null,
    email: null,
    role: null,
    gender: null,
    employer: 'Y',
    active: 'Y',
    createdAt: '2025-03-27 22:35:57',
    updatedAt: '2025-03-27 22:36:12'
  },
  {
    id: 5,
    loginId: 'user4',
    name: '구직자3',
    mobile: '01022223333',
    email: 'user4@gmail.com',
    role: null,
    gender: '여',
    employer: 'N',
    active: 'Y',
    createdAt: '2025-03-26 14:02:20',
    updatedAt: '2025-03-28 22:15:58'
  }
]);

// 각 컬럼별 검색어 상태
const filters = ref({
  role: null,
  loginId: '',
  name: '',
  mobile: '',
  email: ''
});

// 권한 옵션 수정 - 전체 옵션 추가
const roleOptions = [
  { label: '전체', value: null }, // 전체 옵션 추가
  { label: 'User', value: 'User' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Admin', value: 'Admin' }
];

// 필터링된 사용자 목록 로직은 그대로 유지
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const roleMatch = !filters.value.role || user.role === filters.value.role;

    return (
      roleMatch &&
      (!filters.value.loginId || user.loginId?.toLowerCase().includes(filters.value.loginId.toLowerCase())) &&
      (!filters.value.name || user.name?.toLowerCase().includes(filters.value.name.toLowerCase())) &&
      (!filters.value.mobile || user.mobile?.includes(filters.value.mobile)) &&
      (!filters.value.email || user.email?.toLowerCase().includes(filters.value.email.toLowerCase()))
    );
  });
});

// 검색 핸들러
const handleSearch = () => {
  // 검색 로직 구현
  // API 호출 또는 로컬 필터링
};

// 상태 변경 모달 관련 코드 수정
const showStatusModal = ref(false);
const selectedUser = ref(null);
const statusReason = ref('');
const suspendEndDate = ref('');
const selectedNewStatus = ref(null);

const openStatusModal = (user) => {
  selectedUser.value = user;
  statusReason.value = '';
  suspendEndDate.value = '';
  selectedNewStatus.value = user.active ? USER_STATUS.ACTIVE : USER_STATUS.SUSPENDED;
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  selectedUser.value = null;
  statusReason.value = '';
  suspendEndDate.value = '';
  selectedNewStatus.value = null;
};

const selectStatus = (status) => {
  selectedNewStatus.value = status;
};

const updateUserStatus = () => {
  if (!selectedUser.value || !statusReason.value || !selectedNewStatus.value) return;

  const user = users.value.find((u) => u.id === selectedUser.value.id);
  if (user) {
    // 상태 변경 이력 추가
    user.statusHistory = user.statusHistory || [];
    user.statusHistory.unshift({
      status: selectedNewStatus.value,
      reason: statusReason.value,
      date: new Date().toISOString().split('T')[0],
      by: 'admin'
    });

    // 상태 업데이트
    user.active = selectedNewStatus.value === USER_STATUS.ACTIVE;
    if (selectedNewStatus.value === USER_STATUS.SUSPENDED) {
      user.suspendEndDate = suspendEndDate.value;
    } else {
      user.suspendEndDate = null;
    }
  }
  closeStatusModal();
};

// 상태별 스타일
const getStatusStyle = (status) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return 'bg-green-100 text-green-800';
    case USER_STATUS.SUSPENDED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 뒤로가기 함수
const goBack = () => {
  router.push('/admin');
};

// 체크박스 관련 상태 추가
const selectedUsers = ref([]);
const selectAll = ref(false);

// 전체 선택/해제 처리 함수
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = filteredUsers.value.map((user) => user.id);
  } else {
    selectedUsers.value = [];
  }
};

// 개별 체크박스 선택 시 전체 선택 상태 업데이트
const updateSelectAll = () => {
  selectAll.value = filteredUsers.value.length > 0 && selectedUsers.value.length === filteredUsers.value.length;
};

// 이미지 로드 실패 시 기본 이미지로 대체
const handleImageError = (e) => {
  e.target.src = '/default-avatar.png'; // 기본 프로필 이미지 경로
};

const showDetailModal = ref(false);

const openDetailModal = (user) => {
  selectedUser.value = user;
  showDetailModal.value = true;
};

const handleUserUpdate = async (updatedUser) => {
  try {
    // API 호출 예시
    // await axios.put(`/api/users/${updatedUser.id}`, updatedUser);

    // 임시로 로컬 데이터 업데이트
    const index = users.value.findIndex((user) => user.id === updatedUser.id);
    if (index !== -1) {
      users.value[index] = { ...updatedUser };
    }

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '사용자 정보가 업데이트되었습니다.',
      life: 3000
    });
  } catch (error) {
    console.error('사용자 업데이트 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '사용자 정보 업데이트에 실패했습니다.',
      life: 3000
    });
  }
};

// 사용자 삭제 처리
const handleUserDelete = async (userId) => {
  try {
    // 모의 삭제 처리 (0.5초 지연)
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.add({
      severity: 'success',
      summary: '삭제 완료',
      detail: '사용자가 삭제되었습니다.',
      life: 3000
    });

    // 모달 닫기
    showDetailModal.value = false;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: '삭제 실패',
      detail: '사용자 삭제 중 오류가 발생했습니다.',
      life: 3000
    });
  }
};

// 권한 표시를 위한 함수 추가
const getRoleLabel = (role) => {
  if (!role) return '-';
  const option = roleOptions.find((opt) => opt.value === role.toUpperCase());
  return option ? option.label : role;
};
</script>

<template>
  <div class="admin-layout">
    <AdminHeader />
    <AdminSidebar />

    <div class="admin-content">
      <div class="admin-user-mng-page">
        <div class="page-header">
          <div class="header-content">
            <Button icon="pi pi-arrow-left" class="p-button-text p-button-rounded" @click="goBack" />
            <h1>사용자 관리</h1>
          </div>
        </div>

        <!-- 사용자 목록 -->
        <div class="user-list">
          <!-- 검색 영역 추가 -->
          <div class="search-area">
            <div class="search-fields">
              <div class="search-field">
                <Dropdown
                  v-model="filters.role"
                  :options="roleOptions"
                  placeholder="권한"
                  class="w-full"
                  optionLabel="label"
                  optionValue="value"
                />
              </div>
              <div class="search-field">
                <InputText
                  v-model="filters.loginId"
                  type="text"
                  placeholder="로그인 ID"
                  class="w-full"
                  @keyup.enter="handleSearch"
                />
              </div>
              <div class="search-field">
                <InputText
                  v-model="filters.name"
                  type="text"
                  placeholder="이름"
                  class="w-full"
                  @keyup.enter="handleSearch"
                />
              </div>
              <div class="search-field">
                <InputText
                  v-model="filters.mobile"
                  type="text"
                  placeholder="모바일"
                  class="w-full"
                  @keyup.enter="handleSearch"
                />
              </div>
              <div class="search-field">
                <InputText
                  v-model="filters.email"
                  type="text"
                  placeholder="이메일"
                  class="w-full"
                  @keyup.enter="handleSearch"
                />
              </div>
            </div>
          </div>

          <!-- 기존 테이블 -->
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" v-model="selectAll" @change="handleSelectAll" />
                  </th>
                  <th>순번</th>
                  <th>로그인 ID</th>
                  <th>이름</th>
                  <th>모바일</th>
                  <th>이메일</th>
                  <th>권한</th>
                  <th>성별</th>
                  <th>고용주</th>
                  <th>Active</th>
                  <th>생성일시</th>
                  <th>수정일시</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(user, index) in filteredUsers"
                  :key="user.id"
                  @click="openDetailModal(user)"
                  class="cursor-pointer hover:bg-gray-50"
                >
                  <td @click.stop>
                    <input type="checkbox" v-model="selectedUsers" :value="user.id" @change="updateSelectAll" />
                  </td>
                  <td>{{ index + 1 }}</td>
                  <td>{{ user.loginId }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.mobile }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ getRoleLabel(user.role) }}</td>
                  <td>{{ user.gender }}</td>
                  <td>{{ user.employer ? 'Y' : 'N' }}</td>
                  <td>{{ user.active ? 'Y' : 'N' }}</td>
                  <td>{{ user.createdAt }}</td>
                  <td>{{ user.updatedAt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 상태 변경 모달 -->
        <div v-if="showStatusModal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h2>사용자 정보</h2>
              <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="closeStatusModal" />
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
                        <div class="profile-placeholder"></div>
                      </td>
                    </tr>
                    <tr>
                      <th>로그인 ID</th>
                      <td>{{ selectedUser?.loginId }}</td>
                    </tr>
                    <tr>
                      <th>이름</th>
                      <td>{{ selectedUser?.name }}</td>
                    </tr>
                    <tr>
                      <th>생년월일</th>
                      <td>{{ selectedUser?.birthDate || '001212' }}</td>
                    </tr>
                    <tr>
                      <th>모바일</th>
                      <td>{{ selectedUser?.mobile }}</td>
                    </tr>
                    <tr>
                      <th>이메일</th>
                      <td>{{ selectedUser?.email }}</td>
                    </tr>
                    <tr>
                      <th>권한</th>
                      <td>{{ selectedUser?.role === 'ADMIN' ? '관리자' : '일반' }}</td>
                    </tr>
                    <tr>
                      <th>성별</th>
                      <td>{{ selectedUser?.gender }}</td>
                    </tr>
                    <tr>
                      <th>고용주 여부</th>
                      <td>{{ selectedUser?.employer ? 'true' : 'false' }}</td>
                    </tr>
                    <tr>
                      <th>활성여부</th>
                      <td>{{ selectedUser?.active ? 'true' : 'false' }}</td>
                    </tr>
                    <tr>
                      <th>최근 로그인</th>
                      <td>{{ selectedUser?.lastLoginAt || '-' }}</td>
                    </tr>
                    <tr>
                      <th>생성일시</th>
                      <td>{{ selectedUser?.createdAt }}</td>
                    </tr>
                    <tr>
                      <th>수정일시</th>
                      <td>{{ selectedUser?.updatedAt || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <Button label="닫기" class="p-button-text" @click="closeStatusModal" />
              <Button label="편집" class="p-button-primary" />
              <Button label="삭제" class="p-button-danger" />
            </div>
          </div>
        </div>

        <!-- 사용자 상세 모달 -->
        <UserDetailModal
          :is-open="showDetailModal"
          :user="selectedUser"
          @close="showDetailModal = false"
          @update="handleUserUpdate"
          @delete="handleUserDelete"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  padding-top: 60px; /* 헤더 높이만큼 여백 추가 */
}

.admin-content {
  flex: 1;
  background-color: #f9fafb;
  margin-left: 250px; /* 사이드바 너비만큼 여백 */
}

.admin-user-mng-page {
  padding: 2rem;

  .page-header {
    margin-bottom: 2rem;

    .header-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      h1 {
        margin: 0;
        font-size: 1.5rem;
        color: #2c3e50;
      }

      :deep(.p-button.p-button-text) {
        color: #2c3e50;
        padding: 0.5rem;

        &:hover {
          background-color: #f3f4f6;
        }
      }
    }
  }

  .search-filter-section {
    .search-box {
      flex: 1;
      max-width: 600px; // 검색 영역 넓이 조정

      :deep(.p-inputtext) {
        height: 2.5rem;
        padding-left: 2.5rem; // 검색 아이콘을 위한 여백
      }

      :deep(.p-dropdown) {
        height: 2.5rem;

        .p-dropdown-label {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
      }
    }
  }

  .user-list {
    .search-area {
      margin-bottom: 1rem;
      padding: 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .search-fields {
        display: flex;
        gap: 1rem;
        align-items: center;

        .search-field {
          flex: 1;
          min-width: 150px;

          :deep(.p-inputtext),
          :deep(.p-dropdown) {
            width: 100%;
            height: 2.5rem;
          }

          :deep(.p-dropdown) {
            .p-dropdown-label {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
          }
        }
      }
    }

    .table-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: auto;

      table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.875rem;
        }

        tbody {
          tr {
            transition: background-color 0.2s;

            &:hover {
              background-color: #f8f9fa;
            }
          }
        }
      }
    }
  }

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
    z-index: 1100; /* 헤더(1000)보다 높게 설정 */
  }

  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #2c3e50;
    }
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
    flex: 1;

    .profile-section {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;

      .profile-image {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
        text-align: left;
      }

      th {
        width: 120px;
        background-color: #f8f9fa;
        font-weight: 500;
        color: #374151;
        position: sticky;
        left: 0; /* 첫 번째 열 고정 */
      }

      td {
        color: #4b5563;
      }

      .section-header {
        background-color: #f3f4f6;
        font-weight: 600;
        color: #1f2937;
      }

      .profile-cell {
        padding: 1rem;
        text-align: center;
        background-color: #f8f9fa;

        .profile-placeholder {
          width: 120px;
          height: 160px;
          border: 1px solid #e5e7eb;
          margin: 0 auto;
          background-color: white;
        }
      }
    }
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    background-color: white; /* 스크롤 시 내용이 비치지 않도록 */
  }

  .status-buttons {
    display: flex;
    gap: 0.5rem;

    :deep(.p-button) {
      &.p-button-outlined {
        opacity: 0.6;
      }
    }
  }
}

.column-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  span {
    font-weight: 600;
    color: #495057;
  }

  :deep(.p-inputtext) {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    height: 2rem;
    width: 100%;

    &:focus {
      box-shadow: none;
      border-color: #8b8bf5;
    }
  }
}

.table-container {
  th {
    padding: 0.75rem;
    font-weight: 600;
    color: #495057;
    background-color: #f8f9fa;
  }

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #8b8bf5;
  }
}

:deep(.admin-header) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

:deep(.admin-sidebar) {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 250px;
  z-index: 900;
}
</style>
