<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';

const router = useRouter();

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

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>

<template>
    <!-- 전체 컨테이너에 최대 폭 제한과 중앙 정렬 적용 -->
    <div class="max-w-[1200px] mx-auto px-4 py-12">
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
                        <!-- 취소 및 저장 버튼 -->
                        <div class="flex justify-center gap-4 mt-6">
                            <Button label="취소" class="p-button-secondary" @click="cancelEdit" />
                            <Button label="저장" class="p-button-primary" @click="saveAll" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
