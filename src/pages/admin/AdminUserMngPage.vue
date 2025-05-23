<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue'; // 사이드바 컴포넌트 임포트
import UserDetailModal from '@/components/admin/UserDetailModal.vue';
import UserCreateModal from '@/components/admin/UserCreateModal.vue';
import {
  getUserList,
  getUserStatus,
  updateUserStatus,
  updateUser,
  deleteUsers,
  createUser
} from '@/apis/admin/adminApis';

const router = useRouter();
const toast = useToast();

// 사용자 상태 상수 추가
const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE'
};

// API 관련 상태 및 함수
const loading = ref(false);
const users = ref([]);
const pagination = ref({
  page: 1,
  totalCount: 0,
  perPage: 10
});

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
  { label: 'User', value: 'ROLE_USER' },
  { label: 'Manager', value: 'ROLE_MANAGER' },
  { label: 'Admin', value: 'ROLE_ADMIN' }
];

// 공통으로 사용할 상태
const selectedUser = ref(null);
const showDetailModal = ref(false);

// 사용자 추가 관련 상태
const showCreateModal = ref(false);
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

// 성별 옵션 추가
const genderOptions = [
  { label: '남성', value: 'MALE' },
  { label: '여성', value: 'FEMALE' }
];

// 페이지당 항목 수 옵션
const perPageOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 }
];

// API 호출 함수들
const fetchUsers = async () => {
  loading.value = true;
  try {
    // 빈 문자열 필터 제거
    const cleanFilters = {};
    Object.keys(filters.value).forEach((key) => {
      if (filters.value[key] !== null && filters.value[key] !== '') {
        // role 파라미터를 roleCd로 변경
        if (key === 'role') {
          const roleValue = filters.value[key];
          if (roleValue) {
            cleanFilters['roleCd'] = roleValue;
            // console.log('권한 필터 적용:', roleValue);
          }
        } else {
          cleanFilters[key] = filters.value[key];
        }
      }
    });

    const params = {
      page: pagination.value.page,
      perPage: pagination.value.perPage,
      ...cleanFilters
    };

    // console.log('검색 파라미터:', params);
    // console.log('원본 필터 값:', filters.value);
    // console.log('정리된 필터 값:', cleanFilters);

    // API 호출 전에 파라미터 확인
    if (params.roleCd) {
      // console.log('API 호출 전 roleCd 확인:', params.roleCd);
    }

    const response = await getUserList(params);
    // console.log('API 응답:', response);

    // 응답 데이터 처리
    if (response && response.contents) {
      users.value = response.contents.map((user) => ({
        ...user,
        role_cd: user.role_cd || user.roleCd || user.role
      }));

      if (response.pagination) {
        pagination.value = {
          page: Number(response.pagination.page) || 1,
          totalCount: Number(response.pagination.totalCount) || 0,
          perPage: Number(response.pagination.perPage) || pagination.value.perPage
        };
      }

      // console.log('처리된 사용자 데이터:', users.value);
    } else {
      users.value = [];
      console.error('API 응답에 contents가 없습니다:', response);
    }
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
  } finally {
    loading.value = false;
  }
};

const fetchUserStatus = async (userId) => {
  try {
    const response = await getUserStatus(userId);
    return response;
  } catch (error) {
    console.error('사용자 상태 조회 실패:', error);
    return null;
  }
};

const handleStatusUpdate = async () => {
  if (!selectedUser.value || !statusReason.value || !selectedNewStatus.value) return;

  try {
    const enabled = selectedNewStatus.value === USER_STATUS.ACTIVE;
    await updateUserStatus({
      userId: selectedUser.value.id,
      enabled,
      memo: statusReason.value
    });
    await fetchUsers(); // 목록 새로고침
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '사용자 상태가 변경되었습니다.',
      life: 3000
    });
    closeStatusModal();
  } catch (error) {
    console.error('사용자 상태 변경 실패:', error);
  }
};

// 페이지 로드 시 사용자 목록 조회
onMounted(() => {
  fetchUsers();
});

// 검색 핸들러 수정
const handleSearch = () => {
  pagination.value.page = 1; // 페이지 초기화
  fetchUsers();
};

