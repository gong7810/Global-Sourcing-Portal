<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createInquiry } from '@/apis/common/commonApis';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const inquiryForm = ref({
  category: null,
  title: '',
  content: '',
  email: ''
  // phone: ''
});

const categories = [
  { label: '서비스 이용 문의', value: 'HELP_TY_SV' },
  { label: '기술적 문제', value: 'HELP_TY_TE' },
  { label: '결제 관련', value: 'HELP_TY_PA' },
  { label: '제안/건의', value: 'HELP_TY_SU' },
  { label: '기타', value: 'HELP_TY_ET' }
];

const submitInquiry = async () => {
  if (!inquiryForm.value.category) {
    toast.add({
      severity: 'warn',
      summary: '알림',
      detail: '문의 유형을 선택해주세요.',
      group: 'apptc',
      life: 3000
    });
    return;
  }
  if (!inquiryForm.value.title.trim()) {
    toast.add({ severity: 'warn', summary: '알림', detail: '제목을 입력해주세요.', group: 'apptc', life: 3000 });
    return;
  }
  if (!inquiryForm.value.content.trim()) {
    toast.add({ severity: 'warn', summary: '알림', detail: '내용을 입력해주세요.', group: 'apptc', life: 3000 });
    return;
  }
  if (!inquiryForm.value.email.trim()) {
    toast.add({ severity: 'warn', summary: '알림', detail: '이메일을 입력해주세요.', group: 'apptc', life: 3000 });
    return;
  }

  try {
    loading.value = true;
    const response = await createInquiry(inquiryForm.value);
    console.log('문의하기 응답:', response);

    if (response) {
      toast.add({
        severity: 'success',
        summary: '성공',
        detail: '문의가 정상적으로 접수되었습니다.',
        group: 'apptc',
        life: 3000
      });
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      throw new Error('문의 등록에 실패했습니다.');
    }
  } catch (error) {
    console.error('문의하기 등록 실패:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-[800px] mx-auto px-4 py-12">
    <div class="flex items-center gap-4 mb-8">
      <i
        class="pi pi-angle-left text-4xl text-gray-600 cursor-pointer transition-colors hover:text-[#8FA1FF]"
        @click="router.back()"
      ></i>
      <h1 class="text-3xl font-bold">문의하기</h1>
    </div>

    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <form @submit.prevent="submitInquiry" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-medium mb-2">문의 유형</label>
          <Select
            v-model="inquiryForm.category"
            :options="categories"
            optionLabel="label"
            placeholder="문의 유형을 선택해주세요"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">제목</label>
          <InputText v-model="inquiryForm.title" placeholder="문의 제목을 입력해주세요" class="w-full" />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">내용</label>
          <Textarea
            v-model="inquiryForm.content"
            placeholder="문의하실 내용을 자세히 적어주세요"
            rows="6"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">이메일</label>
          <InputText
            v-model="inquiryForm.email"
            type="email"
            placeholder="답변받으실 이메일 주소를 입력해주세요"
            class="w-full"
          />
        </div>

        <!-- <div>
          <label class="block text-gray-700 font-medium mb-2">연락처</label>
          <InputText
            v-model="inquiryForm.phone"
            placeholder="연락 가능한 전화번호를 입력해주세요"
            class="w-full" />
        </div> -->

        <div class="flex justify-end gap-4">
          <Button type="button" label="취소" class="p-button-outlined p-button-secondary" @click="router.back()" />
          <Button type="submit" label="문의하기" class="bt_btn primary" :loading="loading" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-dropdown),
:deep(.p-inputtext),
:deep(.p-textarea) {
  width: 100%;
  border-radius: 8px;
}

:deep(.p-button) {
  border-radius: 8px;
}

:deep(.p-button.p-button-outlined) {
  color: #8fa1ff;
  border-color: #8fa1ff;
}

:deep(.p-button.p-button-outlined:hover) {
  background: rgba(143, 161, 255, 0.1);
  border-color: #8fa1ff;
  color: #8fa1ff;
}
</style>
