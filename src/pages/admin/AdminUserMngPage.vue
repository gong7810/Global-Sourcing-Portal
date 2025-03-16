<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router';

const router = useRouter();

// 사용자 상태 정의
const USER_STATUS = {
    ACTIVE: '사용 중',
    SUSPENDED: '정지'
};

// 상태 변경 사유 기본값
const STATUS_REASON = {
    [USER_STATUS.ACTIVE]: '계정 활성화',
    [USER_STATUS.SUSPENDED]: '규정 위반'
};

// 샘플 사용자 데이터
const users = ref([
    {
        id: 1,
        name: '홍길동',
        email: 'hong@example.com',
        role: '일반회원',
        status: USER_STATUS.ACTIVE,
        lastLogin: '2024-03-15',
        joinDate: '2024-01-01',
        statusHistory: [
            {
                status: USER_STATUS.ACTIVE,
                reason: '최초 가입',
                date: '2024-01-01',
                by: '시스템'
            }
        ]
    },
    {
        id: 2,
        name: '김철수',
        email: 'kim@example.com',
        role: '기업회원',
        status: USER_STATUS.ACTIVE,
        lastLogin: '2024-02-01',
        joinDate: '2023-12-15'
    },
    {
        id: 3,
        name: '이영희',
        email: 'lee@example.com',
        role: '일반회원',
        status: USER_STATUS.SUSPENDED,
        lastLogin: '2024-03-10',
        joinDate: '2024-01-15',
        suspendReason: '부적절한 게시물 작성',
        suspendEndDate: '2024-04-10'
    }
]);

// 검색 및 필터링
const searchQuery = ref('');
const selectedStatus = ref(null);
const statusOptions = [
    { label: '전체', value: null },
    { label: USER_STATUS.ACTIVE, value: USER_STATUS.ACTIVE },
    { label: USER_STATUS.SUSPENDED, value: USER_STATUS.SUSPENDED }
];

// 필터링된 사용자 목록
const filteredUsers = computed(() => {
    return users.value.filter(user => {
        const matchesSearch = searchQuery.value === '' || 
            user.name.includes(searchQuery.value) || 
            user.email.includes(searchQuery.value);
        const matchesStatus = selectedStatus.value === null || 
            user.status === selectedStatus.value;
        return matchesSearch && matchesStatus;
    });
});

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

// 사이드바 메뉴 아이템
const menuItems = ref([
    { label: '사용자 관리', icon: 'pi pi-users', to: '/admin/users' },
    { label: 'FAQ 관리', icon: 'pi pi-question-circle', to: '/admin/faq' },
    { label: '기업회원 신청', icon: 'pi pi-briefcase', to: '/admin/businessApplications' }
]);

// 뒤로가기 함수
const goBack = () => {
    router.push('/admin');
};
</script>

<template>
    <div class="admin-layout">
        <!-- 사이드바 -->
        <div class="admin-sidebar">
            <ul class="menu-list">
                <li v-for="item in menuItems" :key="item.label" class="menu-item">
                    <router-link :to="item.to" class="menu-link" v-slot="{ isActive }">
                        <div :class="['menu-link-content', { 'active': isActive }]">
                            <i :class="[item.icon, 'text-xl']"></i>
                            <span>{{ item.label }}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>

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

                <!-- 검색 및 필터 -->
                <div class="search-filter-section">
                    <div class="search-box">
                        <input 
                            v-model="searchQuery" 
                            type="text" 
                            class="search-input" 
                            placeholder="이름 또는 이메일로 검색" 
                        />
                    </div>
                    <div class="filter-box">
                        <Dropdown
                            v-model="selectedStatus"
                            :options="statusOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="상태별 필터"
                            class="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <!-- 사용자 목록 -->
                <div class="user-list">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>이름</th>
                                    <th>이메일</th>
                                    <th>회원구분</th>
                                    <th>상태</th>
                                    <th>최근 로그인</th>
                                    <th>가입일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in filteredUsers" :key="user.id">
                                    <td>{{ user.name }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>{{ user.role }}</td>
                                    <td>
                                        <span :class="['status-badge', getStatusStyle(user.status)]">
                                            {{ user.status }}
                                        </span>
                                    </td>
                                    <td>{{ user.lastLogin }}</td>
                                    <td>{{ user.joinDate }}</td>
                                    <td>
                                        <Button 
                                            icon="pi pi-cog" 
                                            class="p-button-text" 
                                            @click="openStatusModal(user)"
                                        />
                                    </td>
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

.admin-sidebar {
    width: 250px;
    background-color: white;
    border-right: 1px solid #e5e7eb;
    padding: 1.5rem 1rem;
    padding-top: 2rem;

    .menu-list {
        list-style: none;
        padding: 0;
        margin: 0;

        .menu-item {
            margin: 0.5rem 0;

            .menu-link {
                text-decoration: none;
                
                .menu-link-content {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    color: #4b5563;
                    border-radius: 8px;
                    transition: all 0.3s;

                    i {
                        margin-right: 0.75rem;
                    }

                    &:hover {
                        background-color: #f3f4f6;
                        color: #8B8BF5;
                    }

                    &.active {
                        background-color: #8B8BF5;
                        color: white;
                    }
                }
            }
        }
    }
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
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;

        .search-box {
            flex: 1;
            max-width: 300px;

            .search-input {
                width: 100%;
                height: 2.5rem;
                padding: 0.5rem 1rem;
                border: 1px solid #E5E7EB;
                border-radius: 6px;
                font-size: 0.875rem;
                background-color: white;
                
                &:focus {
                    outline: none;
                    border-color: #E5E7EB;
                    box-shadow: none;
                }

                &::placeholder {
                    color: #9CA3AF;
                }
            }
        }

        .filter-box {
            width: 150px;

            :deep(.p-dropdown) {
                width: 100%;
                border: 1px solid #E5E7EB;
                border-radius: 6px;
                background-color: white;

                .p-dropdown-label {
                    padding: 0.5rem;
                    font-size: 0.875rem;
                    color: #374151;
                }

                &:not(.p-disabled).p-focus {
                    border-color: #E5E7EB;
                    box-shadow: none;
                }
            }
        }
    }

    .user-list {
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
</style>
