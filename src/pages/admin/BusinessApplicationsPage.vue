<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useRouter } from 'vue-router';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';

const router = useRouter();

// 샘플 신청 목록 데이터
const applications = ref([
    {
        id: 1,
        createdAt: '2024-03-20',
        businessName: '(주)테크솔루션',
        businessRegistrationNo: '123-45-67890',
        ownerName: '김대표',
        managerName: '이담당',
        businessPhoneNo: '010-1234-5678',
        businessEmail: 'tech@example.com',
        businessAddress: '서울시 강남구 테헤란로 123',
        businessType: '중소기업(300명이하)',
        status: 'PENDING',
        fileUrl: 'sample1.pdf',
        fileName: '테크솔루션_사업자등록증명원.pdf'
    },
    {
        id: 2,
        createdAt: '2024-03-19',
        businessName: '글로벌IT(주)',
        businessRegistrationNo: '456-78-90123',
        ownerName: '박사장',
        managerName: '최매니저',
        businessPhoneNo: '010-2345-6789',
        businessEmail: 'global@example.com',
        businessAddress: '서울시 서초구 반포대로 456',
        businessType: '중견기업(300명이상)',
        status: 'APPROVED',
        fileUrl: 'sample2.pdf',
        fileName: '글로벌IT_사업자등록증명원.pdf'
    },
    {
        id: 3,
        createdAt: '2024-03-18',
        businessName: '스마트테크(주)',
        businessRegistrationNo: '789-01-23456',
        ownerName: '정대표',
        managerName: '김책임',
        businessPhoneNo: '010-3456-7890',
        businessEmail: 'smart@example.com',
        businessAddress: '경기도 성남시 분당구 판교로 789',
        businessType: '벤처기업',
        status: 'REJECTED',
        fileUrl: 'sample3.pdf',
        fileName: '스마트테크_사업자등록증명원.pdf',
        rejectReason: '사업자등록증명원 식별 불가'
    },
    {
        id: 4,
        createdAt: '2024-03-17',
        businessName: '퓨처시스템즈(주)',
        businessRegistrationNo: '234-56-78901',
        ownerName: '송사장',
        managerName: '박과장',
        businessPhoneNo: '010-4567-8901',
        businessEmail: 'future@example.com',
        businessAddress: '서울시 영등포구 여의대로 234',
        businessType: '대기업',
        status: 'PENDING',
        fileUrl: 'sample4.pdf',
        fileName: '퓨처시스템즈_사업자등록증명원.pdf'
    }
]);

const selectedApplication = ref(null);
const showDetailModal = ref(false);
const rejectReason = ref('');

// 신청 상태에 따른 스타일
const getStatusStyle = (status) => {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'APPROVED': return 'bg-green-100 text-green-800';
        case 'REJECTED': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

// 신청 상세 보기
const viewDetail = (application) => {
    selectedApplication.value = application;
    showDetailModal.value = true;
};

// 신청 승인
const approveApplication = async (id) => {
    if (confirm('이 신청을 승인하시겠습니까?')) {
        try {
            // API 호출
            // await approveBusinessApplication(id);
            // 승인 이메일 발송
            // await sendApprovalEmail(selectedApplication.value.businessEmail);
            
            // 목록 새로고침
            // await loadApplications();
        } catch (error) {
            console.error('승인 처리 중 오류 발생:', error);
        }
    }
};

// 신청 거절
const rejectApplication = async (id) => {
    if (!rejectReason.value) {
        alert('거절 사유를 입력해주세요.');
        return;
    }
    
    if (confirm('이 신청을 거절하시겠습니까?')) {
        try {
            // API 호출
            // await rejectBusinessApplication(id, rejectReason.value);
            // 거절 이메일 발송
            // await sendRejectionEmail(selectedApplication.value.businessEmail, rejectReason.value);
            
            // 목록 새로고침
            // await loadApplications();
            
            closeDetailModal();
        } catch (error) {
            console.error('거절 처리 중 오류 발생:', error);
        }
    }
};

// 모달 닫기
const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedApplication.value = null;
    rejectReason.value = '';
};

// 파일 다운로드
const downloadFile = (fileUrl, fileName) => {
    alert(`${fileName} 파일 다운로드 시도\n(실제 다운로드는 백엔드 연동 후 구현 예정)`);
};

// 뒤로가기 함수
const goBack = () => {
    router.push('/admin');
};
</script>

