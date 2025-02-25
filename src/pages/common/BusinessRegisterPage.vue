<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';


const businessType = ref('');
const businessRegistrationNumber = ref('');
const businessName = ref('');
const ceoName = ref('');
const businessAddress = ref('');
const businessCertificateIssueNumber = ref('');
const businessId = ref('');
const businessPassword = ref('');
const businessPasswordCheck = ref('');
const managerName = ref('');
const businessEmail = ref('');
const businessPhone = ref('');
const showPassword = ref(false);
const showPasswordCheck = ref(false);
const verificationCode = ref('');

const businessOptions = [
  { label: '대기업', value: '대기업' },
  { label: '대기업 계열사·자회사', value: '대기업 계열사·자회사' },
  { label: '중소기업(300명이하)', value: '중소기업(300명이하)' },
  { label: '중견기업(300명이상)', value: '중견기업(300명이상)' },
  { label: '벤처기업', value: '벤처기업' },
  { label: '외국계(외국 투자기업)', value: '외국계(외국 투자기업)' },
  { label: '외국계(외국 법인기업)', value: '외국계(외국 법인기업)' },
  { label: '국내 공공기관·공기업', value: '국내 공공기관·공기업' },
  { label: '비영리단체·협회·교육재단', value: '비영리단체·협회·교육재단' },
  { label: '외국 기관·비영리기구·단체', value: '외국 기관·비영리기구·단체' }
];

const allAgreed = ref(false);
const terms = ref({
  age: false,
  service: false,
  privacy: false,
  optionalPrivacy: false,
  emailAds: false,
  smsAds: false,
});

