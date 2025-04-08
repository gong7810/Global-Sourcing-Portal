<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';

const router = useRouter();
const toast = useToast();

// 면접 상태 상수
const INTERVIEW_STATUS = {
  JO_ST_1: '대기중',
  JO_ST_2: '확정',
  JO_ST_3: '취소',
  JO_ST_4: '완료'
};

// 면접 유형 상수
const INTERVIEW_TYPE = {
  INTERVIEW_TY_1: '대면',
  INTERVIEW_TY_2: '비대면'
};

// API 관련 상태 및 함수
const loading = ref(false);
const interviews = ref([]);
const pagination = ref({
  page: 1,
  totalCount: 0
});

// 모달 관련 상태
const showStatusModal = ref(false);
const showCancelModal = ref(false);
const showDetailModal = ref(false);
const selectedInterview = ref(null);
const newStatus = ref(null);

// 면접 상태에 따른 태그 색상 매핑
const getStatusSeverity = (status) => {
  const severityMap = {
    '대기중': 'warning',
    '확정': 'success',
    '취소': 'danger',
    '완료': 'info'
  };
  return severityMap[status] || 'info';
};

// 면접 정보 수정
const editInterview = (data) => {
  // TODO: 면접 정보 수정 로직 구현
  toast.add({
    severity: 'info',
    summary: '알림',
    detail: '면접 정보 수정 기능 준비 중입니다.',
    life: 3000
  });
};

// 면접 삭제
const deleteInterview = (data) => {
  // TODO: 면접 삭제 로직 구현
  toast.add({
    severity: 'info',
    summary: '알림',
    detail: '면접 삭제 기능 준비 중입니다.',
    life: 3000
  });
};

// 면접 상세 정보 보기
const viewInterviewDetail = (data) => {
  selectedInterview.value = data;
  showDetailModal.value = true;
};

// 면접 상태 변경 모달 열기
const openStatusModal = (interview) => {
  selectedInterview.value = interview;
  newStatus.value = interview.status;
  showStatusModal.value = true;
};

// 면접 취소 모달 열기
const openCancelModal = (interview) => {
  selectedInterview.value = interview;
  showCancelModal.value = true;
};

// 면접 상태 변경 처리
const changeInterviewStatus = () => {
  if (!selectedInterview.value || !newStatus.value) return;
  
  // 실제 API 호출로 대체 예정
  const index = interviews.value.findIndex(item => item.id === selectedInterview.value.id);
  if (index !== -1) {
    interviews.value[index].status = newStatus.value;
    
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '면접 상태가 변경되었습니다.',
      life: 3000
    });
  }
  
  showStatusModal.value = false;
};

// 면접 취소 처리
const cancelInterview = () => {
  if (!selectedInterview.value) return;
  
  // 실제 API 호출로 대체 예정
  const index = interviews.value.findIndex(item => item.id === selectedInterview.value.id);
  if (index !== -1) {
    interviews.value[index].status = 'JO_ST_3'; // 취소 상태로 변경
    
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '면접이 취소되었습니다.',
      life: 3000
    });
  }
  
  showCancelModal.value = false;
};

