<template>
  <div ref="resumeTemplate">
    <div class="resume-container p-10 text-sm text-gray-900" style="font-family: Arial; max-width: 800px; margin: auto;">
      <h1 class="text-2xl font-bold text-center mb-8">이력서</h1>

      <!-- 기본 정보 -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-2 border-b pb-1">기본 정보</h2>
        <table>
          <tr><th>이름</th><td>{{ candidate.name }}</td></tr>
          <tr><th>생년월일</th><td>{{ candidate.birth }}</td></tr>
          <tr><th>성별</th><td>{{ candidate.gender }}</td></tr>
          <tr><th>국적</th><td>{{ candidate.nationality }}</td></tr>
          <tr><th>연락처</th><td>{{ candidate.phone }}</td></tr>
          <tr><th>이메일</th><td>{{ candidate.email }}</td></tr>
          <tr><th>주소</th><td>{{ candidate.address }}</td></tr>
        </table>
      </section>

      <!-- 여권 정보 -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-2 border-b pb-1">여권 정보</h2>
        <table>
          <tr><th>이름</th><td>{{ candidate.passportName || '-' }}</td></tr>
          <tr><th>여권번호</th><td>{{ candidate.visaInfo?.type || '-' }}</td></tr>
          <tr><th>국적</th><td>{{ candidate.visaInfo?.country || candidate.nationality }}</td></tr>
          <tr><th>만료일</th><td>{{ candidate.visaInfo?.expiryDate || '-' }}</td></tr>
        </table>
      </section>

      <!-- 언어 능력 -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-2 border-b pb-1">언어 능력</h2>
        <table>
          <tr><th>한국어 능력</th><td>{{ candidate.koreanProficiency || '-' }}</td></tr>
          <tr><th>공부 기간</th><td>{{ candidate.koreanStudyDuration || '-' }}</td></tr>
          <tr><th>한국 방문 경험</th><td>{{ candidate.koreanVisitExperience || '-' }}</td></tr>
        </table>
      </section>

      <!-- 학력 -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-2 border-b pb-1">학력 사항</h2>
        <table>
          <tr><th>학교명</th><td>{{ candidate.education.school }}</td></tr>
          <tr><th>학위</th><td>{{ candidate.education.degree }}</td></tr>
          <tr><th>전공</th><td>{{ candidate.education.major }}</td></tr>
          <tr><th>기간</th><td>{{ candidate.education.period }}</td></tr>
          <tr><th>설명</th><td>{{ candidate.education.description }}</td></tr>
        </table>
      </section>

      <!-- 경력 -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-2 border-b pb-1">경력 사항</h2>
        <table>
          <thead><tr><th>회사명</th><th>직무</th><th>근무 기간</th><th>총 기간</th></tr></thead>
          <tbody>
            <tr v-for="(career, index) in candidate.careerHistory" :key="index">
              <td>{{ career.company }}</td>
              <td>{{ career.position }}</td>
              <td>{{ career.period }}</td>
              <td>{{ calculateCareerPeriod(career.period) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 첨부 서류 -->
      <section class="mb-6">
        <h2 class="text-lg font-semibold mb-2 border-b pb-1">첨부 서류</h2>
        <table>
          <tr><th>여권</th><td>{{ sampleFiles.passport.exists ? '제출완료' : '미제출' }}</td></tr>
          <tr><th>경력 증명서</th><td>{{ sampleFiles.career.exists ? '제출완료' : '미제출' }}</td></tr>
          <tr><th>졸업 증명서</th><td>{{ sampleFiles.education.exists ? '제출완료' : '미제출' }}</td></tr>
          <tr><th>자격증</th><td>{{ sampleFiles.certificate.exists ? '제출완료' : '미제출' }}</td></tr>
        </table>
      </section>

      <p class="text-xs text-right text-gray-400 mt-8">출력일: {{ new Date().toLocaleDateString() }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  candidate: Object,
  sampleFiles: Object,
  calculateCareerPeriod: Function
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
th, td {
  border: 1px solid #333;
  padding: 8px;
  text-align: left;
}
</style>
