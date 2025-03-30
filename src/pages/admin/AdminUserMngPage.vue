<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';
import AdminSidebar from '@/components/admin/AdminSidebar.vue'; // 사이드바 컴포넌트 임포트

const router = useRouter();

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

// 필터링된 사용자 목록
const filteredUsers = computed(() => {
    return users.value.filter(user => {
        return (
            (!filters.value.role || user.role?.toLowerCase().includes(filters.value.role.toLowerCase())) &&
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

// 계정 상태 변경 모달
const showStatusModal = ref(false);
const selectedUser = ref(null);
const statusReason = ref('');
const suspendEndDate = ref('');
const selectedNewStatus = ref(null);  // 선택된 새로운 상태

const openStatusModal = (user) => {
    selectedUser.value = user;
    statusReason.value = '';
    suspendEndDate.value = '';
    selectedNewStatus.value = null;  // 초기화
    showStatusModal.value = true;
};

const closeStatusModal = () => {
    showStatusModal.value = false;
    selectedUser.value = null;
    statusReason.value = '';
    suspendEndDate.value = '';
    selectedNewStatus.value = null;  // 초기화
};

const selectStatus = (status) => {
    selectedNewStatus.value = status;
};

const updateUserStatus = () => {
    if (!selectedUser.value || !statusReason.value || !selectedNewStatus.value) return;

    const user = users.value.find(u => u.id === selectedUser.value.id);
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
        user.status = selectedNewStatus.value;
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
        selectedUsers.value = filteredUsers.value.map(user => user.id);
    } else {
        selectedUsers.value = [];
    }
};

// 개별 체크박스 선택 시 전체 선택 상태 업데이트
const updateSelectAll = () => {
    selectAll.value = filteredUsers.value.length > 0 && 
        selectedUsers.value.length === filteredUsers.value.length;
};
</script>

<template>
    <div class="admin-layout">
        <!-- 사이드바 컴포넌트 사용 -->
        <AdminSidebar />

        <!-- 메인 컨텐츠 -->
        <div class="admin-content">
            <div class="admin-user-mng-page">
                <div class="page-header">
                    <div class="header-content">
                        <Button 
                            icon="pi pi-arrow-left" 
                            class="p-button-text p-button-rounded" 
                            @click="goBack"
                        />
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
                                    :options="['User', 'Manager', 'Admin']"
                                    placeholder="그룹"
                                    class="w-full"
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
                                        <input 
                                            type="checkbox" 
                                            v-model="selectAll"
                                            @change="handleSelectAll"
                                        />
                                    </th>
                                    <th>순번</th>
                                    <th>로그인 ID</th>
                                    <th>이름</th>
                                    <th>모바일</th>
                                    <th>이메일</th>
                                    <th>그룹</th>
                                    <th>성별</th>
                                    <th>고용주</th>
                                    <th>Active</th>
                                    <th>생성일시</th>
                                    <th>수정일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(user, index) in filteredUsers" :key="user.id">
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            v-model="selectedUsers" 
                                            :value="user.id"
                                            @change="updateSelectAll"
                                        />
                                    </td>
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ user.loginId }}</td>
                                    <td>{{ user.name }}</td>
                                    <td>{{ user.mobile }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>{{ user.role }}</td>
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
                        <h2>계정 상태 변경</h2>
                        <div class="user-info">
                            <p><strong>이름:</strong> {{ selectedUser?.name }}</p>
                            <p><strong>이메일:</strong> {{ selectedUser?.email }}</p>
                            <p><strong>현재 상태:</strong> {{ selectedUser?.status }}</p>
                        </div>

                        <!-- 상태 변경 이력 -->
                        <div class="status-history" v-if="selectedUser?.statusHistory?.length">
                            <h3>상태 변경 이력</h3>
                            <div class="history-list">
                                <div v-for="(history, index) in selectedUser.statusHistory.slice(0, 3)" 
                                     :key="index" 
                                     class="history-item">
                                    <div class="history-status">
                                        <span :class="['status-badge', getStatusStyle(history.status)]">
                                            {{ history.status }}
                                        </span>
                                    </div>
                                    <div class="history-details">
                                        <p class="history-reason">{{ history.reason }}</p>
                                        <p class="history-date">{{ history.date }} ({{ history.by }})</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>변경할 상태</label>
                            <div class="status-buttons">
                                <Button 
                                    :label="USER_STATUS.ACTIVE" 
                                    class="p-button-success" 
                                    :outlined="selectedNewStatus !== USER_STATUS.ACTIVE"
                                    @click="selectStatus(USER_STATUS.ACTIVE)"
                                />
                                <Button 
                                    :label="USER_STATUS.SUSPENDED" 
                                    class="p-button-danger" 
                                    :outlined="selectedNewStatus !== USER_STATUS.SUSPENDED"
                                    @click="selectStatus(USER_STATUS.SUSPENDED)"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label>변경 사유</label>
                            <textarea 
                                v-model="statusReason" 
                                class="form-input" 
                                rows="3"
                                :placeholder="'상태 변경 사유를 입력하세요'"
                                required
                            ></textarea>
                        </div>

                        <div v-if="selectedNewStatus === USER_STATUS.SUSPENDED" class="form-group">
                            <label>정지 기간</label>
                            <input 
                                type="date" 
                                v-model="suspendEndDate" 
                                class="form-input"
                                required
                            />
                        </div>

                        <div class="modal-actions">
                            <Button label="취소" class="p-button-text" @click="closeStatusModal" />
                            <Button 
                                label="변경" 
                                class="p-button-primary" 
                                :disabled="!statusReason || !selectedNewStatus || (selectedNewStatus === USER_STATUS.SUSPENDED && !suspendEndDate)"
                                @click="updateUserStatus"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
}

.admin-content {
    flex: 1;
    background-color: #f9fafb;
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

                th, td {
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

        .modal-content {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            width: 100%;
            max-width: 500px;

            h2 {
                margin: 0 0 1.5rem;
                font-size: 1.25rem;
                color: #2c3e50;
            }

            .user-info {
                background-color: #f8f9fa;
                padding: 1rem;
                border-radius: 4px;
                margin-bottom: 1.5rem;

                p {
                    margin: 0.5rem 0;
                    color: #495057;
                }
            }

            .status-history {
                margin-bottom: 1.5rem;
                
                h3 {
                    font-size: 1rem;
                    color: #374151;
                    margin-bottom: 0.75rem;
                }

                .history-list {
                    background-color: #f8f9fa;
                    border-radius: 4px;
                    padding: 0.5rem;
                }

                .history-item {
                    display: flex;
                    align-items: flex-start;
                    padding: 0.5rem;
                    border-bottom: 1px solid #e9ecef;

                    &:last-child {
                        border-bottom: none;
                    }

                    .history-status {
                        margin-right: 1rem;
                    }

                    .history-details {
                        flex: 1;

                        .history-reason {
                            font-size: 0.875rem;
                            margin: 0;
                        }

                        .history-date {
                            font-size: 0.75rem;
                            color: #6b7280;
                            margin: 0.25rem 0 0;
                        }
                    }
                }
            }

            .form-group {
                margin-bottom: 1.5rem;

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #666;
                }

                .form-input {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;

                    &:focus {
                        outline: none;
                        border-color: #8FA1FF;
                    }
                }

                .status-buttons {
                    display: flex;
                    gap: 0.5rem;
                }
            }

            .modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 1.5rem;
            }
        }
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
            border-color: #8B8BF5;
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

    input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: #8B8BF5;
    }
}
</style>
