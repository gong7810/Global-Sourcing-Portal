<script setup>
import { onMounted, ref, toRaw, watch } from 'vue';
import { useRouter } from 'vue-router';
import { isEmpty } from 'es-toolkit/compat';
import { useMessagePop } from '@/plugins/commonutils';
import { checkDuplicate, requestMobile, checkMobile, signUpCompany } from '@/apis/auth/authApis';
import { fileUpload, getCodeList } from '@/apis/common/commonApis';

const messagePop = useMessagePop();
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
const verifyNo = ref('');
const verifyButtonFlag = ref(false);
const verifyFlag = ref(false);

const businessEmail = ref('');
const formError = ref('');
const showCompleteDialog = ref(false);
const businessRegistrationFile = ref(null);
const businessRegistrationFileName = ref('');
const fileError = ref('');

const businessOptions = ref([]);

onMounted(() => {
  setCompanyType();
});

// 기업 형태 코드 조회
const setCompanyType = async () => {
  const response = await getCodeList(`COMPANY_TY`);

  response.map((item) => {
    businessOptions.value.push({
      label: item.name,
      value: item.code
    });
  });
};

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

// watch(businessPw, (newVal) => {
//   if (containsInvalidCharacters(newVal)) {
//     pwMessage.value = '사용할 수 없는 특수문자가 포함되어 있습니다.';
//     pwError.value = true;
//   } else if (newVal && !isValidPassword(newVal)) {
//     pwMessage.value = '8~16자의 영문, 숫자, 특수문자 조합으로 입력해 주세요.';
//     pwError.value = true;
//   } else if (newVal) {
//     pwMessage.value = '사용할 수 있는 비밀번호입니다.';
//     pwError.value = false;
//   } else {
//     pwMessage.value = '';
//     pwError.value = false;
//   }
// });

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
    const response = await checkDuplicate(businessId.value);

    if (response) {
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
  optionalPrivacy: false
});

const details = ref({
  sms: false,
  service: false,
  privacy: false,
  optionalPrivacy: false
});

const togglePasswordVisibility = () => {
  showPw.value = !showPw.value;
};

const togglePasswordCheckVisibility = () => {
  showPwCheck.value = !showPwCheck.value;
};

// 인증번호 전송 API
const sendVerificationCode = async () => {
  await requestMobile(businessPhoneNo.value);

  messagePop.toast('전송되었습니다.', 'success');
};

// 인증번호 확인 로직
const verifyCode = async () => {
  const body = {
    mobile: businessPhoneNo.value,
    authNumber: verifyNo.value
  };

  const response = await checkMobile(body);

  if (response) {
    messagePop.toast('인증되었습니다.', 'success');
    verifyFlag.value = true;
    verifyButtonFlag.value = true;
  } else {
    messagePop.toast('잘못된 인증번호입니다.', 'error');
    verifyFlag.value = false;
    verifyButtonFlag.value = false;
  }
};

