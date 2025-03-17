<template>
  <div class="privacy-content">
    <p class="description">
      ONOP(이하 "회사")의 글로벌 소싱 플랫폼 서비스 이용을 위해 아래와 같이 개인정보를 수집 및 이용합니다. <br />
      동의를 거부할 권리가 있으며, 동의 거부 시 회사의 서비스 이용이 불가합니다.
    </p>

    <table class="policy-table">
      <colgroup>
        <col width="33%" />
        <col width="33%" />
        <col width="*" />
      </colgroup>
      <thead>
        <tr>
          <th>목적</th>
          <th>항목</th>
          <th>보유 및 이용기간</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            본인여부 확인, 각종 서비스 제공, 취업활동증명서 서비스, 서비스 개선 및 신규 서비스 개발을 위한 통계 활용, 계약이행 및 약관변경 등의 고지를 위한 연락, 본인의사확인 및 민원 등의 고객불만처리
          </td>
          <td>
            가입자명, 본인인증정보 또는 중복가입확인정보(DI), 아이디, 비밀번호, 전화번호, 이메일
          </td>
          <td>
            <span class="underline">회원 탈퇴 시 즉시 파기</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.privacy-content {
  font-size: 14px;
  line-height: 1.6;
}

.description {
  margin-bottom: 20px;
}

.policy-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.policy-table th,
.policy-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: top;
}

.policy-table th {
  background-color: #f8f9fa;
  font-weight: 500;
}

.policy-table td {
  font-size: 13px;
}

.underline {
  text-decoration: underline;
}
</style> 