<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import { getJobOfferList, deleteJobOffer } from '@/apis/admin/adminApis';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

// API 관련 상태 및 함수
const loading = ref(false);
const interviews = ref([]);
const first = ref(0);
const rows = ref(10);
const totalRecords = ref(0);

// 모달 관련 상태
const showCancelModal = ref(false);
const selectedInterview = ref(null);

// 검색어 상태
const searchQuery = ref('');
const filteredInterviews = computed(() => {
  if (!searchQuery.value) return interviews.value;
  return interviews.value.filter((interview) =>
    interview.company?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 면접 상태에 따른 태그 색상 매핑
const getStatusSeverity = (statusCd) => {
  const severityMap = {
    JO_ST_1: 'warning', // 대기중
    JO_ST_2: 'success', // 수락
    JO_ST_3: 'danger' // 거절
  };
  return severityMap[statusCd] || 'secondary';
};

// 면접 취소 모달 열기
const openCancelModal = (interview) => {
  selectedInterview.value = interview;
  showCancelModal.value = true;
};

// 면접 취소 처리
const cancelInterview = async () => {
  if (!selectedInterview.value) return;

  // 사용자에게 한 번 더 확인
  confirm.require({
    message: '정말로 이 면접 제안을 철회하시겠습니까?',
    header: '면접 제안 철회 확인',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '철회',
    rejectLabel: '취소',
    accept: async () => {
      try {
        loading.value = true;

        // API 호출로 면접 제안 철회
        await deleteJobOffer(selectedInterview.value.id);

        // 성공 메시지 표시
        toast.add({
          severity: 'success',
          summary: '성공',
          detail: '면접 제안이 철회되었습니다.',
          life: 3000
        });

        // 목록 새로고침
        fetchInterviews();
      } catch (error) {
        console.error('면접 제안 철회 중 오류 발생:', error);

        // 오류 메시지 표시
        toast.add({
          severity: 'error',
          summary: '오류',
          detail: '면접 제안 철회 중 오류가 발생했습니다.',
          life: 3000
        });
      } finally {
        loading.value = false;
        showCancelModal.value = false;
      }
    }
  });
};

// 면접 목록 조회
const fetchInterviews = async () => {
  try {
    loading.value = true;

    // API 호출로 면접 목록 조회
    const response = await getJobOfferList({
      page: Math.floor(first.value / rows.value) + 1,
      perPage: rows.value
    });

    // 응답 데이터 처리
    if (response && response.contents) {
      // JSON 문자열을 파싱하여 객체로 변환
      interviews.value = response.contents.map((item) => {
        try {
          // 문자열로 된 JSON 데이터를 파싱
          if (typeof item === 'string') {
            return JSON.parse(item);
          }
          return item;
        } catch (e) {
          console.error('데이터 파싱 오류:', e);
          return item;
        }
      });

      totalRecords.value = response.pagination.totalCount;
    } else {
      interviews.value = [];
      totalRecords.value = 0;
    }
  } catch (error) {
    console.error('면접 목록 조회 중 오류 발생:', error);

    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '면접 목록을 불러오는 중 오류가 발생했습니다.',
      life: 3000
    });

    interviews.value = [];
    totalRecords.value = 0;
  } finally {
    loading.value = false;
  }
};

// 페이지 변경 핸들러
const onPage = (event) => {
  pagination.value = {
    ...pagination.value,
    page: event.page + 1,
    first: event.first,
    rows: event.rows
  };
  fetchInterviews();
};

// 페이지 로드 시 면접 목록 조회
onMounted(() => {
  fetchInterviews();
});

// 뒤로가기 함수
const goBack = () => {
  router.push('/admin');
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};
</script>

<template>
  <div class="admin-layout">
    <AdminHeader />
    <AdminSidebar />
    <ConfirmDialog />

    <div class="admin-content">
      <div class="admin-interview-page">
        <div class="page-header">
          <div class="header-content">
            <Button icon="pi pi-arrow-left" class="p-button-text p-button-rounded" @click="goBack" />
            <h1>면접제안/현황 관리</h1>
          </div>
        </div>

        <!-- 면접 목록 -->
        <div class="interview-list">
          <!-- 검색 영역 -->
          <div class="search-container">
            <div class="search-input-wrapper">
              <InputText v-model="searchQuery" placeholder="기업명으로 검색" class="search-input" />
              <i class="pi pi-search search-icon"></i>
            </div>
          </div>

          <!-- 데이터 테이블 -->
          <div class="table-container">
            <DataTable
              :value="filteredInterviews"
              :loading="loading"
              :scrollable="true"
              scrollHeight="flex"
              class="p-datatable-sm"
              :paginator="true"
              :rows="rows"
              :totalRecords="totalRecords"
              v-model:first="first"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              :rowsPerPageOptions="[10, 20, 50]"
              @page="fetchInterviews"
            >
              <Column field="index" header="순번" style="width: 80px">
                <template #body="{ index }">
                  {{ (Math.floor(first / rows) + 1) * rows + index + 1 }}
                </template>
              </Column>
              <Column field="company.name" header="기업명" style="width: 160px" :sortable="true">
                <template #body="{ data }">
                  {{ data.company?.name || '-' }}
                </template>
              </Column>
              <Column field="position" header="직무" style="width: 160px" :sortable="true">
                <template #body="{ data }">
                  {{ data.position || '-' }}
                </template>
              </Column>
              <Column field="resume.user.name" header="구직자" style="width: 120px" :sortable="true">
                <template #body="{ data }">
                  {{ data.resume?.user?.name || data.resume?.userId || '-' }}
                </template>
              </Column>
              <Column field="createdAt" header="면접 제안일자" style="width: 120px" :sortable="true">
                <template #body="{ data }">
                  {{ formatDate(data.createdAt) || '-' }}
                </template>
              </Column>
              <Column field="status.name" header="상태" style="width: 100px" :sortable="true">
                <template #body="{ data }">
                  <Tag :value="data.status?.name || '-'" :severity="getStatusSeverity(data.statusCd)" />
                </template>
              </Column>
              <Column header="관리" style="width: 100px">
                <template #body="{ data }">
                  <Button
                    label="철회"
                    class="p-button-outlined p-button-secondary p-button-sm"
                    @click="openCancelModal(data)"
                  />
                </template>
              </Column>
              <template #empty>
                <div class="text-center py-4">데이터가 없습니다.</div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 면접 취소 모달 -->
  <Dialog v-model:visible="showCancelModal" :style="{ width: '400px' }" :modal="true" class="interview-cancel-modal">
    <template #header>
      <div class="modal-header">
        <i class="pi pi-exclamation-triangle" style="font-size: 1.2rem; color: #f59e0b; margin-right: 0.5rem"></i>
        <span>면접 제안 철회</span>
      </div>
    </template>
    <div class="p-fluid modal-content">
      <div class="confirmation-message">
        <p>정말로 이 면접 제안을 철회하시겠습니까?</p>
      </div>
      <div v-if="selectedInterview" class="interview-info">
        <div class="info-item">
          <span>기업명: {{ selectedInterview.company?.name || '-' }}</span>
        </div>
        <div class="info-item">
          <span>직무: {{ selectedInterview.position || '-' }}</span>
        </div>
        <div class="info-item">
          <span>구직자: {{ selectedInterview.resume?.user?.name || selectedInterview.resume?.userId || '-' }}</span>
        </div>
        <div class="info-item">
          <span>면접 제안일자: {{ formatDate(selectedInterview.createdAt) || '-' }}</span>
        </div>
        <div class="info-item">
          <span>상태: </span>
          <Tag
            :value="selectedInterview.status?.name || '-'"
            :severity="getStatusSeverity(selectedInterview.statusCd)"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="modal-footer">
        <Button label="취소" class="p-button-text" @click="showCancelModal = false" />
        <Button label="철회" class="p-button-outlined p-button-secondary" @click="cancelInterview" />
      </div>
    </template>
  </Dialog>
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

.admin-interview-page {
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

  .interview-list {
    .search-container {
      margin-bottom: 1rem;
      padding: 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .search-input-wrapper {
        position: relative;
        width: 300px;

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 0.9rem;
        }
      }

      .search-input {
        width: 100%;
        border-radius: 6px;
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
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .pagination-info {
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
      cursor: default;

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }
  }
}

// 테이블 스크롤을 위한 컨테이너 설정
.interview-list {
  .table-container {
    max-height: calc(100vh - 300px); // 적절한 높이로 조정
    overflow: auto;
  }
}

// 모달 스타일
.interview-cancel-modal {
  :deep(.p-dialog-header) {
    border-bottom: 1px solid #e5e7eb;
    padding: 1.25rem 1.5rem;
    background-color: #f8fafc;

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 600;

      i {
        position: relative;
        top: 1px;
      }
    }
  }

  :deep(.p-dialog-content) {
    padding: 2rem 1.5rem;

    .modal-content {
      .confirmation-message {
        margin-bottom: 2rem;

        p {
          margin: 0;
          color: #92400e;
          font-weight: 500;
          font-size: 1.1rem;
        }
      }

      .interview-info {
        background-color: #f8fafc;
        border-radius: 0.5rem;
        padding: 2rem;
        width: 100%;

        .info-item {
          & + .info-item {
            margin-top: 1.5rem;
          }

          span {
            color: #1e293b;
            font-size: 0.95rem;
            line-height: 1.5;
          }
        }
      }
    }
  }

  :deep(.p-dialog-footer) {
    border-top: 1px solid #e5e7eb;
    padding: 1.25rem 1.5rem;
    background-color: #f8fafc;

    .modal-footer {
      display: flex;
      justify-content: center;
      gap: 1rem;

      .p-button {
        min-width: 100px;
      }
    }
  }
}

:deep(.p-confirm-dialog) {
  .p-dialog-content {
    padding: 2rem;

    .p-confirm-dialog-message {
      margin-left: 1rem;
      color: #374151;
    }
  }

  .p-dialog-footer {
    padding: 1.5rem;

    .p-button {
      min-width: 6rem;

      &.p-button-outlined {
        border-color: #e5e7eb;
        color: #4b5563;

        &:hover {
          background-color: #f3f4f6;
          border-color: #d1d5db;
        }
      }

      &.p-button-danger {
        background-color: #ef4444;
        border-color: #ef4444;

        &:hover {
          background-color: #dc2626;
          border-color: #dc2626;
        }
      }
    }
  }
}
</style>
