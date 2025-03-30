<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import AdminHeader from '@/components/admin/AdminHeader.vue';

const router = useRouter();
const toast = useToast();

// 문의유형 정의 (카테고리를 문의유형으로 변경)
const inquiryTypes = [
    { label: '전체', value: null },
    { label: '서비스 이용 문의', value: 'service' },
    { label: '기술적 문제', value: 'technical' },
    { label: '결제 관련', value: 'payment' },
    { label: '제안/건의', value: 'suggestion' },
    { label: '기타', value: 'other' }
];

// 필터 상태 (category를 type으로 변경)
const filters = ref({
    type: null,
    keyword: ''
});

// 샘플 문의 데이터 수정
const inquiries = ref([
    {
        id: 1,
        createdAt: '2024-03-20 14:30:00',
        type: 'service',
        title: '기업 회원 전환 문의',
        content: '현재 일반 회원인데 기업 회원으로 전환하고 싶습니다.',
        userName: '김철수',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        status: 'PENDING',
        answer: null
    },
    {
        id: 2,
        createdAt: '2024-03-19 11:20:00',
        type: 'technical',
        title: '로그인 오류',
        content: '로그인 시도 시 오류가 발생합니다.',
        userName: '이영희',
        email: 'lee@example.com',
        phone: '010-9876-5432',
        status: 'ANSWERED',
        answer: '안녕하세요. 브라우저 캐시 삭제 후 다시 시도해보시기 바랍니다.'
    }
]);

// 필터링된 문의 목록
const filteredInquiries = computed(() => {
    return inquiries.value.filter(inquiry => {
        const matchesType = !filters.value.type || inquiry.type === filters.value.type;
        const matchesKeyword = !filters.value.keyword || 
            inquiry.title.toLowerCase().includes(filters.value.keyword.toLowerCase()) ||
            inquiry.content.toLowerCase().includes(filters.value.keyword.toLowerCase()) ||
            inquiry.userName.toLowerCase().includes(filters.value.keyword.toLowerCase());
        return matchesType && matchesKeyword;
    });
});

// 문의유형 레이블 가져오기 (함수명 변경)
const getInquiryTypeLabel = (value) => {
    const type = inquiryTypes.find(t => t.value === value);
    return type ? type.label : '';
};

