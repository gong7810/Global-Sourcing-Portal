<script setup>
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import Dialog from 'primevue/dialog';
import { getInquiries, getInquiryDetail, saveReply } from '@/apis/common/inquiryApi';

const router = useRouter();
const toast = useToast();

// 문의유형 정의
const inquiryTypes = [
    { label: '전체', value: null },
    { label: '서비스 이용 문의', value: 'HELP_TY_SV' },
    { label: '기술적 문제', value: 'HELP_TY_TE' },
    { label: '결제 관련', value: 'HELP_TY_PA' },
    { label: '제안/건의', value: 'HELP_TY_SU' },
    { label: '기타', value: 'HELP_TY_ET' }
];

// 필터 상태 (category를 type으로 변경)
const filters = ref({
    type: null,
    keyword: ''
});

// 문의 목록 상태
const inquiries = ref([]);
const loading = ref(false);
const pagination = ref({
    page: 1,
    totalCount: 0
});

// 문의 목록 조회
const fetchInquiries = async () => {
    try {
        loading.value = true;
        
        const params = {
            page: pagination.value.page,
            perPage: 10,
            sortColumn: 'id',
            sortAsc: false
        };
        
        // 필터 적용
        if (filters.value.type) {
            params.type = filters.value.type;
        }
        
        if (filters.value.keyword) {
            params.keyword = filters.value.keyword;
        }
        
        const response = await getInquiries(params);
        inquiries.value = response.contents;
        pagination.value = response.pagination;
    } catch (error) {
        console.error('문의 목록 조회 실패:', error);
        // 500 에러가 아닌 경우에만 토스트 메시지 표시
        if (error.response?.status !== 500) {
            toast.add({
                severity: 'error',
                summary: '오류 발생',
                detail: '문의 목록을 불러오는 중 문제가 발생했습니다.',
                life: 3000
            });
        }
    } finally {
        loading.value = false;
    }
};

// 필터링된 문의 목록
const filteredInquiries = computed(() => {
    return inquiries.value;
});

// 문의유형 레이블 가져오기 (함수명 변경)
const getInquiryTypeLabel = (value) => {
    const type = inquiryTypes.find(t => t.value === value);
    return type ? type.label : '';
};