const toggleAll = () => {
  const newValue = allAgreed.value;
  terms.value = {
    sms: newValue,
    service: newValue,
    privacy: newValue,
    optionalPrivacy: newValue
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

const submitForm = async () => {
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
    (!terms.value.sms && verifyFlag.value)
  ) {
    formError.value = '모든 필수 항목을 입력하고 체크해주세요.';
    return;
  }

  // 사업자등록증명원 저장
  const fornmData = savePassportImage();

  const res = await fileUpload(fornmData);

  if (res && res?.success === undefined) {
    const body = {
      user: {
        loginId: businessId.value,
        name: managerName.value,
        password: businessPw.value,
        profileImage: null,
        birth: null,
        mobile: businessPhoneNo.value,
        email: businessEmail.value,
        address: businessAddress.value,
        genderCd: null
      },
      company: {
        name: businessName.value,
        businessNumber: businessRegistrationNo.value,
        companyTypeCd: businessType.value.value,
        ceoName: managerName.value,
        address: businessAddress.value,
        registrationFile: res.id,
        phone: businessPhoneNo.value
      }
    };

    const response = await signUpCompany(body);

    // 회원가입 신청 완료 모달
    if (response && response.success === undefined) {
      formError.value = '';
      showCompleteDialog.value = true;
    } else {
      messagePop.toast('시스템 오류입니다.', 'error');
    }
  } else {
    messagePop.toast('시스템 오류입니다.', 'error');
  }
};

// 이미지 바이너리 변환
const savePassportImage = () => {
  const formData = new FormData();
  formData.append('file', toRaw(businessRegistrationFile.value));

  return formData;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-xl text-[#8FA1FF] font-bold notranslate">Global Sourcing Portal</router-link>
        <h1 class="text-3xl font-bold">기업회원가입</h1>
      </div>

      <!-- 입력 폼 -->
      <form @submit.prevent="submitForm">
        <div class="space-y-4 mb-6">
          <Select
            v-model="businessType"
            :options="businessOptions"
            optionLabel="label"
            placeholder="기업형태 선택"
            checkmark
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
            <InputText
              v-model="businessPhoneNo"
              placeholder="전화번호"
              :disabled="verifyFlag"
              class="flex-grow px-4 py-3"
              maxlength="13"
            />
            <button
              @click="sendVerificationCode"
              class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
              :disabled="verifyButtonFlag"
            >
              인증번호 전송
            </button>
          </div>
          <div class="flex space-x-2">
            <InputText
              v-model="verifyNo"
              type="text"
              placeholder="인증번호 입력"
              :disabled="verifyFlag"
              class="flex-grow px-4 py-3"
            />
            <button
              @click="verifyCode"
              class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
              :disabled="verifyButtonFlag"
            >
              확인
            </button>
            <button
              @click="sendVerificationCode"
              class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
              :disabled="verifyButtonFlag"
            >
              재전송
            </button>
          </div>
          <InputText v-model="businessEmail" type="email" placeholder="이메일" class="w-full px-4 py-3" />
        </div>

        <!-- 이용약관 -->
        <div class="mt-6">
          <div class="flex items-center mb-2">
            <span>필수동의 항목 및 개인정보 수집 및 이용 동의(선택)에 <br />모두 동의합니다.</span>
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
              <BusinessServiceTerms />
            </div>

            <div class="flex items-center">
              <span>[필수] 개인정보 수집 및 이용 동의</span>
              <button type="button" @click="toggleDetail('privacy')" class="ml-2 text-blue-500">
                {{ details.privacy ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.privacy" class="ml-auto mr-2" />
            </div>
            <div v-if="details.privacy" class="p-2 border rounded bg-gray-100" style="height: 200px; overflow-y: auto">
              <BusinessPrivacyTerms />
            </div>

            <div class="flex items-center">
              <span>[필수] 문자서비스 이용약관 동의</span>
              <button type="button" @click="toggleDetail('sms')" class="ml-2 text-blue-500">
                {{ details.sms ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.sms" class="ml-auto mr-2" />
            </div>
            <div v-if="details.sms" class="p-2 border rounded bg-gray-100" style="height: 200px; overflow-y: auto">
              <SmsServiceTerms />
            </div>

            <hr class="my-2 border-gray-200" />
            <div class="flex items-center">
              <span>[선택] 개인정보 수집 및 이용 동의</span>
              <button type="button" @click="toggleDetail('optionalPrivacy')" class="ml-2 text-blue-500">
                {{ details.optionalPrivacy ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.optionalPrivacy" class="ml-auto mr-2" />
            </div>
            <div
              v-if="details.optionalPrivacy"
              class="p-2 border rounded bg-gray-100"
              style="height: 200px; overflow-y: auto"
            >
              <BusinessOptionalPrivacyTerms />
            </div>
          </div>
        </div>

        <!-- 회원가입 버튼을 신청하기 버튼으로 변경 -->
        <div class="mt-6">
          <Button type="submit" class="w-full py-3 bt_btn primary"> 신청하기 </Button>
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
        <Button label="확인" @click="router.push('/')" class="bt_btn primary w-32" />
      </div>
    </div>
  </Dialog>
</template>