// 문의 상태에 따른 스타일
const getStatusStyle = (status) => {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'ANSWERED': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

// 상세 보기 모달 관련
const showDetailModal = ref(false);
const selectedInquiry = ref(null);
const replyContent = ref('');
const loading = ref(false);

const viewDetail = (inquiry) => {
    selectedInquiry.value = inquiry;
    replyContent.value = inquiry.answer || '';
    showDetailModal.value = true;
};

const submitReply = async () => {
    if (!replyContent.value) {
        alert('답변 내용을 입력해주세요.');
        return;
    }

    try {
        // 로딩 상태 추가
        loading.value = true;

        // 1. API를 통해 답변 저장
        // await saveInquiryReply(selectedInquiry.value.id, replyContent.value);

        // 2. 이메일 발송
        await sendReplyEmail({
            to: selectedInquiry.value.email,
            inquiryTitle: selectedInquiry.value.title,
            inquiryContent: selectedInquiry.value.content,
            replyContent: replyContent.value,
            userName: selectedInquiry.value.userName
        });
        
        // 임시 로직 (실제로는 API 응답으로 처리)
        const inquiry = inquiries.value.find(i => i.id === selectedInquiry.value.id);
        if (inquiry) {
            inquiry.status = 'ANSWERED';
            inquiry.answer = replyContent.value;
            inquiry.answeredAt = new Date().toISOString();
        }

        toast.add({
            severity: 'success',
            summary: '답변 완료',
            detail: '답변이 등록되었으며, 문의자에게 이메일이 발송되었습니다.',
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
        loading.value = false;
    }
};

// 이메일 발송 함수
const sendReplyEmail = async ({ to, inquiryTitle, inquiryContent, replyContent, userName }) => {
    try {
        // 실제 이메일 발송 API 호출
        // await axios.post('/api/send-email', {
        //     to,
        //     subject: `[글로벌소싱] "${inquiryTitle}" 문의에 대한 답변입니다.`,
        //     template: 'inquiry-reply',
        //     data: {
        //         userName,
        //         inquiryTitle,
        //         inquiryContent,
        //         replyContent,
        //         inquiryDate: selectedInquiry.value.createdAt
        //     }
        // });
        console.log('이메일 발송 성공:', to);
    } catch (error) {
        throw new Error('이메일 발송 실패');
    }
};

const goBack = () => {
    router.push('/admin');
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
                    <div class="flex gap-4 mb-4">
                        <Dropdown
                            v-model="filters.type"
                            :options="inquiryTypes"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="문의유형 선택"
                            class="w-[200px]"
                        />
                        <div class="relative flex-1">
                            <InputText
                                v-model="filters.keyword"
                                placeholder="제목, 내용, 문의자명으로 검색"
                                class="w-full pl-1"
                            />
                        </div>
                    </div>
                </div>

                <!-- 문의 목록 테이블 -->
                <div class="inquiries-table">
                    <table>
                        <thead>
                            <tr>
                                <th>등록일시</th>
                                <th>문의유형</th>
                                <th>제목</th>
                                <th>문의자</th>
                                <th>연락처</th>
                                <th>상태</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="inquiry in filteredInquiries" :key="inquiry.id">
                                <td>{{ inquiry.createdAt }}</td>
                                <td>{{ getInquiryTypeLabel(inquiry.type) }}</td>
                                <td>{{ inquiry.title }}</td>
                                <td>{{ inquiry.userName }}</td>
                                <td>{{ inquiry.phone }}</td>
                                <td>
                                    <span :class="['status-badge', getStatusStyle(inquiry.status)]">
                                        {{ inquiry.status === 'PENDING' ? '답변대기' : '답변완료' }}
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
                        </tbody>
                    </table>
                </div>

                <!-- 상세 보기 모달 -->
                <Dialog 
                    v-model:visible="showDetailModal"
                    :modal="true"
                    :style="{ width: '600px' }"
                    header="문의 상세"
                >
                    <div v-if="selectedInquiry" class="p-4">
                        <div class="inquiry-detail">
                            <h3>문의 내용</h3>
                            <div class="detail-item">
                                <p><strong>문의유형:</strong> {{ getInquiryTypeLabel(selectedInquiry.type) }}</p>
                                <p><strong>제목:</strong> {{ selectedInquiry.title }}</p>
                                <p><strong>문의자:</strong> {{ selectedInquiry.userName }}</p>
                                <p><strong>이메일:</strong> {{ selectedInquiry.email }}</p>
                                <p><strong>연락처:</strong> {{ selectedInquiry.phone }}</p>
                                <p><strong>문의 내용:</strong></p>
                                <p class="content">{{ selectedInquiry.content }}</p>
                            </div>

                            <div class="reply-section">
                                <div class="flex justify-between items-center mb-2">
                                    <h3>답변</h3>
                                    <div v-if="selectedInquiry.status === 'ANSWERED'" class="text-sm text-gray-500">
                                        답변일시: {{ selectedInquiry.answeredAt }}
                                    </div>
                                </div>
                                <div v-if="selectedInquiry.status === 'PENDING'" class="text-sm text-gray-500 mb-2">
                                    * 답변 등록 시 문의자의 이메일({{ selectedInquiry.email }})로 답변 내용이 발송됩니다.
                                </div>
                                <textarea 
                                    v-model="replyContent"
                                    rows="4"
                                    class="w-full p-2 border rounded"
                                    :placeholder="selectedInquiry.status === 'PENDING' ? 
                                        '답변을 입력하세요' : ''"
                                    :disabled="selectedInquiry.status === 'ANSWERED'"
                                ></textarea>
                            </div>
                        </div>

                        <div class="flex justify-end gap-2 mt-4">
                            <Button 
                                v-if="selectedInquiry.status === 'PENDING'"
                                label="답변 등록" 
                                icon="pi pi-send"
                                class="p-button-primary"
                                :loading="loading"
                                @click="submitReply"
                            />
                            <Button 
                                label="닫기" 
                                class="p-button-text"
                                @click="showDetailModal = false"
                            />
                        </div>
                    </div>
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

    :deep(.p-dropdown),
    :deep(.p-inputtext) {
        height: 2.5rem;
    }

    :deep(.p-inputtext) {
        border-radius: 8px;
        
        &::placeholder {
            color: #9CA3AF;
        }
    }

    // 검색창 스타일 추가
    .relative {
        .pi-search {
            font-size: 1.1rem; // 아이콘 크기 조정
        }
        
        .p-inputtext {
            transition: all 0.3s ease;
            
            &:focus {
                border-color: #8B8BF5;
                box-shadow: 0 0 0 2px rgba(139, 139, 245, 0.1);
            }
        }
    }
}
</style> 