<template>
    <div class="admin-layout">
        <AdminHeader />
        <AdminSidebar />

        <div class="admin-content">
            <div class="admin-applications-page">
                <div class="page-header">
                    <div class="header-content">
                        <Button 
                            icon="pi pi-arrow-left" 
                            class="p-button-text p-button-rounded" 
                            @click="goBack"
                        />
                        <h1>기업회원 신청 관리</h1>
                    </div>
                </div>

                <!-- 신청 목록 테이블 -->
                <div class="applications-table">
                    <table>
                        <thead>
                            <tr>
                                <th>신청일</th>
                                <th>회사명</th>
                                <th>사업자등록번호</th>
                                <th>대표자명</th>
                                <th>가입자명</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="app in applications" :key="app.id">
                                <td>{{ app.createdAt }}</td>
                                <td>{{ app.businessName }}</td>
                                <td>{{ app.businessRegistrationNo }}</td>
                                <td>{{ app.ownerName }}</td>
                                <td>{{ app.managerName }}</td>
                                <td>
                                    <span :class="['status-badge', getStatusStyle(app.status)]">
                                        {{ app.status === 'PENDING' ? '대기' : 
                                        app.status === 'APPROVED' ? '승인' : '거절' }}
                                    </span>
                                </td>
                                <td>
                                    <Button 
                                        icon="pi pi-eye" 
                                        class="p-button-text" 
                                        @click="viewDetail(app)"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 상세 정보 모달 -->
                <Dialog 
                    v-model:visible="showDetailModal"
                    :modal="true"
                    :style="{ width: '650px' }"
                    header="기업회원 신청 상세"
                >
                    <div v-if="selectedApplication" class="p-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="detail-item">
                                <h3>기본 정보</h3>
                                <p><strong>회사명:</strong> {{ selectedApplication.businessName }}</p>
                                <p><strong>사업자등록번호:</strong> {{ selectedApplication.businessRegistrationNo }}</p>
                                <p><strong>대표자명:</strong> {{ selectedApplication.ownerName }}</p>
                                <p><strong>회사주소:</strong> {{ selectedApplication.businessAddress }}</p>
                                <p><strong>기업형태:</strong> {{ selectedApplication.businessType }}</p>
                            </div>
                            <div class="detail-item">
                                <h3>담당자 정보</h3>
                                <p><strong>가입자명:</strong> {{ selectedApplication.managerName }}</p>
                                <p><strong>연락처:</strong> {{ selectedApplication.businessPhoneNo }}</p>
                                <p><strong>이메일:</strong> {{ selectedApplication.businessEmail }}</p>
                            </div>
                        </div>

                        <!-- 첨부파일 -->
                        <div class="mt-4">
                            <h3>첨부 서류</h3>
                            <div class="file-item">
                                <span>사업자등록증명원</span>
                                <div class="flex gap-2">
                                    <Button 
                                        label="다운로드" 
                                        icon="pi pi-download" 
                                        class="p-button-text"
                                        @click="downloadFile(selectedApplication.fileUrl, selectedApplication.fileName)"
                                        :disabled="!selectedApplication.fileUrl"
                                    />
                                </div>
                            </div>
                            <p v-if="!selectedApplication.fileUrl" class="text-sm text-red-500 mt-1">
                                * 첨부된 파일이 없습니다.
                            </p>
                        </div>

                        <!-- 거절 사유 입력 -->
                        <div v-if="selectedApplication.status === 'PENDING'" class="mt-4">
                            <h3>거절 사유</h3>
                            <textarea 
                                v-model="rejectReason"
                                class="w-full p-2 border rounded"
                                rows="3"
                                placeholder="거절 사유를 입력하세요"
                            ></textarea>
                        </div>

                        <!-- 버튼 영역 -->
                        <div class="flex justify-end gap-2 mt-4">
                            <Button 
                                v-if="selectedApplication.status === 'PENDING'"
                                label="승인" 
                                class="p-button-success"
                                @click="approveApplication(selectedApplication.id)"
                            />
                            <Button 
                                v-if="selectedApplication.status === 'PENDING'"
                                label="거절" 
                                class="p-button-danger"
                                @click="rejectApplication(selectedApplication.id)"
                            />
                            <Button 
                                label="닫기" 
                                class="p-button-text"
                                @click="closeDetailModal"
                            />
                        </div>
                    </div>
                </Dialog>
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

:deep(.admin-header) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

:deep(.admin-sidebar) {
    position: fixed;
    top: 60px; /* 헤더 높이만큼 아래로 */
    left: 0;
    bottom: 0;
    width: 250px;
    z-index: 900;
}

.admin-applications-page {
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
}

.applications-table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;

    table {
        width: 100%;
        border-collapse: collapse;

        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }

        th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #374151;
        }
    }
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.875rem;
}

.detail-item {
    h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #374151;
    }

    p {
        margin: 0.5rem 0;
        color: #4b5563;

        strong {
            color: #374151;
        }
    }
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e5e7eb;

    .p-button-text {
        padding: 0.5rem 1rem;
        
        &:hover {
            background-color: #e5e7eb;
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
}
</style> 