// 샘플 데이터 로드 (실제로는 API 호출로 대체)
onMounted(() => {
  loading.value = true;
  // 임시 데이터
  setTimeout(() => {
    interviews.value = [
      {
        id: 67,
        companyId: 2,
        resumeId: 4,
        jobCategoryCd: 'JOB_04',
        position: 'CEO',
        companyName: '철전팔기',
        content: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
        status: 'JO_ST_2',
        interviewResult: 'INTERVIEW_RESULT_2',
        memo: 'ㅁㄴㅇ',
        interviewDate: '2025-04-09 02:30:00',
        interviewType: 'INTERVIEW_TY_2',
        interviewUrl: 'ㅁㅁ',
        createdAt: '2025-04-07 04:28:03',
        updatedAt: '2025-04-07 13:40:39',
        // 지원자 정보 추가
        applicantName: '김철수',
        applicantEmail: 'kim@example.com',
        applicantPhone: '010-1234-5678',
        resumeTitle: '웹 개발자 이력서'
      },
      {
        id: 70,
        companyId: 3,
        resumeId: 4,
        jobCategoryCd: 'JOB_02',
        position: 'test',
        companyName: 'test',
        content: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
        status: 'JO_ST_2',
        memo: '',
        interviewDate: '2025-04-15 02:10:00',
        interviewStartTime: '2025-04-23 02:30:00',
        interviewEndTime: '2025-04-23 02:30:00',
        interviewType: 'INTERVIEW_TY_1',
        interviewUrl: 'z',
        createdAt: '2025-04-08 08:55:56',
        updatedAt: '2025-04-08 09:59:53',
        // 지원자 정보 추가
        applicantName: '이영희',
        applicantEmail: 'lee@example.com',
        applicantPhone: '010-9876-5432',
        resumeTitle: '프론트엔드 개발자 이력서'
      },
      {
        id: 71,
        companyId: 5,
        resumeId: 4,
        jobCategoryCd: 'JOB_06',
        position: '풀스택 개발자',
        companyName: 'SI 웹 개발',
        content: '안녕하세요. 귀하의 프로필을 보고 연락드립니다.',
        status: 'JO_ST_1',
        memo: '',
        interviewDate: '2025-04-08 02:30:00',
        interviewStartTime: '2025-04-09 05:40:00',
        interviewEndTime: '2025-04-10 07:20:00',
        interviewType: 'INTERVIEW_TY_1',
        interviewUrl: 'www.naver.com',
        createdAt: '2025-04-08 11:03:12',
        updatedAt: '2025-04-08 21:35:03',
        // 지원자 정보 추가
        applicantName: '박지성',
        applicantEmail: 'park@example.com',
        applicantPhone: '010-5555-7777',
        resumeTitle: '백엔드 개발자 이력서'
      }
    ];
    pagination.value = {
      page: 1,
      totalCount: 3
    };
    loading.value = false;
  }, 500);
});

// 페이지 로드 시 면접 목록 조회
const fetchInterviews = () => {
  // 실제 API 호출로 대체 예정
  console.log('면접 목록 조회');
};

// 뒤로가기 함수
const goBack = () => {
  router.push('/admin');
};

// 상태 코드를 한글로 변환
const getStatusText = (statusCode) => {
  return INTERVIEW_STATUS[statusCode] || statusCode;
};

