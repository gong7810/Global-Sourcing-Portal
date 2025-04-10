<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import {
  getAllCompanyApplications,
  approveCompanyApplication,
  getPendingCompanyApplications
} from '@/apis/company/companyApis';
import { useMessagePop } from '@/plugins/commonutils';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Tag from 'primevue/tag';

const router = useRouter();
const messagePop = useMessagePop();

// 로딩 상태 추가
const loading = ref(true);

// 신청 목록 데이터
const applications = ref([]);
const filterStatus = ref('all'); // 'all', 'pending', 'approved', 'rejected'

// 페이지네이션 관련 상태 추가
const first = ref(0);
const rows = ref(10);
const totalRecords = ref(0);

// 검색어 상태
const searchQuery = ref('');

// 필터링된 신청 목록
const filteredApplications = computed(() => {
  if (!searchQuery.value) return applications.value;
  return applications.value.filter((app) => app.businessName?.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// 신청 목록 로드
const loadApplications = async () => {
  try {
    // 미승인 기업 목록 가져오기
    const pendingResponse = await getPendingCompanyApplications();

    let allApplications = pendingResponse.contents;
    // 승인된 기업 목록 가져오기 (notApproved=false로 설정)
    // const approvedResponse = await getAllCompanyApplications('&notApproved=false');

    // // 두 응답을 합치기
    // let allApplications = [];

    // if (pendingResponse && pendingResponse.contents) {
    //   allApplications = [...pendingResponse.contents];
    // }

    // if (approvedResponse && approvedResponse.contents) {
    //   allApplications = [...allApplications, ...approvedResponse.contents];
    // }

    // 데이터 매핑
    applications.value = allApplications.map((app) => ({
      id: app.id,
      createdAt: app.createdAt,
      businessName: app.name,
      businessRegistrationNo: app.businessNumber,
      ownerName: app.ceoName,
      managerName: app.user?.name || '',
      businessPhoneNo: app.phone,
      businessEmail: app.user?.email || '',
      businessAddress: app.address,
      businessType: app.companyTypeCd,
      status: app.isApproved === null ? 'PENDING' : app.isApproved ? 'APPROVED' : 'REJECTED',
      fileUrl: app.registrationFile,
      fileName: '사업자등록증명원.pdf'
    }));

    // ID 기준으로 내림차순 정렬 (최신순)
    applications.value.sort((a, b) => b.id - a.id);

    // 필터 적용
    if (filterStatus.value !== 'all') {
      applications.value = applications.value.filter((app) => app.status === filterStatus.value.toUpperCase());
    }

    // 전체 레코드 수 설정
    totalRecords.value = applications.value.length;
  } catch (error) {
    console.error('신청 목록 로드 실패:', error);
  } finally {
    loading.value = false;
  }
};

// 필터 변경 시 목록 새로고침
const handleFilterChange = () => {
  loadApplications();
};

// 페이지 로드 시 신청 목록 가져오기
onMounted(async () => {
  await loadApplications();
});

const selectedApplication = ref(null);
const showDetailModal = ref(false);
const rejectReason = ref('');

// 신청 상태에 따른 스타일
const getStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
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
      await approveCompanyApplication({
        id: id,
        isApproved: true
      });

      // 목록 새로고침
      await loadApplications();

      showDetailModal.value = false;
      messagePop.toast('승인되었습니다.', 'success');
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
      await approveCompanyApplication({
        id: id,
        isApproved: false,
        rejectReason: rejectReason.value
      });

      // 목록 새로고침
      await loadApplications();

      messagePop.toast('거절되었습니다.', 'success');

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
            <Button icon="pi pi-arrow-left" class="p-button-text p-button-rounded" @click="goBack" />
            <h1>기업회원 신청 관리</h1>
          </div>
          <div class="filter-section">
            <select v-model="filterStatus" @change="handleFilterChange" class="filter-select">
              <option value="all">전체</option>
              <option value="pending">대기</option>
              <option value="approved">승인</option>
              <option value="rejected">거절</option>
            </select>
          </div>
        </div>

        <!-- 검색 영역 -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <InputText v-model="searchQuery" placeholder="기업명으로 검색" class="search-input" />
            <i class="pi pi-search search-icon"></i>
          </div>
        </div>

        <!-- 신청 목록 테이블 -->
        <div class="table-container">
          <DataTable
            :value="filteredApplications"
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
          >
            <Column field="createdAt" header="신청일" :sortable="true"></Column>
            <Column field="businessName" header="기업명" :sortable="true"></Column>
            <Column field="businessRegistrationNo" header="사업자등록번호" :sortable="true"></Column>
            <Column field="ownerName" header="대표자명" :sortable="true"></Column>
            <Column field="managerName" header="가입자명" :sortable="true"></Column>
            <Column field="status" header="상태" :sortable="true">
              <template #body="{ data }">
                <Tag
                  :value="data.status === 'PENDING' ? '대기' : data.status === 'APPROVED' ? '승인' : '거절'"
                  :severity="data.status === 'PENDING' ? 'warn' : data.status === 'APPROVED' ? 'success' : 'danger'"
                />
              </template>
            </Column>
            <Column header="관리" :style="{ width: '100px' }">
              <template #body="{ data }">
                <Button
                  label="상세"
                  class="p-button-outlined p-button-secondary p-button-sm"
                  @click="viewDetail(data)"
                />
              </template>
            </Column>
            <template #empty>
              <div v-if="!loading" class="text-center py-4">데이터가 없습니다.</div>
            </template>
          </DataTable>
        </div>

        <!-- 상세 정보 모달 -->
        <Dialog v-model:visible="showDetailModal" :modal="true" :style="{ width: '650px' }" header="기업회원 신청 상세">
          <div v-if="selectedApplication" class="p-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="detail-item">
                <h3>기본 정보</h3>
                <p><strong>기업명:</strong> {{ selectedApplication.businessName }}</p>
                <p><strong>사업자등록번호:</strong> {{ selectedApplication.businessRegistrationNo }}</p>
                <p><strong>대표자명:</strong> {{ selectedApplication.ownerName }}</p>
                <p><strong>기업주소:</strong> {{ selectedApplication.businessAddress }}</p>
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
              <p v-if="!selectedApplication.fileUrl" class="text-sm text-red-500 mt-1">* 첨부된 파일이 없습니다.</p>
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
              <Button label="닫기" class="p-button-text" @click="closeDetailModal" />
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
    display: flex;
    justify-content: space-between;
    align-items: center;

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

    .filter-section {
      .filter-select {
        padding: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        background-color: white;
        color: #374151;
        font-size: 0.875rem;
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: #8fa1ff;
          box-shadow: 0 0 0 2px rgba(143, 161, 255, 0.2);
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
}

.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;

  :deep(.p-datatable) {
    .p-datatable-loading-overlay {
      display: none !important;
    }

    .p-datatable-loading-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }

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
