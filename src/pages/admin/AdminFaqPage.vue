<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import { getFaqList, saveFaq, deleteFaq as deleteFaqApi } from '@/apis/common/commonApis';
import { useMessagePop } from '@/plugins/commonutils';

const router = useRouter();
const messagePop = useMessagePop();

const faqItems = ref([]);
const loading = ref(true);

const toggleFaq = (id) => {
  const faq = faqItems.value.find((item) => item.id === id);
  if (faq) {
    faq.isExpanded = !faq.isExpanded;
  }
};

const categories = [
  { label: '전체', value: null },
  { label: '일반', value: 'FAQ_TY_1' },
  { label: '회원가입', value: 'FAQ_TY_2' },
  { label: '서비스 이용', value: 'FAQ_TY_3' }
];
const selectedCategory = ref(null);

const filteredFaqs = computed(() => {
  if (!selectedCategory.value) {
    return faqItems.value;
  }
  return faqItems.value.filter((item) => item.categoryCd === selectedCategory.value);
});

// FAQ 추가/수정 모달 관련 상태
const showAddModal = ref(false);
const isEditMode = ref(false);
const editingFaqId = ref(null);
const newFaq = ref({
  question: '',
  answer: '',
  categoryCd: 'FAQ_TY_1'
});

const fetchFaqs = async () => {
  try {
    loading.value = true;
    const params = {
      categoryCd: selectedCategory.value,
      page: 1,
      perPage: 100,
      sortColumn: 'id',
      sortAsc: false
    };
    const response = await getFaqList(params);
    // console.log('FAQ 목록 응답:', response);
    if (response && response.contents) {
      faqItems.value = response.contents.map((item) => ({
        ...item,
        category: item.category?.name || item.categoryCd,
        isExpanded: false
      }));
    } else {
      faqItems.value = [];
    }
  } catch (error) {
    console.error('FAQ 목록 조회 실패:', error);
  } finally {
    loading.value = false;
  }
};

const openEditModal = (faq) => {
  isEditMode.value = true;
  editingFaqId.value = faq.id;
  newFaq.value = {
    question: faq.question,
    answer: faq.answer,
    categoryCd: faq.categoryCd
  };
  showAddModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  isEditMode.value = false;
  editingFaqId.value = null;
  newFaq.value = {
    question: '',
    answer: '',
    categoryCd: 'FAQ_TY_1'
  };
};

const addFaq = async () => {
  try {
    const faqData = {
      ...newFaq.value
    };
    // console.log('저장할 FAQ 데이터:', faqData);

    if (isEditMode.value) {
      const response = await saveFaq({
        id: editingFaqId.value,
        ...faqData
      });
      // console.log('FAQ 수정 응답:', response);
      messagePop.toast('FAQ가 수정되었습니다.', 'success');
    } else {
      const response = await saveFaq(faqData);
      // console.log('FAQ 추가 응답:', response);
      messagePop.toast('FAQ가 추가되었습니다.', 'success');
    }
    closeModal();
    await fetchFaqs();
  } catch (error) {
    console.error('FAQ 저장 실패:', error);
  }
};

const deleteFaq = async (id) => {
  if (confirm('이 FAQ를 삭제하시겠습니까?')) {
    try {
      await deleteFaqApi(id);

      messagePop.toast('FAQ가 삭제되었습니다.', 'success');
      await fetchFaqs(); // 목록 새로고침
    } catch (error) {
      console.error('FAQ 삭제 실패:', error);
    }
  }
};

// 뒤로가기 함수
const goBack = () => {
  router.push('/admin');
};

onMounted(() => {
  fetchFaqs();
});
</script>