// 문의 상태에 따른 스타일
const getStatusStyle = (status) => {
    switch (status) {
        case 'HELP_ST_1': return 'bg-yellow-100 text-yellow-800';
        case 'HELP_ST_2': return 'bg-green-100 text-green-800';
        case 'HELP_ST_3': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

// 상태 레이블 가져오기
const getStatusLabel = (status) => {
    switch (status) {
        case 'HELP_ST_1': return '답변대기';
        case 'HELP_ST_2': return '답변완료';
        case 'HELP_ST_3': return '종료';
        default: return '알 수 없음';
    }
};

// 상세 보기 모달 관련
const showDetailModal = ref(false);
const selectedInquiry = ref(null);
const replyContent = ref('');
const detailLoading = ref(false);

const viewDetail = async (inquiry) => {
    try {
        detailLoading.value = true;
        const detail = await getInquiryDetail(inquiry.id);
        selectedInquiry.value = {
            ...detail,
            replies: detail.replies || [] // replies가 없을 경우 빈 배열로 초기화
        };
        replyContent.value = selectedInquiry.value.replies.length > 0 ? selectedInquiry.value.replies[0].reply : '';
        showDetailModal.value = true;
    } catch (error) {
        console.error('문의 상세 조회 실패:', error);
        toast.add({
            severity: 'error',
            summary: '오류 발생',
            detail: '문의 상세 정보를 불러오는 중 문제가 발생했습니다.',
            life: 3000
        });
    } finally {
        detailLoading.value = false;
    }
};

const submitReply = async () => {
    if (!replyContent.value) {
        toast.add({
            severity: 'warn',
            summary: '입력 오류',
            detail: '답변 내용을 입력해주세요.',
            life: 3000
        });
        return;
    }

    try {
        detailLoading.value = true;

        // 답변 저장
        await saveReply({
            helpId: selectedInquiry.value.id,
            reply: replyContent.value
        });

        // 문의 목록 새로고침
        await fetchInquiries();
        
        toast.add({
            severity: 'success',
            summary: '답변 완료',
            detail: '답변이 등록되었습니다.',
            life: 3000
        });

        showDetailModal.value = false;
    } catch (error) {
        console.error('답변 처리 중 오류 발생:', error);
        toast.add({
            severity: 'error',
            summary: '오류 발생',
            detail: '답변 처리 중 문제가 발생했습니다. 다시 시도해주세요.',
            life: 3000
        });
    } finally {
        detailLoading.value = false;
    }
};

// 필터 변경 시 목록 새로고침
const handleFilterChange = () => {
    pagination.value.page = 1; // 페이지 초기화
    fetchInquiries();
};

// 페이지 변경
const handlePageChange = (page) => {
    pagination.value.page = page;
    fetchInquiries();
};

const goBack = () => {
    router.push('/admin');
};

// 컴포넌트 마운트 시 문의 목록 조회
onMounted(() => {
    fetchInquiries();
});

const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedInquiry.value = null;
    replyContent.value = '';
};
</script>

<template>
    <div class="admin-layout">
        <AdminHeader />
        <AdminSidebar />
        
        <div class="admin-content">
            <div class="admin-inquiries-page">
                <div class="page-header">
                    <div class="header-content">
                        <Button 
                            icon="pi pi-arrow-left" 
                            class="p-button-text p-button-plain" 
                            @click="goBack"
                        />
                        <h1>문의하기 관리</h1>
                    </div>
                </div>

                <!-- 필터 영역 추가 -->
                <div class="filter-section">
                    <div class="flex items-center gap-4 mb-4">
                        <Dropdown
                            v-model="filters.type"
                            :options="inquiryTypes"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="문의유형 선택"
                            class="w-[180px]"
                            @change="handleFilterChange"
                        />
                        <div class="relative w-[300px]">
                            <span class="p-input-icon-right w-full">
                                <InputText
                                    v-model="filters.keyword"
                                    placeholder="제목, 내용으로 검색"
                                    class="w-full pr-8"
                                    @keyup.enter="handleFilterChange"
                                />
                                <i class="pi pi-search cursor-pointer" @click="handleFilterChange" />
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 문의 목록 테이블 -->
                <div class="inquiries-table">
                    <div v-if="loading" class="text-center py-4">
                        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                        <p class="mt-2">문의 목록을 불러오는 중...</p>
                    </div>
                    <table v-else>
                        <thead>
                            <tr>
                                <th>등록일시</th>
                                <th>문의유형</th>
                                <th>제목</th>
                                <th>문의자</th>
                                <th>이메일</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="inquiry in filteredInquiries" :key="inquiry.id">
                                <td>{{ inquiry.createdAt }}</td>
                                <td>{{ getInquiryTypeLabel(inquiry.type) }}</td>
                                <td>{{ inquiry.subject }}</td>
                                <td>{{ inquiry.userName }}</td>
                                <td>{{ inquiry.email }}</td>
                                <td>
                                    <span :class="['status-badge', getStatusStyle(inquiry.statusCd)]">
                                        {{ getStatusLabel(inquiry.statusCd) }}
                                    </span>
                                </td>
                                <td>
                                    <Button 
                                        icon="pi pi-eye" 
                                        class="p-button-text" 
                                        @click="viewDetail(inquiry)"
                                    />
                                </td>
                            </tr>
                            <tr v-if="filteredInquiries.length === 0">
                                <td colspan="7" class="text-center py-4">
                                    문의 내역이 없습니다.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <!-- 페이지네이션 -->
                    <div v-if="pagination.totalCount > 0" class="pagination-container">
                        <div class="flex justify-center mt-4">
                            <Button 
                                v-for="page in Math.ceil(pagination.totalCount / 10)" 
                                :key="page"
                                :class="['mx-1', pagination.page === page ? 'p-button-primary' : 'p-button-text']"
                                @click="handlePageChange(page)"
                            >
                                {{ page }}
                            </Button>
                        </div>
                    </div>
                </div>

                <!-- 상세 보기 모달 -->
                <Dialog 
                    v-model:visible="showDetailModal"
                    :modal="true"
                    :style="{ width: '600px' }"
                    header="문의 상세"
                    :closable="false"
                >
                    <template v-if="detailLoading">
                        <div class="text-center py-4">
                            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                            <p class="mt-2">문의 상세 정보를 불러오는 중...</p>
                        </div>
                    </template>
                    <template v-else-if="selectedInquiry">
                        <div class="p-4">
                            <div class="inquiry-detail">
                                <h3>문의 내용</h3>
                                <div class="detail-item">
                                    <p><strong>문의유형:</strong> {{ getInquiryTypeLabel(selectedInquiry.type) }}</p>
                                    <p><strong>제목:</strong> {{ selectedInquiry.subject }}</p>
                                    <p><strong>문의자:</strong> {{ selectedInquiry.userName }}</p>
                                    <p><strong>이메일:</strong> {{ selectedInquiry.email }}</p>
                                    <p><strong>문의 내용:</strong></p>
                                    <p class="content">{{ selectedInquiry.content }}</p>
                                </div>

                                <div class="reply-section">
                                    <div class="flex justify-between items-center mb-2">
                                        <h3>답변</h3>
                                        <div v-if="selectedInquiry.statusCd === 'HELP_ST_2'" class="text-sm text-gray-500">
                                            답변일시: {{ selectedInquiry.replies?.[0]?.createdAt || '-' }}
                                        </div>
                                    </div>
                                    <div v-if="selectedInquiry.statusCd === 'HELP_ST_1'" class="text-sm text-gray-500 mb-2">
                                        * 답변 등록 시 문의자의 이메일({{ selectedInquiry.email }})로 답변 내용이 발송됩니다.
                                    </div>
                                    <textarea 
                                        v-model="replyContent"
                                        rows="4"
                                        class="w-full p-2 border rounded"
                                        :placeholder="selectedInquiry.statusCd === 'HELP_ST_1' ? '답변을 입력하세요' : ''"
                                        :disabled="selectedInquiry.statusCd !== 'HELP_ST_1'"
                                    ></textarea>
                                </div>
                            </div>

                            <div class="flex justify-end gap-2 mt-4">
                                <Button 
                                    v-if="selectedInquiry.statusCd === 'HELP_ST_1'"
                                    label="답변 등록" 
                                    icon="pi pi-send"
                                    class="p-button-primary"
                                    :loading="detailLoading"
                                    @click="submitReply"
                                />
                                <Button 
                                    label="닫기" 
                                    class="p-button-text"
                                    @click="closeDetailModal"
                                />
                            </div>
                        </div>
                    </template>
                </Dialog>
            </div>
        </div>
    </div>

    <!-- Toast 컴포넌트 추가 -->
    <Toast />
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

.admin-inquiries-page {
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
        }
    }
}

