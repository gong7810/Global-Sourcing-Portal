<script setup>
import { ref, watch } from 'vue';
import { isEmpty } from 'es-toolkit/compat';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';

const router = useRouter();
const businessType = ref(null);
const businessRegistrationNo = ref('');
const businessNoError = ref('');
const businessName = ref('');
const ownerName = ref('');
const businessAddress = ref('');
const certificateIssueNo = ref('');
const certificateNoError = ref('');
const businessId = ref('');
const idCheckMessage = ref('');
const idCheckSuccess = ref(false);
const businessPw = ref('');
const businessPwCheck = ref('');
const pwMessage = ref('');
const pwError = ref(false);
const pwCheckMessage = ref('');
const pwCheckFlag = ref(false);
const showPw = ref(false);
const showPwCheck = ref(false);
const managerName = ref('');
const businessPhoneNo = ref('');
const verificationCode = ref('');
const businessEmail = ref('');
const formError = ref('');
const showCompleteDialog = ref(false);
const businessRegistrationFile = ref(null);
const businessRegistrationFileName = ref('');
const fileError = ref('');

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

const isValidBusinessNumber = (number) => {
  const regex = /^\d{3}-\d{2}-\d{5}$/;
  return regex.test(number);
};

const isValidCertificateNumber = (number) => {
  const regex = /^\d{4}-\d{3}-\d{4}-\d{3}$/;
  return regex.test(number);
};

const isValidPassword = (password) => {
  // 8~16자의 영문, 숫자, 특수문자 조합
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
  return regex.test(password);
};

