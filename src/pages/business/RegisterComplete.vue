<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Button from 'primevue/button';
import 'primeicons/primeicons.css'

const router = useRouter();
const businessName = ref('PBNT');
const businessId = ref('pbnt505'); 

const goToLogin = () => {
  router.push({ name: 'login' }); // 로그인 페이지로 이동
};
</script>

<template>
  <div class="register-complete">
    <div class="content">
      <i class="pi pi-check check-icon"></i>
      <h1>회원가입 완료</h1>
      <p>{{ businessName }}({{ businessId }})님의 회원가입이 성공적으로 완료되었습니다.</p>
      <p class="info">
        * 회원가입 내역 확인 및 수정은 <span class="highlight">기업 정보</span>에서 가능합니다.
      </p>
      <Button @click="goToLogin" class="bt_btn primary">로그인 바로하기</Button>
    </div>
  </div>
</template>

<style scoped>
.register-complete {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.content {
  text-align: center;
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.check-icon {
  font-size: 48px;
  color: #8B8BF5;
  font-weight: bold; /* 두께 조정 */
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

.info {
  font-size: 14px;
  color: #666;
}

.highlight {
  color: #ff5722;
}
</style>