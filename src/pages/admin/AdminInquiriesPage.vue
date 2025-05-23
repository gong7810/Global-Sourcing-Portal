<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import { getInquiries, getInquiryDetail, saveReply } from '@/apis/common/commonApis';

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
const first = ref(0);
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
    if (filters.value.type !== null) {
      params.typeCd = filters.value.type; // 문의유형 필터
    }

    if (filters.value.keyword?.trim()) {
      params.keyword = filters.value.keyword.trim(); // 제목 검색
    }

    const response = await getInquiries(params);

    // 응답 데이터 처리
    if (response && Array.isArray(response.contents)) {
      inquiries.value = response.contents;
      pagination.value = response.pagination || { page: 1, totalCount: 0 };
    } else {
      console.error('응답 데이터 형식이 올바르지 않습니다:', response);
      inquiries.value = [];
    }
  } catch (error) {
    console.error('문의 목록 조회 실패:', error);
    inquiries.value = [];
  } finally {
    loading.value = false;
  }
};

// 필터링된 문의 목록
const filteredInquiries = computed(() => {
  let filtered = inquiries.value || [];

  // 문의유형 필터링
  if (filters.value.type !== null) {
    filtered = filtered.filter((item) => item.typeCd === filters.value.type);
  }

  // 키워드 검색 필터링
  if (filters.value.keyword?.trim()) {
    const keyword = filters.value.keyword.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.subject && item.subject.toLowerCase().includes(keyword)) ||
        (item.content && item.content.toLowerCase().includes(keyword))
    );
  }

  return filtered;
});

// 문의유형 레이블 가져오기 (함수명 변경)
const getInquiryTypeLabel = (value) => {
  const type = inquiryTypes.find((t) => t.value === value);
  return type ? type.label : '';
};

