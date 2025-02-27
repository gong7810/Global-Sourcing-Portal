<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import { useMessagePop } from '@/plugins/commonutils';

const router = useRouter();
const messagePop = useMessagePop();

const basicInfo = ref({
    name: '최예지',
    birthDate: '1996.09.01',
    gender: '여성',
    email: 'ye****@naver.com',
    phone: '010-****-7496',
    address: '윙스타워 505호'
});

const genders = [
    { label: '남성', value: 'male' },
    { label: '여성', value: 'female' }
];

const cancelEdit = () => {
    messagePop.confirm({
        message: '변경사항이 저장되지 않습니다. 취소하시겠습니까?',
        onCloseYes: () => {
            router.back();
        }
    });
};

const saveAll = () => {
    messagePop.confirm({
        message: '변경사항을 저장하시겠습니까?',
        onCloseYes: () => {
            messagePop.alert('저장되었습니다.', 'success');
            router.back();
        }
    });
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>

<template>
    <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
    <div class="max-w-[1200px] mx-auto px-4 py-12">
        <!-- 제목 추가 -->
    <div class="flex items-center gap-4 mb-8">
        <i class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]" @click="router.back()"></i>
        <h1 class="text-3xl font-bold">내 정보</h1>
    </div>
        <div class="grid gap-4">
            <div class="user-page">
                <!-- 기본 정보 섹션 -->
                <div class="bg-white rounded-lg p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-bold">기본 정보</h2>
                    </div>
                    <div class="space-y-4 text-gray-600">
                        <div class="flex items-center gap-4">
                            <i class="pi pi-user"></i>
                            <InputText v-model="basicInfo.name" placeholder="이름을 입력해주세요" class="w-full" />
                        </div>
                        <div class="flex items-center gap-4">
                            <i class="pi pi-calendar"></i>
                            <DatePicker v-model="basicInfo.birthDate" format="yyyy-MM-dd" placeholder="생년월일을 선택해주세요"
                                class="w-32" />
                            <Select v-model="basicInfo.gender" :options="genders" optionLabel="label" placeholder="성별"
                                class="w-32" />
                        </div>
                        <div class="flex items-center gap-4">
                            <i class="pi pi-envelope"></i>
                            <InputText v-model="basicInfo.email" placeholder="이메일을 입력해주세요" class="w-full" />
                        </div>
                        <div class="flex items-center gap-4">
                            <i class="pi pi-phone"></i>
                            <InputText v-model="basicInfo.phone" placeholder="전화번호를 입력해주세요" class="w-full" />
                        </div>
                        <div class="flex items-center gap-4">
                            <i class="pi pi-map-marker"></i>
                            <InputText v-model="basicInfo.address" placeholder="주소를 입력해주세요" class="w-full" />
                        </div>
                        <!-- 버튼 영역 -->
                        <div class="px-8 py-6 bg-gray-50 border-t flex justify-center gap-4">
                            <Button label="취소" 
                                class="p-button-secondary px-6 hover:bg-gray-100" 
                                @click="cancelEdit" />
                            <Button label="저장" 
                                class="p-button-primary px-6 bg-gradient-to-r from-[#8FA1FF] to-[#8B8BF5] border-none hover:bg-gradient-to-r hover:from-[#7B8FFF] hover:to-[#7878F2]" 
                                @click="saveAll" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
