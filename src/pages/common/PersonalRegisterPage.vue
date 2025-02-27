<script setup>
import { ref, watch } from 'vue';
import { isEmpty } from 'es-toolkit/compat';
import { verifypassportNo } from '@/apis/auth/authApis';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter();

const id = ref('');
const pw = ref('');
const showPw = ref(false);
const showPwCheck = ref(false);
const name = ref('');
const birthdate = ref('');
const gender = ref('');
const email = ref('');

const idCheckMessage = ref('');
const idCheckSuccess = ref(false);
const pwCheck = ref('');
const pwCheckMessage = ref('');
const pwMessage = ref('');
const pwError = ref(false);

const pwCheckFlag = ref(false);
// const personalPhone = ref('');
// const verificationCode = ref('');

const nationality = ref(null);
const passportNo = ref('M981L0621');
const passportLastName = ref('');
const passportFirstName = ref('');
const issueDate = ref(null);
const expirationDate = ref(null);
const issuingCountry = ref(null);

const nationalityOptions = [
  { label: '대한민국', value: 'KOR' },
  { label: '일본', value: 'JPN' },
  { label: '중국', value: 'CHN' },
  // ... 더 많은 국가들
];

const countryOptions = [
  { label: '대한민국', value: 'KOR' },
  { label: '일본', value: 'JPN' },
  { label: '중국', value: 'CHN' },
  // ... 더 많은 국가들
];

const formError = ref('');