.inquiries-table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

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

.inquiry-detail {
    .detail-item {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;

        p {
            margin: 0.5rem 0;
            
            &.content {
                white-space: pre-wrap;
                margin-top: 0.5rem;
                padding: 0.5rem;
                background-color: white;
                border-radius: 4px;
            }
        }
    }

    .reply-section {
        margin-top: 1.5rem;
        
        textarea {
            &:disabled {
                background-color: #f8f9fa;
                cursor: not-allowed;
            }
        }
    }
}

.filter-section {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    :deep(.p-dropdown) {
        height: 38px;

        .p-dropdown-label {
            padding: 0.5rem 0.75rem;
            line-height: 22px;
        }

        .p-dropdown-trigger {
            width: 38px;
        }
    }

    :deep(.p-inputtext) {
        height: 38px;
        padding: 0.5rem 2rem 0.5rem 0.75rem;
        line-height: 22px;
        border-radius: 6px;
        
        &::placeholder {
            color: #9CA3AF;
        }

        &:focus {
            border-color: #8B8BF5;
            box-shadow: 0 0 0 2px rgba(139, 139, 245, 0.1);
        }
    }

    :deep(.p-input-icon-right) {
        width: 100%;
        
        > i {
            right: 0.75rem;
            color: #6B7280;
            cursor: pointer;
            font-size: 0.9rem;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;

            &:hover {
                color: #374151;
            }
        }
    }
}

.pagination-container {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
}
</style> 