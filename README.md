![header](https://capsule-render.vercel.app/api?type=waving&color=609af8&height=100&text=Global%20Sourcing%20Platform&fontColor=000080&fontSize=60&fontAlignY=60&desc=1st%20Generation&descSize=15&descAlignY=90&animation=fadeIn)

> - **_본 소프트웨어는 관련 법률에 따라 보호되는 플랫폼 B&T의 지식재산 및 영업비밀 입니다._**
>   <br/>
> - **_본 소프트웨어를 권한 없이 사용하거나 플랫폼 B&T의 사전 서면 동의 없이 제3자에게 공개하는 행위는 엄격히 금지되어 있으며_**
>   <br/> **_위반 시 귀하는 무단 사용 또는 비밀 유지 의무 위반에 대해 법적인 책임을 져야 합니다._**
>   <br/>
>   <br/>
> - **_This software is the intellectual property and confidential information of Platform B&T,_**
>   <br/> **_Co., Ltd. (“Platform B&T”) protected by applicable laws._**
>   <br/>
> - **_The unauthorized use or disclosure of the software to any third party without the prior written consent of Platform B&T is strictly prohibited, and you should be legally responsible for the unauthorized use or violation of confidentiality obligation._**

<h2>0. Project 로컬환경 구축
    
- main : 현재 운영중인 소스
- develop : 개발이 필요할때 분기하여 사용
    
```
git clone [깃랩 클론 주소]
```

nvm 설치후 node 18.20.0 버전설치  
https://github.com/coreybutler/nvm-windows/releases
(nvm-setup.exe 설치)
```
nvm install 18.20.0
nvm use 18.20.0
```

npm 설치 및 프로젝트 실행

```
npm install // npm 모듈 설치 (package.json dependencies 목록)

npm run local // 로컬환경 실행
npm run dev // 개발서버 실행

npm run build:dev // 개발서버 배포파일 생성 (/dist/dist_dev)
npm run build:prod // 운영서버 배포파일 생성 (/dist/dist_prod)

npm run preview // 마지막에 build된 패키지 실행
```

</br>   
</br>

<h2>1. Nginx 배포 가이드

build : 배포용 파일을 압축

```
npm run build:prod      (운영서버용 build, 명령어 확인)
```

build시 생성된 dist/dist_prod폴더 내부 파일 전부  
운영서버의 /data/webroot/web 에 복사

nginx는 재기동안해도 자동 반영  
만약 반영이 안됐다면 캐싱이 원인  
->ctrl+F5 or 개발자도구 네트워크 탭에 disable cache 체크

</br>   
</br>

<h2>2. Languages

<p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
    <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white"/>
    <br/>
    <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D"/>
    <img src="https://img.shields.io/badge/Primevue-41B883?style=for-the-badge&textColor=black&logo=primevue&logoColor=white"/>
</p>
</br>   
</br>

<h2>3. Tools
<p align="center">
    <img src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white"/>
    <img src="https://img.shields.io/badge/GitLab-330F63?style=for-the-badge&logo=gitlab&logoColor=white"/>
    <img src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=VisualStudioCode&logoColor=white"/>
    <br/>
    <img src="https://img.shields.io/badge/Nginx-47A248?style=for-the-badge&logo=nginx&logoColor=white"/>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/VITE-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
</p>

<!--<p align="center">-->
<!--  <a href="https://skillicons.dev">-->
<!--    <img src="https://skillicons.dev/icons?i=js,html,css,sass,vue"/>-->
<!--    <br/>-->
<!--    <img src="https://skillicons.dev/icons?i=nodejs,pinia,npm,vite,nginx&perline=5&theme=light"/>-->
<!--  </a>-->
<!--</p>-->

</br>   
</br>

<h2>4. 패키지 구조

- 크게 apis, components, pages, router, store 구조로 구성.
- 각 구성마다 admin, auth, common, company, user 서비스를 개별적으로 구축

```
📦gsp_f
 ┣ 📂public : 정적 리소스 폴더
 ┃ ┣ 📂demo
 ┃ ┃ ┣ 📂flag : 다국어 지원 국가 국기 (표기명_코드값.png)
 ┃ ┃ ┃ ┣ 📜JP_ja.png
 ┃ ┃ ┃ ┣ 📜KO_ko.png
 ┃ ┃ ┃ ┣ 📜US_en.png
 ┃ ┃ ┃ ┗ 📜VI_vi.png
 ┃ ┣ 📜BTfavicon.svg
 ┃ ┗ 📜default-profile.jpg : 프로필 없을때 기본 프로필
 ┣ 📂src
 ┃ ┣ 📂apis : api 호출부 모듈
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┗ 📜adminApis.js
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📜authApis.js
 ┃ ┃ ┃ ┗ 📜authConstants.js : 권한체크가 필요없는 페이지 목록
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┗ 📜commonApis.js
 ┃ ┃ ┣ 📂company
 ┃ ┃ ┃ ┗ 📜companyApis.js
 ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┗ 📜userApis.js
 ┃ ┃ ┗ 📜index.js : api instance 구축 파일
 ┃ ┣ 📂assets
 ┃ ┃ ┣ 📂demo
 ┃ ┃ ┃ ┣ 📂flags
 ┃ ┃ ┃ ┃ ┣ 📜flags.css
 ┃ ┃ ┃ ┃ ┗ 📜flags_responsive.png
 ┃ ┃ ┃ ┣ 📜code.scss
 ┃ ┃ ┃ ┗ 📜demo.scss
 ┃ ┃ ┣ 📂font
 ┃ ┃ ┃ ┣ 📜MaterialSymbolsRoundedVariable.woff2
 ┃ ┃ ┃ ┣ 📜OutfitVariable.woff2
 ┃ ┃ ┃ ┗ 📜PretendardVariable.woff2
 ┃ ┃ ┣ 📂layout : 공통 css 구성 폴더
 ┃ ┃ ┃ ┣ 📂variables
 ┃ ┃ ┃ ┃ ┣ 📜_common.scss
 ┃ ┃ ┃ ┃ ┣ 📜_dark.scss
 ┃ ┃ ┃ ┃ ┗ 📜_light.scss
 ┃ ┃ ┃ ┣ 📜layout.scss
 ┃ ┃ ┃ ┣ 📜_core.scss
 ┃ ┃ ┃ ┣ 📜_custom.scss : 템플릿 스타일 외 커스텀 스타일 모듈
 ┃ ┃ ┃ ┣ 📜_footer.scss
 ┃ ┃ ┃ ┣ 📜_main.scss
 ┃ ┃ ┃ ┣ 📜_menu.scss
 ┃ ┃ ┃ ┣ 📜_mixins.scss
 ┃ ┃ ┃ ┣ 📜_preloading.scss
 ┃ ┃ ┃ ┣ 📜_responsive.scss
 ┃ ┃ ┃ ┣ 📜_topbar.scss
 ┃ ┃ ┃ ┣ 📜_typography.scss
 ┃ ┃ ┃ ┗ 📜_utils.scss
 ┃ ┃ ┣ 📜styles.scss
 ┃ ┃ ┗ 📜tailwind.css
 ┃ ┣ 📂components : 페이지내 공통 컴포넌트 모듈
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┣ 📜Admin.vue
 ┃ ┃ ┃ ┣ 📜AdminHeader.vue
 ┃ ┃ ┃ ┣ 📜AdminSidebar.vue
 ┃ ┃ ┃ ┣ 📜UserCreateModal.vue
 ┃ ┃ ┃ ┗ 📜UserDetailModal.vue
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┗ 📜CommonMessageDialog.vue : 공통 alert, confirm, toast 구축 파일
 ┃ ┃ ┣ 📂company
 ┃ ┃ ┃ ┗ 📜InterviewResultsDetailModal.vue
 ┃ ┃ ┗ 📂terms
 ┃ ┃ ┃ ┣ 📜BusinessOptionalPrivacyTerms.vue
 ┃ ┃ ┃ ┣ 📜BusinessPrivacyTerms.vue
 ┃ ┃ ┃ ┣ 📜BusinessServiceTerms.vue
 ┃ ┃ ┃ ┣ 📜OptionalPrivacyTerms.vue
 ┃ ┃ ┃ ┣ 📜PrivacyTerms.vue
 ┃ ┃ ┃ ┣ 📜ServiceTerms.vue
 ┃ ┃ ┃ ┗ 📜SmsServiceTerms.vue
 ┃ ┣ 📂layout : 공통 레이아웃 구축 폴더
 ┃ ┃ ┣ 📂composables
 ┃ ┃ ┃ ┗ 📜layout.js
 ┃ ┃ ┣ 📜AppConfigurator.vue
 ┃ ┃ ┣ 📜AppFooter.vue
 ┃ ┃ ┣ 📜AppLayout.vue
 ┃ ┃ ┣ 📜AppMenu.vue
 ┃ ┃ ┣ 📜AppMenuItem.vue
 ┃ ┃ ┣ 📜AppSidebar.vue
 ┃ ┃ ┗ 📜AppTopbar.vue
 ┃ ┣ 📂pages : 사이트 내 페이지 폴더
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┣ 📜AdminFaqPage.vue
 ┃ ┃ ┃ ┣ 📜AdminInquiriesPage.vue
 ┃ ┃ ┃ ┣ 📜AdminInterviewManagementPage.vue
 ┃ ┃ ┃ ┣ 📜AdminLoginPage.vue
 ┃ ┃ ┃ ┣ 📜AdminUserMngPage.vue
 ┃ ┃ ┃ ┗ 📜BusinessApplicationsPage.vue
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┣ 📜CommonPage.vue
 ┃ ┃ ┃ ┣ 📜CompanyRegisterPage.vue
 ┃ ┃ ┃ ┣ 📜FaqPage.vue
 ┃ ┃ ┃ ┣ 📜FindIdPage.vue
 ┃ ┃ ┃ ┣ 📜FindPasswordPage.vue
 ┃ ┃ ┃ ┣ 📜InquiryPage.vue
 ┃ ┃ ┃ ┣ 📜LoginPage.vue
 ┃ ┃ ┃ ┣ 📜PersonalRegisterPage.vue
 ┃ ┃ ┃ ┣ 📜RegisterComplete.vue
 ┃ ┃ ┃ ┣ 📜RegisterSelect.vue
 ┃ ┃ ┃ ┗ 📜ResetPasswordPage.vue
 ┃ ┃ ┣ 📂company
 ┃ ┃ ┃ ┣ 📜CompanyInfoPage.vue
 ┃ ┃ ┃ ┣ 📜CreateInterviewOfferPage.vue
 ┃ ┃ ┃ ┣ 📜Dashboard.vue : 기업 메인 대시보드 페이지
 ┃ ┃ ┃ ┣ 📜InterviewOffersPage.vue
 ┃ ┃ ┃ ┣ 📜InterviewResultsPage.vue
 ┃ ┃ ┃ ┗ 📜TalentSearchPage.vue
 ┃ ┃ ┣ 📂policy
 ┃ ┃ ┃ ┣ 📜PrivacyPolicyPage.vue
 ┃ ┃ ┃ ┗ 📜TermsOfServicePage.vue
 ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┣ 📜CompanyList.vue
 ┃ ┃ ┃ ┣ 📜JobOffersPage.vue
 ┃ ┃ ┃ ┣ 📜JobSeekerInterviewsPage.vue
 ┃ ┃ ┃ ┣ 📜RegisterComplete.vue
 ┃ ┃ ┃ ┣ 📜ResumePage.vue
 ┃ ┃ ┃ ┣ 📜SupportDetailPage.vue
 ┃ ┃ ┃ ┗ 📜UserPage.vue
 ┃ ┃ ┗ 📜Dashboard.vue : 구직자 메인 대시보드 페이지
 ┃ ┣ 📂plugins : 추가적인 커스텀 이벤트훅 구축 폴더
 ┃ ┃ ┣ 📜commonprimevue.js : primevue 템플릿 모듈
 ┃ ┃ ┣ 📜commonspinner.js
 ┃ ┃ ┗ 📜commonutils.js : 공통 커스텀 이벤트훅 구축
 ┃ ┣ 📂router : 페이지 라우팅 관리 폴더
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┗ 📜adminRouter.js
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┗ 📜authRouter.js
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┗ 📜commonRouter.js
 ┃ ┃ ┣ 📂company
 ┃ ┃ ┃ ┗ 📜companyRouter.js
 ┃ ┃ ┣ 📂policy
 ┃ ┃ ┃ ┗ 📜policyRouter.js
 ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┗ 📜userRouter.js
 ┃ ┃ ┗ 📜index.js : 라우터가드 구축 파일
 ┃ ┣ 📂store : 상태관리 폴더
 ┃ ┃ ┣ 📂admin
 ┃ ┃ ┃ ┗ 📜adminStore.js
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┗ 📜authStore.js
 ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┗ 📜commonStore.js
 ┃ ┃ ┣ 📂company
 ┃ ┃ ┃ ┗ 📜companyStore.js
 ┃ ┃ ┣ 📂interview
 ┃ ┃ ┃ ┗ 📜interviewStore.js
 ┃ ┃ ┗ 📂user
 ┃ ┃ ┃ ┗ 📜userStore.js
 ┃ ┣ 📜App.vue
 ┃ ┗ 📜main.js
 ┣ 📜.editorconfig
 ┣ 📜.env.development : 개발서버 환경변수
 ┣ 📜.env.localhost : 로컬 환경변수
 ┣ 📜.env.production : 운영서버 환경변수
 ┣ 📜.eslintrc.cjs
 ┣ 📜.gitignore : 깃 추적 제외 파일 및 폴더 세텅
 ┣ 📜.prettierrc.json : vsc prettier 세팅
 ┣ 📜CHANGELOG.md
 ┣ 📜index.html : 사이트 기본 페이지, 다국어 번역 기능 세팅 파일
 ┣ 📜jsconfig.json
 ┣ 📜LICENSE.md
 ┣ 📜package-lock.json
 ┣ 📜package.json : npm 라이브러리 목록, script 명령어 확인
 ┣ 📜postcss.config.js
 ┣ 📜README.md : 서비스 세부정보
 ┣ 📜tailwind.config.js
 ┣ 📜vercel.json
 ┗ 📜vite.config.mjs : 번들링 설정 세팅 파일
```

</br>   
</br>

<h2>5. 주요 기능 흐름</br></br>
1. 기본적인 흐름 : page</br>
 -> apis[GET(조회) or POST(저장, 수정) /api/gsource/{사용자}/{요구사항}/{id}]</br>
 -> B.E.controller.service</br>
 -> DB -> page ( -> store )</br></br>
2. admin(관리자), company(고용주), user(구직자), auth(권한) 사용자 or 유형 타입별로 흐름 분기

</br>   
</br>

<h2>6. API 명세</br></br>
http://182.229.224.143/gsource/api/api-docs/