// 필터 초기화 함수 추가
const resetFilters = () => {
  filters.value = {
    role: null,
    loginId: '',
    name: '',
    mobile: '',
    email: ''
  };
  pagination.value.page = 1; // 페이지 초기화
  fetchUsers();
};

// 필터 변경 시 즉시 검색 실행
const handleFilterChange = () => {
  pagination.value.page = 1; // 페이지 초기화
  fetchUsers();
};

// 상태 변경 모달 관련 코드 수정
const showStatusModal = ref(false);
const statusReason = ref('');
const suspendEndDate = ref('');
const selectedNewStatus = ref(null);

const openStatusModal = async (user) => {
  selectedUser.value = user;
  statusReason.value = '';
  suspendEndDate.value = '';
  selectedNewStatus.value = user.enabled ? USER_STATUS.ACTIVE : USER_STATUS.SUSPENDED;

  // 사용자 상태 이력 조회
  const statusHistory = await fetchUserStatus(user.id);
  if (statusHistory) {
    statusReason.value = statusHistory.memo || '';
  }

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
    selectedUsers.value = users.value.map((user) => user.id);
  } else {
    selectedUsers.value = [];
  }
};

// 개별 체크박스 선택 시 전체 선택 상태 업데이트
const updateSelectAll = () => {
  selectAll.value = users.value.length > 0 && selectedUsers.value.length === users.value.length;
};

// 이미지 로드 실패 시 기본 이미지로 대체
const handleImageError = (e) => {
  e.target.src = '/default-avatar.png'; // 기본 프로필 이미지 경로
};

const openDetailModal = (user) => {
  selectedUser.value = user;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedUser.value = null;
};

const handleUserUpdate = async (updatedUser) => {
  try {
    closeDetailModal();

    // 정보 변경 API 호출
    const response = await updateUser(updatedUser);

    // 성공 시 목록 새로고침
    await fetchUsers();

    // 업데이트된 사용자 정보로 selectedUser 업데이트
    selectedUser.value = response;

    // 성공 메시지 표시
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '사용자 정보가 업데이트되었습니다.',
      life: 3000
    });

    // 모달 닫기 제거
  } catch (error) {
    console.error('사용자 업데이트 실패:', error);
  }
};

const handleUserDelete = async (userId) => {
  try {
    // API 호출 예시
    // await deleteUser(userId);
    await fetchUsers(); // 목록 새로고침
    showDetailModal.value = false;
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '사용자가 삭제되었습니다.',
      life: 3000
    });
  } catch (error) {
    console.error('사용자 삭제 실패:', error);
  }
};

// 권한 표시를 위한 함수 수정
const getRoleLabel = (role) => {
  if (!role) return '-';
  if (typeof role === 'object') {
    return role.name || '-';
  }

  // role_cd 또는 role 필드에서 권한 코드 가져오기
  const roleCode = typeof role === 'string' ? role : role?.role_cd || role?.roleCd;

  // 역할 코드를 레이블로 변환
  switch (roleCode) {
    case 'ROLE_USER':
      return 'User';
    case 'ROLE_MANAGER':
      return 'Manager';
    case 'ROLE_ADMIN':
      return 'Admin';
    default:
      return roleCode || '-';
  }
};

// 성별 표시를 위한 함수 수정
const getGenderLabel = (gender) => {
  if (!gender) return '-';
  if (typeof gender === 'object') {
    return gender.name || '-';
  }
  return gender;
};

// 선택된 사용자 삭제 함수 추가
const handleDeleteSelected = async () => {
  if (selectedUsers.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: '경고',
      detail: '삭제할 사용자를 선택해주세요.',
      life: 3000
    });
    return;
  }

  try {
    await deleteUsers(selectedUsers.value);
    await fetchUsers(); // 목록 새로고침
    selectedUsers.value = []; // 선택 초기화
    selectAll.value = false; // 전체 선택 초기화

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '선택된 사용자가 삭제되었습니다.',
      life: 3000
    });
  } catch (error) {
    console.error('사용자 삭제 실패:', error);
    toast.add({
      severity: 'error',
      summary: '실패',
      detail: '사용자 삭제 중 오류가 발생했습니다.',
      life: 3000
    });
  }
};

// 사용자 추가 함수
const handleCreateUser = async () => {
  try {
    await createUser(newUser.value);
    await fetchUsers(); // 목록 새로고침
    showCreateModal.value = false;
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '사용자가 추가되었습니다.',
      life: 3000
    });
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