<template>
  <div class="admin-layout">
    <AdminHeader />
    <AdminSidebar />

    <div class="admin-content">
      <div class="admin-faq-page">
        <div class="page-header">
          <div class="header-left">
            <Button icon="pi pi-arrow-left" class="p-button-text p-button-rounded" @click="goBack" />
            <h1>FAQ 관리</h1>
          </div>
          <Button label="새 FAQ 추가" icon="pi pi-plus" class="p-button-primary" @click="showAddModal = true" />
        </div>

        <!-- 카테고리 필터 -->
        <div class="category-filter">
          <div
            v-for="category in categories"
            :key="category.value"
            :class="['category-item', { active: selectedCategory === category.value }]"
            @click="selectedCategory = category.value"
          >
            {{ category.label }}
          </div>
        </div>

        <!-- FAQ 목록 -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <i class="pi pi-spin pi-spinner text-4xl text-[#8FA1FF]"></i>
        </div>
        <div v-else-if="faqItems.length === 0" class="text-center py-12 text-gray-500">등록된 FAQ가 없습니다.</div>
        <div v-else class="faq-list">
          <div v-for="item in filteredFaqs" :key="item.id" class="faq-item">
            <div class="faq-header" @click="toggleFaq(item.id)">
              <div class="faq-category">{{ item.category }}</div>
              <div class="faq-question">{{ item.question }}</div>
              <i :class="['pi', item.isExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
            </div>
            <div v-if="item.isExpanded" class="faq-answer">
              {{ item.answer }}
            </div>
            <div class="faq-actions">
              <Button icon="pi pi-pencil" class="p-button-text" @click="openEditModal(item)" />
              <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteFaq(item.id)" />
            </div>
          </div>
        </div>

        <!-- FAQ 추가/수정 모달 -->
        <div v-if="showAddModal" class="modal-overlay">
          <div class="modal-content">
            <h2>{{ isEditMode ? 'FAQ 수정' : '새 FAQ 추가' }}</h2>
            <div class="form-group">
              <label>질문</label>
              <input v-model="newFaq.question" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>답변</label>
              <textarea v-model="newFaq.answer" class="form-input" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label>카테고리</label>
              <Dropdown
                v-model="newFaq.categoryCd"
                :options="categories.slice(1)"
                optionLabel="label"
                optionValue="value"
                placeholder="카테고리 선택"
                class="w-full"
              />
            </div>
            <div class="modal-actions">
              <Button label="취소" class="p-button-text" @click="closeModal" />
              <Button :label="isEditMode ? '수정' : '추가'" class="p-button-primary" @click="addFaq" />
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
  padding-top: 60px; /* 헤더 높이만큼 여백 추가 */
}

.admin-content {
  flex: 1;
  background-color: #f9fafb;
  margin-left: 250px; /* 사이드바 너비만큼 여백 */
}

.admin-faq-page {
  padding: 2rem;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      h1 {
        margin: 0;
        font-size: 1.5rem;
        color: #2c3e50;
      }
    }

    :deep(.p-button.p-button-text) {
      color: #2c3e50;
      padding: 0.5rem;

      &:hover {
        background-color: #f3f4f6;
      }
    }
  }

  .category-filter {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;

    .category-item {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      background-color: #f5f6fa;
      color: #666;
      transition: all 0.3s ease;

      &.active {
        background-color: #8fa1ff;
        color: white;
      }

      &:hover {
        background-color: #e9ecef;
      }
    }
  }

  .faq-list {
    .faq-item {
      background-color: white;
      border-radius: 8px;
      margin-bottom: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .faq-header {
        display: flex;
        align-items: center;
        padding: 1rem;
        cursor: pointer;

        .faq-category {
          background-color: #e9ecef;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.875rem;
          margin-right: 1rem;
          color: #666;
        }

        .faq-question {
          flex: 1;
          font-weight: 500;
        }

        i {
          color: #666;
        }
      }

      .faq-answer {
        padding: 1rem;
        background-color: #f8f9fa;
        border-top: 1px solid #e9ecef;
      }

      .faq-actions {
        display: flex;
        justify-content: flex-end;
        padding: 0.5rem;
        border-top: 1px solid #e9ecef;
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

      .form-group {
        margin-bottom: 1rem;

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
            border-color: #8fa1ff;
          }
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
</style>