const containsInvalidCharacters = (password) => {
  // 특정 특수문자를 포함하는지 확인
  return /[~^()\-_+=`\[\]{}|;':",.\\/<>]/.test(password);
};

const formatBusinessNumber = (value) => {
  const cleaned = value.replace(/\D+/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,5})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  }
  return value;
};

const formatCertificateNumber = (value) => {
  const cleaned = value.replace(/\D+/g, '');
  const match = cleaned.match(/^(\d{0,4})(\d{0,3})(\d{0,4})(\d{0,3})$/);
  if (match) {
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join('-');
  }
  return value;
};

const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D+/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  }
  return value;
};

watch(businessRegistrationNo, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    businessRegistrationNo.value = formatBusinessNumber(newVal);
  }
  if (newVal && !isValidBusinessNumber(newVal)) {
    businessNoError.value = '유효한 사업자등록번호를 입력해주세요.';
  } else {
    businessNoError.value = '';
  }
});

watch(certificateIssueNo, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    certificateIssueNo.value = formatCertificateNumber(newVal);
  }
  if (newVal && !isValidCertificateNumber(newVal)) {
    certificateNoError.value = '유효한 발급번호를 입력해주세요.';
  } else {
    certificateNoError.value = '';
  }
});

watch(businessPw, (newVal) => {
  if (containsInvalidCharacters(newVal)) {
    pwMessage.value = '사용할 수 없는 특수문자가 포함되어 있습니다.';
    pwError.value = true;
  } else if (newVal && !isValidPassword(newVal)) {
    pwMessage.value = '8~16자의 영문, 숫자, 특수문자 조합으로 입력해 주세요.';
    pwError.value = true;
  } else if (newVal) {
    pwMessage.value = '사용할 수 있는 비밀번호입니다.';
    pwError.value = false;
  } else {
    pwMessage.value = '';
    pwError.value = false;
  }
});

watch(businessPwCheck, (newVal) => {
  if (newVal && newVal !== businessPw.value) {
    pwCheckMessage.value = '비밀번호가 일치하지 않습니다.';
    pwCheckFlag.value = true;
  } else if (newVal) {
    pwCheckMessage.value = '비밀번호가 일치합니다.';
    pwCheckFlag.value = false;
  } else {
    pwCheckMessage.value = '';
    pwCheckFlag.value = false;
  }
});

watch(
  () => businessPwCheck.value,
  () => {
    if (!isEmpty(businessPwCheck.value) && businessPwCheck.value !== businessPw.value) {
      pwCheckFlag.value = true;
    } else {
      pwCheckFlag.value = false;
    }
  }
);

watch(businessPhoneNo, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    businessPhoneNo.value = formatPhoneNumber(newVal);
  }
});

const checkIdDuplication = async () => {
  if (!businessId.value.trim()) {
    idCheckMessage.value = '아이디를 입력해주세요.';
    idCheckSuccess.value = false;
    return;
  }

  try {
    // 여기에 실제 API 호출을 추가하세요.
    // 예시: const response = await axios.post('/api/check-id', { id: businessId.value });

    // 임시로 중복 확인 로직을 추가합니다.
    const isDuplicate = businessId.value === 'existingId'; // 'existingId'는 이미 존재하는 아이디 예시입니다.

    if (isDuplicate) {
      idCheckMessage.value = '이미 사용 중인 아이디입니다.';
      idCheckSuccess.value = false;
    } else {
      idCheckMessage.value = '사용 가능한 아이디입니다.';
      idCheckSuccess.value = true;
    }
  } catch (error) {
    idCheckMessage.value = '오류가 발생했습니다. 다시 시도해주세요.';
    idCheckSuccess.value = false;
  }
};

const allAgreed = ref(false);
const terms = ref({
  sms: false,
  service: false,
  privacy: false,
  optionalPrivacy: false,
  emailAds: false
});

const details = ref({
  sms: false,
  service: false,
  privacy: false,
  optionalPrivacy: false,
  emailAds: false,
  smsAds: false
});

const togglePasswordVisibility = () => {
  showPw.value = !showPw.value;
};

const togglePasswordCheckVisibility = () => {
  showPwCheck.value = !showPwCheck.value;
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

const toggleAll = () => {
  const newValue = allAgreed.value;
  terms.value = {
    sms: newValue,
    service: newValue,
    privacy: newValue,
    optionalPrivacy: newValue,
    emailAds: newValue
  };
};

const toggleDetail = (key) => {
  details.value[key] = !details.value[key];
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      fileError.value = '파일 크기는 10MB 이하여야 합니다.';
      businessRegistrationFile.value = null;
      businessRegistrationFileName.value = '';
      return;
    }

    // 파일 형식 검사
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      fileError.value = 'PDF, JPG, PNG 형식의 파일만 업로드 가능합니다.';
      businessRegistrationFile.value = null;
      businessRegistrationFileName.value = '';
      return;
    }

    businessRegistrationFile.value = file;
    businessRegistrationFileName.value = file.name;
    fileError.value = '';
  }
};

const removeFile = () => {
  businessRegistrationFile.value = null;
  businessRegistrationFileName.value = '';
  fileError.value = '';
};

const submitForm = () => {
  if (
    !businessType.value ||
    !businessType.value.value.trim() ||
    !businessRegistrationNo.value.trim() ||
    !businessName.value.trim() ||
    !ownerName.value.trim() ||
    !businessAddress.value.trim() ||
    !businessRegistrationFile.value ||
    !businessId.value.trim() ||
    !businessPw.value.trim() ||
    !managerName.value.trim() ||
    !businessPhoneNo.value.trim() ||
    !businessEmail.value.trim() ||
    !terms.value.service ||
    !terms.value.privacy ||
    !terms.value.sms
  ) {
    formError.value = '모든 필수 항목을 입력하고 체크해주세요.';
    return;
  }

  // 가입 신청 처리 로직
  formError.value = '';
  showCompleteDialog.value = true;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-xl text-[#8FA1FF] font-bold">Global Sourcing Portal</router-link>
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
          <div class="mb-2">
            <InputText v-model="businessRegistrationNo" placeholder="사업자등록번호" class="w-full" maxlength="12" />
            <p v-if="businessNoError" class="text-red-500">{{ businessNoError }}</p>
          </div>
          <InputText v-model="businessName" type="text" placeholder="회사명" class="w-full px-4 py-3" />
          <InputText v-model="ownerName" type="text" placeholder="대표자명" class="w-full px-4 py-3" />
          <InputText v-model="businessAddress" type="text" placeholder="회사주소" class="w-full px-4 py-3" />
          <div class="mb-2">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">사업자등록증명원</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="flex-1 relative">
                <input
                  type="file"
                  class="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @change="handleFileUpload"
                  ref="fileInput"
                />
                <div
                  class="w-full px-4 py-3 border rounded-lg bg-white flex items-center justify-between cursor-pointer"
                  @click="$refs.fileInput.click()"
                >
                  <span class="text-gray-500">{{ businessRegistrationFileName || '파일을 선택해주세요' }}</span>
                  <i class="pi pi-upload text-gray-400"></i>
                </div>
              </div>
              <button
                v-if="businessRegistrationFileName"
                @click="removeFile"
                type="button"
                class="px-3 py-2 text-gray-500 hover:text-red-500"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-500">* PDF, JPG, PNG 형식의 파일만 업로드 가능합니다. (최대 10MB)</p>
            <p v-if="fileError" class="mt-1 text-sm text-red-500">{{ fileError }}</p>
          </div>
          <div>
            <div class="flex space-x-2">
              <InputText v-model="businessId" type="text" placeholder="아이디" class="flex-grow px-4 py-3" />
              <button
                @click="checkIdDuplication"
                class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
              >
                아이디 중복 확인
              </button>
            </div>
            <p v-if="idCheckMessage" :class="idCheckSuccess ? 'text-green-500' : 'text-red-500'">
              {{ idCheckMessage }}
            </p>
          </div>
          <div>
            <div class="flex items-center">
              <InputText
                :type="showPw ? 'text' : 'password'"
                v-model="businessPw"
                placeholder="비밀번호(8~16자의 영문, 숫자, 특수기호)"
                class="w-full px-4 py-3"
                maxlength="16"
              />
              <button type="button" @click="togglePasswordVisibility" class="ml-2 flex items-center">
                <i :class="showPw ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <p :class="pwError ? 'text-red-500' : 'text-green-500'">{{ pwMessage }}</p>

            <div class="flex items-center mt-4">
              <InputText
                v-model="businessPwCheck"
                class="w-full px-4 py-3"
                :type="showPwCheck ? 'text' : 'password'"
                placeholder="비밀번호 확인"
                :invalid="pwCheckFlag"
                maxlength="16"
              />
              <button type="button" @click="togglePasswordCheckVisibility" class="ml-2 flex items-center">
                <i :class="showPwCheck ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
            <p :class="pwCheckFlag ? 'text-red-500' : 'text-green-500'">{{ pwCheckMessage }}</p>
          </div>
          <InputText v-model="managerName" type="text" placeholder="가입자명" class="w-full px-4 py-3" />
          <div class="flex space-x-2">
            <InputText v-model="businessPhoneNo" placeholder="전화번호" class="flex-grow px-4 py-3" maxlength="13" />
            <button
              type="button"
              @click="sendVerificationCode"
              class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
            >
              인증번호 전송
            </button>
          </div>
          <div class="flex space-x-2">
            <InputText v-model="verificationCode" type="text" placeholder="인증번호 입력" class="flex-grow px-4 py-3" />
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
          <InputText v-model="businessEmail" type="email" placeholder="이메일" class="w-full px-4 py-3" />
        </div>

        <!-- 이용약관 -->
        <div class="mt-6">
          <div class="flex items-center mb-2">
            <span
              >필수동의 항목 및 개인정보 수집 및 이용 동의(선택), <br />광고성 정보 수신(선택)에 모두 동의합니다.</span
            >
            <input type="checkbox" v-model="allAgreed" @change="toggleAll" class="ml-auto mr-2" />
          </div>
          <hr class="my-4 border-gray-300" />
          <div class="space-y-2">
            <div class="flex items-center">
              <span>[필수] 이용약관 동의</span>
              <button type="button" @click="toggleDetail('service')" class="ml-2 text-blue-500">
                {{ details.service ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.service" class="ml-auto mr-2" />
            </div>
            <div v-if="details.service" class="p-2 border rounded bg-gray-100" style="height: 200px; overflow-y: auto">
              <p>제 1 조 (목적)</p>
              <p>
                본 약관은 Global Sourcing Portal(이하 "회사")이 운영하는 "서비스"를 이용함에 있어 "회사"와 회원간의 이용 조건 및 제한
                절차, 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 한다.
              </p>
              <p>제 2 조 (용어의 정의)</p>
              <p>이 약관에서 사용하는 용어의 정의는 아래와 같다.</p>
              <p>
                ① "사이트"라 함은 회사가 서비스를 "회원"에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 설정한
                가상의 영업장 또는 회사가 운영하는 웹사이트, 모바일웹, 앱 등의 서비스를 제공하는 모든 매체를 통칭한다.
              </p>
              <p>
                ② "서비스"라 함은 회사가 운영하는 사이트를 통해 개인이 구직, 교육 등의 목적으로 등록하는 자료를 DB화하여
                각각의 목적에 맞게 분류 가공, 집계하여 정보를 제공하는 서비스와 사이트에서 제공하는 모든 부대 서비스를
                말한다.
              </p>
              <p>
                ③ "회원"이라 함은 "회사"가 제공하는 서비스를 이용하거나 이용하려는 자로, 구글 등 외부 서비스 연동을 통해
                "회사"와 이용계약을 체결한자 또는 체결하려는 자를 포함하며, 아이디와 비밀번호의 설정 등 회원가입 절차를
                거쳐 회원가입확인 이메일 등을 통해 회사로부터 회원으로 인정받은 "개인회원"을 말한다.
              </p>
              <p>
                ④ "아이디"라 함은 회원가입 시 회원의 식별과 회원의 서비스 이용을 위하여 "회원"이 선정하고 "회사"가
                부여하는 문자와 숫자의 조합을 말한다.
              </p>
              <p>
                ⑤ "비밀번호"라 함은 위 제4항에 따라 회원이 회원가입시 아이디를 설정하면서 아이디를 부여받은 자와
                동일인임을 확인하고 "회원"의 권익을 보호하기 위하여 "회원"이 선정한 문자와 숫자의 조합을 말한다.
              </p>
            </div>
            <div class="flex items-center">
              <span>[필수] 개인정보 수집 및 이용 동의</span>
              <button type="button" @click="toggleDetail('privacy')" class="ml-2 text-blue-500">
                {{ details.privacy ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.privacy" class="ml-auto mr-2" />
            </div>
            <div v-if="details.privacy" class="p-2 border rounded bg-gray-100" style="height: 200px; overflow-y: auto">
              <p>제 1 조 (목적)</p>
              <p>
                본 약관은 Global Sourcing Portal(이하 "회사")이 운영하는 "서비스"를 이용함에 있어 "회사"와 회원간의 이용 조건 및 제한
                절차, 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 한다.
              </p>
              <p>제 2 조 (용어의 정의)</p>
              <p>이 약관에서 사용하는 용어의 정의는 아래와 같다.</p>
              <p>
                ① "사이트"라 함은 회사가 서비스를 "회원"에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 설정한
                가상의 영업장 또는 회사가 운영하는 웹사이트, 모바일웹, 앱 등의 서비스를 제공하는 모든 매체를 통칭한다.
              </p>
              <p>
                ② "서비스"라 함은 회사가 운영하는 사이트를 통해 개인이 구직, 교육 등의 목적으로 등록하는 자료를 DB화하여
                각각의 목적에 맞게 분류 가공, 집계하여 정보를 제공하는 서비스와 사이트에서 제공하는 모든 부대 서비스를
                말한다.
              </p>
              <p>
                ③ "회원"이라 함은 "회사"가 제공하는 서비스를 이용하거나 이용하려는 자로, 구글 등 외부 서비스 연동을 통해
                "회사"와 이용계약을 체결한자 또는 체결하려는 자를 포함하며, 아이디와 비밀번호의 설정 등 회원가입 절차를
                거쳐 회원가입확인 이메일 등을 통해 회사로부터 회원으로 인정받은 "개인회원"을 말한다.
              </p>
              <p>
                ④ "아이디"라 함은 회원가입 시 회원의 식별과 회원의 서비스 이용을 위하여 "회원"이 선정하고 "회사"가
                부여하는 문자와 숫자의 조합을 말한다.
              </p>
              <p>
                ⑤ "비밀번호"라 함은 위 제4항에 따라 회원이 회원가입시 아이디를 설정하면서 아이디를 부여받은 자와
                동일인임을 확인하고 "회원"의 권익을 보호하기 위하여 "회원"이 선정한 문자와 숫자의 조합을 말한다.
              </p>
            </div>
            <div class="flex items-center">
              <span>[필수] 문자서비스 이용약관 동의</span>
              <button type="button" @click="toggleDetail('sms')" class="ml-2 text-blue-500">
                {{ details.sms ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.sms" class="ml-auto mr-2" />
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
              <span>[선택] 광고성 정보 수신 동의</span>
              <button type="button" @click="toggleDetail('emailAds')" class="ml-2 text-blue-500">
                {{ details.emailAds ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.emailAds" class="ml-auto mr-2" />
            </div>
          </div>
        </div>

        <!-- 회원가입 버튼을 신청하기 버튼으로 변경 -->
        <div class="mt-6">
          <Button type="submit" class="w-full py-3 bt_btn primary">
            신청하기
          </Button>
          <p v-if="formError" class="text-red-500">{{ formError }}</p>
        </div>
      </form>
    </div>
  </div>

  <!-- 신청 완료 모달 추가 -->
  <Dialog v-model:visible="showCompleteDialog" :modal="true" :closable="false" :style="{ width: '400px' }">
    <template #header>
      <h3 class="text-xl font-bold">신청 완료</h3>
    </template>
    <div class="p-4">
      <p class="text-center mb-4">
        기업회원 신청이 접수되었습니다.<br />
        관리자 검토 후 승인 이메일이 발송될 예정입니다.
      </p>
      <div class="flex justify-center">
        <Button label="확인" @click="router.push('/')" class="w-32" />
      </div>
    </div>
  </Dialog>
</template>
