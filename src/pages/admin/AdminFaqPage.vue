<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter();

const faqItems = ref([
    {
        id: 1,
        question: '글로벌 소싱 포털은 어떤 서비스인가요?',
        answer: '글로벌 소싱 포털은 해외 인재와 국내 기업을 연결하는 채용 플랫폼입니다. 기업은 다양한 국가의 우수 인재를 만날 수 있으며, 구직자는 국내 기업에 지원할 수 있습니다.',
        category: '일반',
        isExpanded: false
    },
    {
        id: 2,
        question: '어떤 국가의 인재들이 등록되어 있나요?',
        answer: '주로 베트남 등 아시아 국가의 IT 인재들이 등록되어 있으며, 지속적으로 다양한 국가의 인재풀을 확대하고 있습니다.',
        category: '일반',
        isExpanded: false
    },
    {
        id: 3,
        question: '채용 공고는 어떻게 등록하나요?',
        answer: '기업 회원으로 가입 후, 대시보드의 "공고 등록" 메뉴를 통해 채용 공고를 등록할 수 있습니다.',
        category: '서비스 이용',
        isExpanded: false
    },
    {
        id: 4,
        question: '인재에게 직접 제안을 할 수 있나요?',
        answer: '네, 가능합니다. 인재풀에서 마음에 드는 후보자를 발견하시면 "제안하기" 버튼을 통해 직접 채용 제안을 보내실 수 있습니다.',
        category: '서비스 이용',
        isExpanded: false
    }
]);

const toggleFaq = (id) => {
    const faq = faqItems.value.find(item => item.id === id);
    if (faq) {
        faq.isExpanded = !faq.isExpanded;
    }
};

const categories = ['전체', '일반', '회원가입', '서비스 이용'];
const selectedCategory = ref('전체');

const filteredFaqs = computed(() => {
    if (selectedCategory.value === '전체') {
        return faqItems.value;
    }
    return faqItems.value.filter(item => item.category === selectedCategory.value);
});

// FAQ 추가/수정 모달 관련 상태
const showAddModal = ref(false);
const isEditMode = ref(false);
const editingFaqId = ref(null);
const newFaq = ref({
    question: '',
    answer: '',
    category: '일반'
});

const openEditModal = (faq) => {
    isEditMode.value = true;
    editingFaqId.value = faq.id;
    newFaq.value = {
        question: faq.question,
        answer: faq.answer,
        category: faq.category
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
        category: '일반'
    };
};

const addFaq = () => {
    if (isEditMode.value) {
        // 수정 모드
        const index = faqItems.value.findIndex(item => item.id === editingFaqId.value);
        if (index !== -1) {
            faqItems.value[index] = {
                ...faqItems.value[index],
                ...newFaq.value
            };
        }
    } else {
        // 추가 모드
        const newId = Math.max(...faqItems.value.map(item => item.id)) + 1;
        faqItems.value.push({
            id: newId,
            ...newFaq.value,
            isExpanded: false
        });
    }
    closeModal();
};

const deleteFaq = (id) => {
    if (confirm('이 FAQ를 삭제하시겠습니까?')) {
        faqItems.value = faqItems.value.filter(item => item.id !== id);
    }
};

// 사이드바 메뉴 아이템
const menuItems = ref([
    { label: '사용자 관리', icon: 'pi pi-users', to: '/admin/users' },
    { label: 'FAQ 관리', icon: 'pi pi-question-circle', to: '/admin/faq' }
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
            <div class="admin-faq-page">
                <div class="page-header">
                    <div class="header-left">
                        <Button 
                            icon="pi pi-arrow-left" 
                            class="p-button-text p-button-rounded" 
                            @click="goBack"
                        />
                        <h1>FAQ 관리</h1>
                    </div>
                    <Button label="새 FAQ 추가" icon="pi pi-plus" class="p-button-primary" @click="showAddModal = true" />
                </div>

                <!-- 카테고리 필터 -->
                <div class="category-filter">
                    <div v-for="category in categories" 
                         :key="category"
                         :class="['category-item', { active: selectedCategory === category }]"
                         @click="selectedCategory = category">
                        {{ category }}
                    </div>
                </div>

                <!-- FAQ 목록 -->
                <div class="faq-list">
                    <div v-for="item in filteredFaqs" 
                         :key="item.id" 
                         class="faq-item">
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
                            <select v-model="newFaq.category" class="form-input">
                                <option v-for="category in categories.slice(1)" :key="category" :value="category">
                                    {{ category }}
                                </option>
                            </select>
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
                background-color: #8FA1FF;
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
                        border-color: #8FA1FF;
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
</style> 