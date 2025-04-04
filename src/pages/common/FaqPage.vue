<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFaqList } from '@/apis/common/commonApis';
import { useMessagePop } from '@/plugins/commonutils';

const router = useRouter();
const messagePop = useMessagePop();
const activeIndex = ref(null);
const faqs = ref([]);
const loading = ref(true);

const categories = [
    { label: '전체', value: null },
    { label: '일반', value: 'FAQ_TY_1' },
    { label: '회원가입', value: 'FAQ_TY_2' },
    { label: '서비스 이용', value: 'FAQ_TY_3' }
];
const selectedCategory = ref(null);

const filteredFaqs = computed(() => {
    if (!selectedCategory.value) {
        return faqs.value;
    }
    return faqs.value.filter(item => item.categoryCd === selectedCategory.value);
});

const toggleFaq = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};

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
        if (response && response.contents) {
            faqs.value = response.contents;
        } else {
            messagePop.toast('FAQ 데이터를 불러오는데 실패했습니다.', 'error');
        }
    } catch (error) {
        console.error('FAQ 목록 조회 실패:', error);
        messagePop.toast('FAQ 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchFaqs();
});
</script>

<template>
    <div class="max-w-[1200px] mx-auto px-4 py-12">
        <div class="flex items-center gap-4 mb-8">
            <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" 
                @click="router.back()"></i>
            <h1 class="text-3xl font-bold">FAQ</h1>
        </div>

        <!-- 카테고리 필터 -->
        <div class="flex gap-2 mb-6">
            <button v-for="category in categories" 
                    :key="category.value"
                    :class="[
                        'px-4 py-2 rounded-full transition-colors',
                        selectedCategory === category.value
                            ? 'bg-[#8FA1FF] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                    @click="selectedCategory = category.value">
                {{ category.label }}
            </button>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center py-12">
            <i class="pi pi-spin pi-spinner text-4xl text-[#8FA1FF]"></i>
        </div>
        
        <div v-else-if="filteredFaqs.length === 0" class="text-center py-12 text-gray-500">
            등록된 FAQ가 없습니다.
        </div>
        
        <div v-else class="space-y-2">
            <div v-for="(faq, index) in filteredFaqs" 
                :key="faq.id" 
                class="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow">
                <div class="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50"
                    @click="toggleFaq(index)">
                    <div class="flex items-center gap-3">
                        <span class="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                            {{ categories.find(c => c.value === faq.categoryCd)?.label || faq.categoryCd }}
                        </span>
                        <span class="font-medium">{{ faq.question }}</span>
                    </div>
                    <i :class="['pi', activeIndex === index ? 'pi-chevron-up' : 'pi-chevron-down', 'text-gray-400']"></i>
                </div>
                <div v-show="activeIndex === index" 
                    class="p-5 border-t bg-gray-50">
                    <p class="text-gray-600 whitespace-pre-line">{{ faq.answer }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>