// 이미지 업로드 핸들러
const handleImageUpload = (event) => {
  const file = event.files[0];
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

// 사용자 추가 후 목록 새로고침
const handleUserCreated = () => {
  fetchUsers();
};

// 페이지당 항목 수 변경 핸들러
const handlePerPageChange = () => {
  pagination.value.page = 1; // 페이지 초기화
  fetchUsers();
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
              <div class="search-field role-field">
                <Select
                  v-model="filters.role"
                  :options="roleOptions"
                  placeholder="권한"
                  class="w-full"
                  optionLabel="label"
                  optionValue="value"
                  checkmark
                  @change="handleFilterChange"
                />
              </div>
              <div class="search-field">
                <InputText
                  v-model="filters.loginId"
                  type="text"
                  placeholder="로그인 ID"
                  class="w-full"
                  @input="handleFilterChange"
                />
              </div>
              <div class="search-field">
                <InputText
                  v-model="filters.name"
                  type="text"
                  placeholder="이름"
                  class="w-full"
                  @input="handleFilterChange"
                />
              </div>
              <div class="search-field">
                <InputText
                  v-model="filters.mobile"
                  type="text"
                  placeholder="모바일"
                  class="w-full"
                  @input="handleFilterChange"
                />
              </div>
              <div class="search-field">
                <InputText
                  v-model="filters.email"
                  type="text"
                  placeholder="이메일"
                  class="w-full"
                  @input="handleFilterChange"
                />
              </div>
              <div class="action-buttons">
                <Button
                  label="사용자 추가"
                  icon="pi pi-plus"
                  class="p-button-success mr-2"
                  @click="showCreateModal = true"
                />
                <Button
                  label="선택 삭제"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  :disabled="selectedUsers.length === 0"
                  @click="handleDeleteSelected"
                />
              </div>
            </div>
          </div>

          <!-- 기존 테이블 -->
          <div class="table-container">
            <div v-if="loading" class="loading-overlay">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
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
                  <th>활성</th>
                  <th>생성일시</th>
                  <th>수정일시</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(user, index) in users"
                  :key="user.id"
                  @click="openDetailModal(user)"
                  class="cursor-pointer hover:bg-gray-50"
                >
                  <td @click.stop>
                    <input type="checkbox" v-model="selectedUsers" :value="user.id" @change="updateSelectAll" />
                  </td>
                  <td>{{ pagination.totalCount - ((pagination.page - 1) * 10 + index) }}</td>
                  <td>{{ user.loginId }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.mobile }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ getRoleLabel(user.role_cd || user.role) }}</td>
                  <td>{{ getGenderLabel(user.gender) }}</td>
                  <td>{{ user.isCompany ? 'Y' : 'N' }}</td>
                  <td>{{ user.enabled ? 'Y' : 'N' }}</td>
                  <td>{{ user.createdAt }}</td>
                  <td>{{ user.updatedAt }}</td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="12" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 페이지네이션 -->
          <div class="pagination-container">
            <div class="pagination-info">
              총 {{ pagination.totalCount }}건 중 {{ (pagination.page - 1) * pagination.perPage + 1 }}-{{
                Math.min(pagination.page * pagination.perPage, pagination.totalCount)
              }}건
            </div>
            <div class="pagination-controls">
              <Button
                icon="pi pi-angle-double-left"
                class="p-button-text"
                :disabled="pagination.page === 1"
                @click="
                  pagination.page = 1;
                  fetchUsers();
                "
              />
              <Button
                icon="pi pi-angle-left"
                class="p-button-text"
                :disabled="pagination.page === 1"
                @click="
                  pagination.page--;
                  fetchUsers();
                "
              />
              <span class="mx-2">{{ pagination.page }}</span>
              <Button
                icon="pi pi-angle-right"
                class="p-button-text"
                :disabled="pagination.page * pagination.perPage >= pagination.totalCount"
                @click="
                  pagination.page++;
                  fetchUsers();
                "
              />
              <Button
                icon="pi pi-angle-double-right"
                class="p-button-text"
                :disabled="pagination.page * pagination.perPage >= pagination.totalCount"
                @click="
                  pagination.page = Math.ceil(pagination.totalCount / pagination.perPage);
                  fetchUsers();
                "
              />
              <div class="per-page-selector">
                <Dropdown
                  v-model="pagination.perPage"
                  :options="perPageOptions"
                  optionLabel="label"
                  optionValue="value"
                  @change="handlePerPageChange"
                />
              </div>
            </div>
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
                      <td>{{ selectedUser?.birth || '-' }}</td>
                    </tr>
                    <tr>
                      <th>모바일</th>
                      <td>{{ selectedUser?.mobile || '-' }}</td>
                    </tr>
                    <tr>
                      <th>이메일</th>
                      <td>{{ selectedUser?.email || '-' }}</td>
                    </tr>
                    <tr>
                      <th>권한</th>
                      <td>{{ getRoleLabel(selectedUser?.roleCd || selectedUser?.role) }}</td>
                    </tr>
                    <tr>
                      <th>성별</th>
                      <td>{{ selectedUser?.gender.name }}</td>
                    </tr>
                    <tr>
                      <th>고용주 여부</th>
                      <td>{{ selectedUser?.isCompany ? '예' : '아니오' }}</td>
                    </tr>
                    <tr>
                      <th>활성여부</th>
                      <td>{{ selectedUser?.enabled ? '활성' : '비활성' }}</td>
                    </tr>
                    <tr>
                      <th>최근 로그인</th>
                      <td>{{ selectedUser?.lastLoginAt || '-' }}</td>
                    </tr>
                    <tr>
                      <th>생성일시</th>
                      <td>{{ selectedUser?.createdAt || '-' }}</td>
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
          @close="closeDetailModal"
          @update="handleUserUpdate"
          @delete="handleUserDelete"
        />

        <!-- 사용자 추가 모달 -->
        <UserCreateModal :is-open="showCreateModal" @close="showCreateModal = false" @created="handleUserCreated" />
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

          &.role-field {
            min-width: 200px;
            max-width: 200px;
          }

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

        .action-buttons {
          margin-left: auto;
          min-width: 120px;
          display: flex;
          gap: 0.5rem;
        }
      }
    }

    .table-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem; // 기본 폰트 크기 축소

        th,
        td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
          white-space: nowrap; // 텍스트 줄바꿈 방지
          overflow: hidden;
          text-overflow: ellipsis; // 길이가 긴 텍스트는 ...으로 표시
        }

        th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #495057;
          position: sticky;
          top: 0;
          z-index: 1;
          font-size: 0.8125rem; // 헤더 폰트 크기 더 축소
        }

        // 각 컬럼별 최대 너비 설정
        td,
        th {
          &:nth-child(1) {
            width: 40px;
          } // 체크박스
          &:nth-child(2) {
            width: 60px;
          } // 순번
          &:nth-child(3) {
            width: 100px;
          } // 로그인 ID
          &:nth-child(4) {
            width: 120px;
          } // 이름
          &:nth-child(5) {
            width: 120px;
          } // 모바일
          &:nth-child(6) {
            width: 180px;
          } // 이메일
          &:nth-child(7) {
            width: 80px;
          } // 권한
          &:nth-child(8) {
            width: 60px;
          } // 성별
          &:nth-child(9) {
            width: 60px;
          } // 고용주
          &:nth-child(10) {
            width: 60px;
          } // Active
          &:nth-child(11) {
            width: 140px;
          } // 생성일시
          &:nth-child(12) {
            width: 140px;
          } // 수정일시
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

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;

  .pagination-info {
    position: absolute;
    left: 1rem;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    :deep(.p-button) {
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }

    .per-page-selector {
      margin-left: 1rem;
      
      :deep(.p-dropdown) {
        width: 100px;
        height: 2.5rem;
      }
    }
  }
}

// 테이블 스크롤을 위한 컨테이너 설정 제거
.user-list {
  .table-container {
    // max-height: calc(100vh - 300px); 제거
    // overflow: auto; 제거
  }
}

.field {
  margin-bottom: 1rem;
}

.field-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  label {
    margin-left: 0.5rem;
  }
}

.image-upload-container {
  .image-preview {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .delete-image {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem;
    }
  }
}

.field {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }
}

.field-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  label {
    margin-left: 0.5rem;
    color: #374151;
  }
}

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
