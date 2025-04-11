<script setup>
import { onMounted, ref, watch } from 'vue';
import { isEmpty } from 'es-toolkit/compat';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useMessagePop } from '@/plugins/commonutils';
import { checkDuplicate, signUpUser } from '@/apis/auth/authApis';
import { fileUpload, getCodeList } from '@/apis/common/commonApis';
import { useAuthStore } from '@/store/auth/authStore';

const messagePop = useMessagePop();
const authStore = useAuthStore();
const router = useRouter();

const files = ref();

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
const passportNo = ref('');
const passportLastName = ref('');
const passportFirstName = ref('');
const issueDate = ref(null);
const expirationDate = ref(null);
const issuingCountry = ref(null);

// 국적리스트
const nationalityOptions = ref([]);

const formError = ref('');

onMounted(() => {
  // 국적 리스트 조회
  getNationList();
});

const getNationList = async () => {
  const response = await getCodeList(`NATIONALITY_TY`);

  response.map((item) => {
    nationalityOptions.value.push({
      name: item.name,
      code: item.code
    });
  });
};

// 아이디 중복체크
const checkIdDuplication = async () => {
  if (!id.value.trim()) {
    idCheckMessage.value = '아이디를 입력해주세요.';
    idCheckSuccess.value = false;
    return;
  }

  try {
    const response = await checkDuplicate(id.value);

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
  optionalPrivacy: false
  // emailAds: false,
  // smsAds: false
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

// TODO: 테스트용 주석
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

const toggleAll = () => {
  const newValue = allAgreed.value;
  terms.value = {
    age: newValue,
    service: newValue,
    privacy: newValue,
    optionalPrivacy: newValue
  };
};

const toggleDetail = (key) => {
  details.value[key] = !details.value[key];
};

const submitForm = async () => {
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
    !issuingCountry.value ||
    !files.value.hasFiles
  ) {
    formError.value = '모든 필수 항목을 입력하고 체크해주세요.';
    return;
  }

  // 여권사진 저장
  const fornmData = savePassportImage();

  const res = await fileUpload(fornmData);

  if (res && res.success === undefined) {
    const body = {
      user: {
        loginId: id.value,
        name: name.value,
        password: pw.value,
        // 상단이 필수값
        profileImage: null,
        birth: birthdate.value,
        mobile: null,
        email: email.value,
        address: null,
        genderCd: `GENDER_${gender.value}`
      },
      resume: {
        nationalityCd: nationality.value,
        passport: passportNo.value,
        passportName: `${passportFirstName.value} ${passportLastName.value}`,
        passportFirstName: passportFirstName.value,
        passportLastName: passportLastName.value,
        passportIssueDt: new Date(issueDate.value).toISOString(),
        passportExpiryDt: new Date(expirationDate.value).toISOString(),
        passportCountryCd: issuingCountry.value,
        passportFileId: res.id,
        snsUrl: null,
        portfolioUrl: null,
        portfolioFile: null
      }
    };

    const response = await signUpUser(body);

    // 회원가입 완료 페이지로 이동
    if (response && response.success === undefined) {
      formError.value = '';
      router.push('/user/register/complete');
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
  formData.append('file', files.value.files[0]);

  return formData;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[rgb(229, 231, 235)]">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-[480px]">
      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="text-xl text-[#8FA1FF] font-bold notranslate">Global Sourcing Portal</router-link>
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
          <InputText v-model="name" type="text" placeholder="이름(영어)" class="w-full px-4 py-3" />
          <div class="flex space-x-4">
            <InputMask
              v-model="birthdate"
              mask="9999.99.99"
              placeholder="생년월일(예시: 2000.01.31)"
              class="flex-grow px-4 py-3"
            />
            <div class="flex items-center space-x-2">
              <label>
                <input type="radio" v-model="gender" value="MALE" />
                남자
              </label>
              <label>
                <input type="radio" v-model="gender" value="FEMALE" />
                여자
              </label>
            </div>
          </div>
          <InputText v-model="email" type="email" placeholder="이메일" class="w-full px-4 py-3" />
          <div class="space-y-4">
            <h3 class="font-bold text-lg mb-2">여권 정보</h3>

            <!-- 국적 선택 -->
            <div class="flex space-x-2">
              <Select
                v-model="nationality"
                :options="nationalityOptions"
                optionLabel="name"
                optionValue="code"
                checkmark
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
              <FileUpload
                style="background-color: #f2f4f7; color: #353336; border-color: #9d9aa0"
                ref="files"
                mode="basic"
                name="demo[]"
                url="/api/upload"
                accept="image/*"
                chooseLabel="파일 선택"
                :maxFileSize="1000000"
                @upload="onUpload"
              />
              <!-- <button
                type="button"
                @click="test"
                class="px-4 py-2 bg-[#F2F4F7] text-gray-500 border border-gray-300 rounded-lg"
              >
                여권번호 확인
              </button> -->
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
                :options="nationalityOptions"
                optionLabel="name"
                optionValue="code"
                placeholder="발급국가"
                class="w-full"
              />
            </div>
          </div>
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
              <ServiceTerms />
            </div>
            <div class="flex items-center">
              <span>[필수] 개인정보 수집 및 이용 동의</span>
              <button type="button" @click="toggleDetail('privacy')" class="ml-2 text-blue-500">
                {{ details.privacy ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.privacy" class="ml-auto mr-2" />
            </div>
            <div v-if="details.privacy" class="p-2 border rounded bg-gray-100" style="height: 200px; overflow-y: auto">
              <PrivacyTerms />
            </div>
            <hr class="my-2 border-gray-200" />
            <div class="flex items-center">
              <span>[선택] 개인정보 수집 및 이용 동의</span>
              <button type="button" @click="toggleDetail('optionalPrivacy')" class="ml-2 text-blue-500">
                {{ details.optionalPrivacy ? '내용닫기' : '내용보기' }}
              </button>
              <input type="checkbox" v-model="terms.optionalPrivacy" class="ml-auto mr-2" />
            </div>
          </div>
          <div
            v-if="details.optionalPrivacy"
            class="p-2 border rounded bg-gray-100"
            style="height: 200px; overflow-y: auto"
          >
            <OptionalPrivacyTerms />
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

<style scoped lang="scss">
.upload-button {
  background-color: #f2f4f7;
  color: #353336;
  border-color: #9d9aa0;
}
</style>