// 문의 상태에 따른 스타일
const getStatusStyle = (status) => {
  switch (status) {
    case 'HELP_ST_1':
      return 'bg-yellow-100 text-yellow-800';
    case 'HELP_ST_2':
      return 'bg-green-100 text-green-800';
    case 'HELP_ST_3':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 상태 레이블 가져오기
const getStatusLabel = (status) => {
  switch (status) {
    case 'HELP_ST_1':
      return '답변대기';
    case 'HELP_ST_2':
      return '답변완료';
    case 'HELP_ST_3':
      return '종료';
    default:
      return '알 수 없음';
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
    const response = await saveReply({
      helpId: selectedInquiry.value.id,
      reply: replyContent.value,
      userId: 1 // 관리자 ID
    });

    // 답변이 성공적으로 등록됨
    toast.add({
      severity: 'success',
      summary: '답변 완료',
      detail: '답변이 등록되었습니다.',
      life: 3000
    });

    // 문의 목록 새로고침
    await fetchInquiries();

    // 선택된 문의 상태 업데이트
    if (selectedInquiry.value) {
      selectedInquiry.value.statusCd = 'HELP_ST_2';
    }

    showDetailModal.value = false;
    replyContent.value = ''; // 답변 입력창 초기화
  } catch (error) {
    console.error('답변 처리 중 오류 발생:', error);
  } finally {
    detailLoading.value = false;
  }
};

// 필터 변경 시 목록 새로고침
const handleFilterChange = () => {
  pagination.value.page = 1; // 페이지 초기화
  fetchInquiries();
};

// 페이지 변경 핸들러
const onPage = (event) => {
  first.value = event.first;
  pagination.value.page = event.page + 1;
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
            <Button icon="pi pi-arrow-left" class="p-button-text p-button-rounded" @click="goBack" />
            <h1>문의하기 관리</h1>
          </div>
        </div>

        <!-- 필터 영역 -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <Select
              v-model="filters.type"
              :options="inquiryTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="문의유형 선택"
              checkmark
              class="w-[180px]"
              @change="handleFilterChange"
            />
            <div class="relative w-[300px]">
              <span class="p-input-icon-right w-full">
                <InputText
                  v-model="filters.keyword"
                  placeholder="제목 또는 내용으로 검색"
                  class="w-full pr-8"
                  @keyup.enter="handleFilterChange"
                />
                <i class="pi pi-search cursor-pointer" @click="handleFilterChange" />
              </span>
            </div>
          </div>
        </div>

        <!-- 데이터 테이블 -->
        <div class="table-container">
          <DataTable
            :value="filteredInquiries"
            :loading="loading"
            :scrollable="true"
            scrollHeight="flex"
            class="p-datatable-sm"
            :paginator="true"
            :rows="10"
            :totalRecords="pagination.totalCount"
            v-model:first="first"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]"
            @page="onPage"
          >
            <Column field="index" header="순번" style="width: 80px">
              <template #body="{ index }">
                {{ pagination.totalCount - (first + index) }}
              </template>
            </Column>
            <Column field="createdAt" header="등록일시" style="width: 120px" :sortable="true">
              <template #body="{ data }">
                {{ data.createdAt || '-' }}
              </template>
            </Column>
            <Column field="typeCd" header="문의유형" style="width: 140px" :sortable="true">
              <template #body="{ data }">
                {{ getInquiryTypeLabel(data.typeCd) || '-' }}
              </template>
            </Column>
            <Column field="userId" header="문의자" style="width: 100px" :sortable="true">
              <template #body="{ data }">
                {{ data.userId || '-' }}
              </template>
            </Column>
            <Column field="subject" header="제목" style="width: 200px" :sortable="true">
              <template #body="{ data }">
                {{ data.subject || '-' }}
              </template>
            </Column>
            <Column field="email" header="이메일" style="width: 180px" :sortable="true">
              <template #body="{ data }">
                {{ data.email || '-' }}
              </template>
            </Column>
            <Column field="statusCd" header="상태" style="width: 100px" :sortable="true">
              <template #body="{ data }">
                <Tag 
                  :value="getStatusLabel(data.statusCd)" 
                  :severity="data.statusCd === 'HELP_ST_1' ? 'warning' : data.statusCd === 'HELP_ST_2' ? 'success' : 'info'"
                />
              </template>
            </Column>
            <Column header="관리" style="width: 100px">
              <template #body="{ data }">
                <Button 
                  label="상세"
                  class="p-button-outlined p-button-secondary p-button-sm"
                  @click="viewDetail(data)"
                />
              </template>
            </Column>
            <template #empty>
              <div class="text-center py-4">데이터가 없습니다.</div>
            </template>
          </DataTable>
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
                  <p><strong>문의유형:</strong> {{ getInquiryTypeLabel(selectedInquiry.typeCd) }}</p>
                  <p><strong>제목:</strong> {{ selectedInquiry.subject }}</p>
                  <p><strong>문의자:</strong> {{ selectedInquiry.userId }}</p>
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
                <Button label="닫기" class="p-button-text" @click="closeDetailModal" />
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

.search-container {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .search-input-wrapper {
    display: flex;
    gap: 1rem;
    align-items: center;

    :deep(.p-dropdown) {
      height: 38px;
      width: 180px;

      .p-dropdown-label {
        padding: 0.5rem 0.75rem;
        line-height: 22px;
      }
    }

    :deep(.p-inputtext) {
      height: 38px;
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      line-height: 22px;
      border-radius: 6px;
      width: 300px;

      &::placeholder {
        color: #9ca3af;
      }

      &:focus {
        border-color: #8b8bf5;
        box-shadow: 0 0 0 2px rgba(139, 139, 245, 0.1);
      }
    }

    :deep(.p-input-icon-right) {
      position: relative;

      > i {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
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
}

.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;

  :deep(.p-datatable) {
    .p-datatable-header {
      padding: 1rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e5e7eb;
    }

    .p-datatable-thead > tr > th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #374151;
      position: sticky;
      top: 0;
      z-index: 1;
      font-size: 0.8125rem;
      padding: 0.75rem;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .p-datatable-tbody > tr > td {
      padding: 0.75rem;
      text-align: left;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
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
</style>