const details = ref({
  service: false,
  privacy: false,
  optionalPrivacy: false,
  emailAds: false,
  smsAds: false,
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const togglePasswordCheckVisibility = () => {
  showPasswordCheck.value = !showPasswordCheck.value;
};

const sendVerificationCode = () => {
  // 인증번호 전송 로직
  console.log('Verification code sent');
};

const verifyCode = () => {
  // 인증번호 확인 로직
  console.log('Verification code verified');
};

const resendVerificationCode = () => {
  // 인증번호 재전송 로직
  console.log('Verification code resent');
};

const verifyPassport = () => {
  // 여권번호 확인 로직
  console.log('Passport verified');
};

const toggleAll = () => {
  const newValue = allAgreed.value;
  terms.value = {
    age: newValue,
    service: newValue,
    privacy: newValue,
    optionalPrivacy: newValue,
    emailAds: newValue,
    smsAds: newValue,
  };
};

const toggleDetail = (key) => {
  details.value[key] = !details.value[key];
};

const submitForm = () => {
  // 폼 제출 로직
  console.log('Form submitted');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-xl text-[#8FA1FF] font-bold">BT POTAL</router-link>
        <h1 class="text-3xl font-bold">기업회원가입</h1>
      </div>

      <!-- 입력 폼 -->
      <form @submit.prevent="submitForm">
        <div class="space-y-4 mb-6">
          <Dropdown
            v-model="businessType"
            :options="businessOptions"
            optionLabel="label"
            placeholder="기업형태 선택"
            class="w-full"
          />
          <InputText
            v-model="businessRegistrationNumber"
            type="text"
            placeholder="사업자등록번호"
            class="w-full px-4 py-3"
          />
          <InputText
            v-model="businessName"
            type="text"
            placeholder="회사명"
            class="w-full px-4 py-3"
          />
          <InputText
            v-model="ceoName"
            type="text"
            placeholder="대표자명"
            class="w-full px-4 py-3"
          />
          <InputText
            v-model="businessAddress"
            type="text"
            placeholder="회사주소"
            class="w-full px-4 py-3"
          />
          <InputText
            v-model="businessCertificateIssueNumber"
            type="text"
            placeholder="사업자등록증명원 발급번호"
            class="w-full px-4 py-3"
          />
          <InputText
            v-model="businessId"
            type="text"
            placeholder="아이디"
            class="w-full px-4 py-3"
          />
          <div class="relative">
            <InputText
              :type="showPassword ? 'text' : 'password'"
              v-model="businessPassword"
              placeholder="비밀번호(8~16자의 영문, 숫자, 특수기호)"
              class="w-full px-4 py-3"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <div class="relative">
            <InputText
              :type="showPasswordCheck ? 'text' : 'password'"
              v-model="businessPasswordCheck"
              placeholder="비밀번호 확인"
              class="w-full px-4 py-3"
            />
            <button
              type="button"
              @click="togglePasswordCheckVisibility"
              class="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              <i :class="showPasswordCheck ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <InputText
            v-model="managerName"
            type="text"
            placeholder="가입자명"
            class="w-full px-4 py-3"
          />
          <div class="flex space-x-2">
            <InputText
              v-model="businessPhone"
              type="text"
              placeholder="전화번호"
              class="flex-grow px-4 py-3"
            />
            <button
              type="button"
              @click="sendVerificationCode"
              class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
            >
              인증번호 전송
            </button>
          </div>
          <div class="flex space-x-2">
            <InputText
              v-model="verificationCode"
              type="text"
              placeholder="인증번호 입력"
              class="flex-grow px-4 py-3"
            />
            <button
              type="button"
              @click="verifyCode"
              class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
            >
              확인
            </button>
            <button
              type="button"
              @click="resendVerificationCode"
              class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
            >
              재전송
            </button>
          </div>
          <InputText
            v-model="businessEmail"
            type="email"
            placeholder="이메일"
            class="w-full px-4 py-3"
          />
        </div>

        <!-- 이용약관 -->
        <div class="mt-6">
          <div class="flex items-center mb-2">
            <span>필수동의 항목 및 개인정보 수집 및 이용 동의(선택), <br>광고성 정보 수신(선택)에 모두 동의합니다.</span>
            <input
              type="checkbox"
              v-model="allAgreed"
              @change="toggleAll"
              class="ml-auto mr-2"
            />
          </div>
          <hr class="my-4 border-gray-300" />
          <div class="space-y-2">
            <div class="flex items-center">
              <span>[필수] 만 15세 이상입니다</span>
              <input type="checkbox" v-model="terms.age" class="ml-auto mr-2" />
            </div>
            <div class="flex items-center">
              <span>[필수] 이용약관 동의</span>
              <button type="button" @click="toggleDetail('service')" class="ml-2 text-blue-500">
                {{ details.service ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.service" class="ml-auto mr-2" />
            </div>
            <div v-if="details.service" class="p-2 border rounded bg-gray-100" style="height: 200px; overflow-y: auto;">
              <p>제 1 조 (목적)</p>
              <p>본 약관은 BTPotal(이하 "회사")이 운영하는 "서비스"를 이용함에 있어 "회사"와 회원간의 이용 조건 및 제한 절차, 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 한다.</p>
              <p>제 2 조 (용어의 정의)</p>
              <p>이 약관에서 사용하는 용어의 정의는 아래와 같다.</p>
              <p>① "사이트"라 함은 회사가 서비스를 "회원"에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 설정한 가상의 영업장 또는 회사가 운영하는 웹사이트, 모바일웹, 앱 등의 서비스를 제공하는 모든 매체를 통칭한다.</p>
              <p>② "서비스"라 함은 회사가 운영하는 사이트를 통해 개인이 구직, 교육 등의 목적으로 등록하는 자료를 DB화하여 각각의 목적에 맞게 분류 가공, 집계하여 정보를 제공하는 서비스와 사이트에서 제공하는 모든 부대 서비스를 말한다.</p>
              <p>③ "회원"이라 함은 "회사"가 제공하는 서비스를 이용하거나 이용하려는 자로, 구글 등 외부 서비스 연동을 통해 "회사"와 이용계약을 체결한자 또는 체결하려는 자를 포함하며, 아이디와 비밀번호의 설정 등 회원가입 절차를 거쳐 회원가입확인 이메일 등을 통해 회사로부터 회원으로 인정받은 "개인회원"을 말한다.</p>
              <p>④ "아이디"라 함은 회원가입 시 회원의 식별과 회원의 서비스 이용을 위하여 "회원"이 선정하고 "회사"가 부여하는 문자와 숫자의 조합을 말한다.</p>
              <p>⑤ "비밀번호"라 함은 위 제4항에 따라 회원이 회원가입시 아이디를 설정하면서 아이디를 부여받은 자와 동일인임을 확인하고 "회원"의 권익을 보호하기 위하여 "회원"이 선정한 문자와 숫자의 조합을 말한다.</p>
            </div>
            <div class="flex items-center">
              <span>[필수] 개인정보 수집 및 이용 동의</span>
              <button type="button" @click="toggleDetail('privacy')" class="ml-2 text-blue-500">
                {{ details.privacy ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.privacy" class="ml-auto mr-2" />
            </div>
            <hr class="my-2 border-gray-200" />
            <div class="flex items-center">
              <span>[선택] 개인정보 수집 및 이용 동의</span>
              <button type="button" @click="toggleDetail('optionalPrivacy')" class="ml-2 text-blue-500">
                {{ details.optionalPrivacy ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.optionalPrivacy" class="ml-auto mr-2" />
            </div>
            <div class="flex items-center">
              <span>[선택] 광고성 정보 이메일 수신 동의</span>
              <button type="button" @click="toggleDetail('emailAds')" class="ml-2 text-blue-500">
                {{ details.emailAds ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.emailAds" class="ml-auto mr-2" />
            </div>
            <div class="flex items-center">
              <span>[선택] 광고성 정보 SMS 수신 동의</span>
              <button type="button" @click="toggleDetail('smsAds')" class="ml-2 text-blue-500">
                {{ details.smsAds ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.smsAds" class="ml-auto mr-2" />
            </div>
          </div>
        </div>
        
        <!-- 회원가입 버튼 -->
        <div class="mt-6">
          <Button type="submit" class="w-full py-3 bt_btn primary">
            가입하기
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>