// 면접 유형 코드를 한글로 변환
const getInterviewTypeText = (typeCode) => {
  return INTERVIEW_TYPE[typeCode] || typeCode;
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

// 시간 포맷팅
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 상태 옵션 목록 생성
const statusOptions = Object.entries(INTERVIEW_STATUS).map(([code, label]) => ({
  code,
  label
}));
</script>

<template>
  <div class="admin-layout">
    <AdminHeader />
    <AdminSidebar />

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
          <!-- 테이블 -->
          <div class="table-container">
            <div v-if="loading" class="loading-overlay">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>
            <table>
              <thead>
                <tr>
                  <th>순번</th>
                  <th>기업명</th>
                  <th>채용 포지션</th>
                  <th>지원자</th>
                  <th>면접 일자</th>
                  <th>면접 시간</th>
                  <th>면접 유형</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(interview, index) in interviews" :key="interview.id" class="cursor-pointer hover:bg-gray-50">
                  <td>{{ (pagination.page - 1) * 10 + index + 1 }}</td>
                  <td>{{ interview.companyName }}</td>
                  <td>{{ interview.position }}</td>
                  <td>{{ interview.applicantName }}</td>
                  <td>{{ formatDate(interview.interviewDate) }}</td>
                  <td>
                    <span v-if="interview.interviewStartTime && interview.interviewEndTime">
                      {{ formatTime(interview.interviewStartTime) }} - {{ formatTime(interview.interviewEndTime) }}
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td>{{ getInterviewTypeText(interview.interviewType) }}</td>
                  <td>
                    <Tag :value="getStatusText(interview.status)" :severity="getStatusSeverity(getStatusText(interview.status))" />
                  </td>
                  <td>
                    <Button 
                      icon="pi pi-eye" 
                      class="p-button-text p-button-sm mr-2"
                      @click="viewInterviewDetail(interview)"
                    />
                    <Button 
                      icon="pi pi-pencil" 
                      class="p-button-text p-button-sm mr-2"
                      @click="editInterview(interview)"
                    />
                    <Button 
                      icon="pi pi-sync" 
                      class="p-button-text p-button-sm mr-2"
                      @click="openStatusModal(interview)"
                    />
                    <Button 
                      icon="pi pi-times" 
                      class="p-button-text p-button-danger p-button-sm"
                      @click="openCancelModal(interview)"
                    />
                  </td>
                </tr>
                <tr v-if="interviews.length === 0">
                  <td colspan="9" class="text-center py-4">데이터가 없습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 페이지네이션 -->
          <div class="pagination-container">
            <div class="pagination-info">
              총 {{ pagination.totalCount }}건 중 {{ (pagination.page - 1) * 10 + 1 }}-{{
                Math.min(pagination.page * 10, pagination.totalCount)
              }}건
            </div>
            <div class="pagination-controls">
              <Button
                icon="pi pi-angle-double-left"
                class="p-button-text"
                :disabled="pagination.page === 1"
                @click="
                  pagination.page = 1;
                  fetchInterviews();
                "
              />
              <Button
                icon="pi pi-angle-left"
                class="p-button-text"
                :disabled="pagination.page === 1"
                @click="
                  pagination.page--;
                  fetchInterviews();
                "
              />
              <span class="mx-2">{{ pagination.page }}</span>
              <Button
                icon="pi pi-angle-right"
                class="p-button-text"
                :disabled="pagination.page * 10 >= pagination.totalCount"
                @click="
                  pagination.page++;
                  fetchInterviews();
                "
              />
              <Button
                icon="pi pi-angle-double-right"
                class="p-button-text"
                :disabled="pagination.page * 10 >= pagination.totalCount"
                @click="
                  pagination.page = Math.ceil(pagination.totalCount / 10);
                  fetchInterviews();
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 면접 상세 정보 모달 -->
  <Dialog 
    v-model:visible="showDetailModal" 
    header="면접 상세 정보" 
    :style="{ width: '600px' }" 
    :modal="true"
  >
    <div v-if="selectedInterview" class="p-fluid">
      <div class="detail-section">
        <h3 class="section-title">기업 정보</h3>
        <table class="info-table">
          <tr>
            <th>기업명</th>
            <td>{{ selectedInterview.companyName }}</td>
          </tr>
          <tr>
            <th>채용 포지션</th>
            <td>{{ selectedInterview.position }}</td>
          </tr>
        </table>
      </div>
      
      <div class="detail-section">
        <h3 class="section-title">지원자 정보</h3>
        <table class="info-table">
          <tr>
            <th>이름</th>
            <td>{{ selectedInterview.applicantName }}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{{ selectedInterview.applicantEmail }}</td>
          </tr>
          <tr>
            <th>연락처</th>
            <td>{{ selectedInterview.applicantPhone }}</td>
          </tr>
          <tr>
            <th>이력서</th>
            <td>{{ selectedInterview.resumeTitle }}</td>
          </tr>
        </table>
      </div>
      
      <div class="detail-section">
        <h3 class="section-title">면접 정보</h3>
        <table class="info-table">
          <tr>
            <th>면접 일자</th>
            <td>{{ formatDate(selectedInterview.interviewDate) }}</td>
          </tr>
          <tr>
            <th>면접 시간</th>
            <td>
              <span v-if="selectedInterview.interviewStartTime && selectedInterview.interviewEndTime">
                {{ formatTime(selectedInterview.interviewStartTime) }} - {{ formatTime(selectedInterview.interviewEndTime) }}
              </span>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <th>면접 유형</th>
            <td>{{ getInterviewTypeText(selectedInterview.interviewType) }}</td>
          </tr>
          <tr>
            <th>면접 URL</th>
            <td>{{ selectedInterview.interviewUrl || '-' }}</td>
          </tr>
          <tr>
            <th>상태</th>
            <td>
              <Tag :value="getStatusText(selectedInterview.status)" :severity="getStatusSeverity(getStatusText(selectedInterview.status))" />
            </td>
          </tr>
        </table>
      </div>
      
      <div class="detail-section">
        <h3 class="section-title">제안 내용</h3>
        <div class="content-box">
          {{ selectedInterview.content }}
        </div>
      </div>
      
      <div class="detail-section" v-if="selectedInterview.memo">
        <h3 class="section-title">메모</h3>
        <div class="content-box">
          {{ selectedInterview.memo }}
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="닫기" icon="pi pi-times" class="p-button-text" @click="showDetailModal = false" />
    </template>
  </Dialog>

  <!-- 면접 상태 변경 모달 -->
  <Dialog 
    v-model:visible="showStatusModal" 
    header="면접 상태 변경" 
    :style="{ width: '450px' }" 
    :modal="true"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="status">면접 상태</label>
        <Dropdown
          id="status"
          v-model="newStatus"
          :options="statusOptions"
          optionLabel="label"
          optionValue="code"
          placeholder="면접 상태 선택"
        />
      </div>
    </div>
    <template #footer>
      <Button label="취소" icon="pi pi-times" class="p-button-text" @click="showStatusModal = false" />
      <Button label="변경" icon="pi pi-check" class="p-button-primary" @click="changeInterviewStatus" />
    </template>
  </Dialog>

  <!-- 면접 취소 모달 -->
  <Dialog 
    v-model:visible="showCancelModal" 
    header="면접 취소" 
    :style="{ width: '450px' }" 
    :modal="true"
  >
    <div class="p-fluid">
      <p>정말로 이 면접을 취소하시겠습니까?</p>
      <div v-if="selectedInterview" class="mt-3">
        <p><strong>기업명:</strong> {{ selectedInterview.companyName }}</p>
        <p><strong>포지션:</strong> {{ selectedInterview.position }}</p>
        <p><strong>지원자:</strong> {{ selectedInterview.applicantName }}</p>
        <p><strong>면접 일자:</strong> {{ formatDate(selectedInterview.interviewDate) }}</p>
      </div>
    </div>
    <template #footer>
      <Button label="취소" icon="pi pi-times" class="p-button-text" @click="showCancelModal = false" />
      <Button label="확인" icon="pi pi-check" class="p-button-danger" @click="cancelInterview" />
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
    .table-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: auto;

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
            width: 60px;
          } // 순번
          &:nth-child(2) {
            width: 120px;
          } // 기업명
          &:nth-child(3) {
            width: 120px;
          } // 채용 포지션
          &:nth-child(4) {
            width: 100px;
          } // 지원자
          &:nth-child(5) {
            width: 100px;
          } // 면접 일자
          &:nth-child(6) {
            width: 120px;
          } // 면접 시간
          &:nth-child(7) {
            width: 80px;
          } // 면접 유형
          &:nth-child(8) {
            width: 80px;
          } // 상태
          &:nth-child(9) {
            width: 120px;
          } // 관리
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

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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
:deep(.p-dialog) {
  .p-dialog-header {
    padding: 1rem 1.5rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e5e7eb;
  }

  .p-dialog-content {
    padding: 1.5rem;
  }

  .p-dialog-footer {
    padding: 1rem 1.5rem;
    background-color: #f8f9fa;
    border-top: 1px solid #e5e7eb;
  }
}

// 드롭다운 스타일
:deep(.p-dropdown) {
  width: 100%;
}

// 상세 정보 모달 스타일
.detail-section {
  margin-bottom: 1.5rem;
  
  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .content-box {
    padding: 0.75rem;
    background-color: #f9fafb;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    min-height: 60px;
    white-space: pre-wrap;
  }
}
</style> 