const checkIdDuplication = async () => {
  if (!id.value.trim()) {
    idCheckMessage.value = '아이디를 입력해주세요.';
    idCheckSuccess.value = false;
    return;
  }

  try {
    // 여기에 실제 API 호출을 추가하세요.
    // 예시: const response = await axios.post('/api/check-id', { id: id.value });

    // 임시로 중복 확인 로직을 추가합니다.
    const isDuplicate = id.value === 'existingId'; // 'existingId'는 이미 존재하는 아이디 예시입니다.

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

const isValidPassword = (password) => {
  // 8~16자의 영문, 숫자, 특수문자 조합
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
  return regex.test(password);
};

const containsInvalidCharacters = (password) => {
  // 특정 특수문자를 포함하는지 확인
  return /[~^()\-_+=`\[\]{}|;':",.\\/<>]/.test(password);
};

const allAgreed = ref(false);
const terms = ref({
  age: false,
  service: false,
  privacy: false,
  optionalPrivacy: false
  // emailAds: false,
  // smsAds: false
});

const details = ref({
  service: false,
  privacy: false,
  optionalPrivacy: false,
  emailAds: false,
  smsAds: false
});

watch(
  () => pwCheck.value,
  () => {
    if (!isEmpty(pwCheck.value) && pwCheck.value !== pw.value) {
      pwCheckFlag.value = true;
    } else {
      pwCheckFlag.value = false;
    }
  }
);

watch(pw, (newVal) => {
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

watch(pwCheck, (newVal) => {
  if (newVal && newVal !== pw.value) {
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

const verifyPassport = async () => {
  // 여권번호 확인 로직

  body = {
    organization: '0001',
    passportNo: passportNo.value,
    nationality: '12',
    country: '',
    birthDate: '19980814'
  };

  try {
    const response = await verifypassportNo(body);

    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const toggleAll = () => {
  const newValue = allAgreed.value;
  terms.value = {
    age: newValue,
    service: newValue,
    privacy: newValue,
    optionalPrivacy: newValue,
    emailAds: newValue,
    smsAds: newValue
  };
};

const toggleDetail = (key) => {
  details.value[key] = !details.value[key];
};

const submitForm = () => {
  if (
    // 기존 필수 항목들
    !id.value.trim() ||
    !pw.value.trim() ||
    !name.value.trim() ||
    !birthdate.value.trim() ||
    !email.value.trim() ||
    !terms.value.age ||
    !terms.value.service ||
    !terms.value.privacy ||
    // 여권 정보 필수 항목들
    !nationality.value ||
    !passportNo.value.trim() ||
    !passportLastName.value.trim() ||
    !passportFirstName.value.trim() ||
    !issueDate.value ||
    !expirationDate.value ||
    !issuingCountry.value
  ) {
    formError.value = '모든 필수 항목을 입력하고 체크해주세요.';
    return;
  }

  // 여권 유효기간 검사
  // const today = new Date();
  // if (new Date(expirationDate.value) <= today) {
  //   formError.value = '만료된 여권입니다. 유효한 여권을 입력해주세요.';
  //   return;
  // }

  // // 발급일이 만료일보다 늦은 경우 체크
  // if (new Date(issueDate.value) >= new Date(expirationDate.value)) {
  //   formError.value = '여권 발급일이 만료일보다 늦을 수 없습니다.';
  //   return;
  // }

  // 가입 처리 로직
  formError.value = '';
  console.log('가입 성공');
  // 회원가입 완료 페이지로 이동
  router.push({ name: 'userRegisterComplete' });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-xl text-[#8FA1FF] font-bold">BT POTAL</router-link>
        <h1 class="text-3xl font-bold">개인회원가입</h1>
      </div>

      <!-- 입력 폼 -->
      <form @submit.prevent="submitForm">
        <div class="space-y-4 mb-6">
          <div>
            <div class="flex space-x-2">
              <InputText v-model="id" type="text" placeholder="아이디" class="flex-grow px-4 py-3" />
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
                v-model="pw"
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
                v-model="pwCheck"
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
          <InputText v-model="name" type="text" placeholder="이름(실명)" class="w-full px-4 py-3" />
          <div class="flex space-x-4">
            <InputText
              v-model="birthdate"
              type="text"
              placeholder="생년월일(예시: 20000131)"
              class="flex-grow px-4 py-3"
            />
            <div class="flex items-center space-x-2">
              <label>
                <input type="radio" v-model="gender" value="male" />
                남자
              </label>
              <label>
                <input type="radio" v-model="gender" value="female" />
                여자
              </label>
            </div>
          </div>
          <InputText v-model="email" type="email" placeholder="이메일" class="w-full px-4 py-3" />
          <!-- <div class="flex space-x-2">
            <input
              v-model="personalPhone"
              type="text"
              placeholder="휴대폰번호"
              class="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
            />
            <button
              type="button"
              @click="sendVerificationCode"
              class="px-4 py-3 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
            >
              인증번호 전송
            </button>
          </div>
          <div class="flex space-x-2">
            <input
              v-model="verificationCode"
              type="text"
              placeholder="인증번호 입력"
              class="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8FA1FF]"
            />
            <button
              type="button"
              @click="verifyCode"
              class="px-4 py-3 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
            >
              확인
            </button>
            <button
              type="button"
              @click="resendVerificationCode"
              class="px-4 py-3 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
            >
              재전송
            </button>
          </div> -->
          <div class="space-y-4">
            <h3 class="font-bold text-lg mb-2">여권 정보</h3>
            
            <!-- 국적 선택 -->
            <div class="flex space-x-2">
              <Select
                v-model="nationality"
                :options="nationalityOptions"
                optionLabel="label"
                placeholder="국적"
                class="w-full"
              />
            </div>

            <!-- 여권번호 -->
            <div class="flex space-x-2">
              <InputText 
                v-model="passportNo" 
                type="text" 
                placeholder="여권번호 (예: M12345678)" 
                class="flex-grow px-4 py-3"
                maxlength="9"
                @input="formatPassportNo"
              />
              <button
                type="button"
                @click="verifyPassport"
                :disabled="!isValidPassport"
                class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
              >
                여권번호 확인
              </button>
            </div>

            <!-- 영문 이름 -->
            <div class="flex space-x-2">
              <InputText
                v-model="passportLastName"
                type="text"
                placeholder="영문 성 (예: HONG)"
                class="w-1/2 px-4 py-3"
              />
              <InputText
                v-model="passportFirstName"
                type="text"
                placeholder="영문 이름 (예: GILDONG)"
                class="w-1/2 px-4 py-3"
              />
            </div>

            <!-- 발급일/만료일 -->
            <div class="flex space-x-4">
              <div class="w-1/2">
                <label class="block text-sm text-gray-600 mb-1">발급일</label>
                <DatePicker
                  v-model="issueDate"
                  showIcon
                  fluid
                  iconDisplay="input"
                  dateFormat="yy-mm-dd"
                  placeholder="YYYY-MM-DD"
                  class="w-full"
                />
              </div>
              <div class="w-1/2">
                <label class="block text-sm text-gray-600 mb-1">만료일</label>
                <DatePicker
                  v-model="expirationDate"
                  showIcon
                  fluid
                  iconDisplay="input"
                  dateFormat="yy-mm-dd"
                  placeholder="YYYY-MM-DD"
                  class="w-full"
                />
              </div>
            </div>

            <!-- 발급국가 -->
            <div class="flex space-x-2">
              <Select
                v-model="issuingCountry"
                :options="countryOptions"
                optionLabel="label"
                placeholder="발급국가"
                class="w-full"
              />
            </div>
          </div>
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
            <div v-if="details.service" class="p-2 border rounded bg-gray-100" style="height: 200px; overflow-y: auto">
              <p>제 1 조 (목적)</p>
              <p>
                본 약관은 BTPotal(이하 "회사")이 운영하는 "서비스"를 이용함에 있어 "회사"와 회원간의 이용 조건 및 제한
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
          <Button type="submit" class="w-full py-3 bt_btn primary"> 가입하기 </Button>
          <p v-if="formError" class="text-red-500">{{ formError }}</p>
        </div>
      </form>
    </div>
  </div>
</template>
