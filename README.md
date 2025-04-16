![header](https://capsule-render.vercel.app/api?type=waving&color=609af8&height=100&text=SAMSUNG&fontColor=000080&fontSize=60&fontAlignY=60&desc=Science-Based%20Digital%20Twin&descSize=15&descAlignY=90&animation=fadeIn)

> - **_본 소프트웨어는 관련 법률에 따라 보호되는 삼성의 지식재산 및 영업비밀 입니다._**
>   <br/>
> - **_본 소프트웨어를 권한 없이 사용하거나 삼성의 사전 서면 동의 없이 제3자에게 공개하는 행위는 엄격히 금지되어 있으며_**
>   <br/> **_위반 시 귀하는 무단 사용 또는 비밀 유지 의무 위반에 대해 법적인 책임을 져야 합니다._**
>   <br/>
>   <br/>
> - **_This software is the intellectual property and confidential information of Samsung Electronics,_**
>   <br/> **_Co., Ltd. (“Samsung”) protected by applicable laws._**
>   <br/>
> - **_The unauthorized use or disclosure of the software to any third party without the prior written consent of Samsung is strictly prohibited, and you should be legally responsible for the unauthorized use or violation of confidentiality obligation._**

<h2>0. Project 실행 가이드

git clone시 proxy세팅

```
git config --global http.proxy http://12.127.100.100:8080(본인 proxy 주소)
git config --global http.sslVerify false

```

nvm 설치후 node 18.20.0 버전설치

```
nvm install 18.20.0
nvm use 18.20.0

nvm proxy http://12.127.100.100:8080(본인 proxy 주소)
```

npm 설치 및 프로젝트 실행

```js
//npm proxy 설정
npm config set proxy http://12.127.100.100:8080
npm config set https-proxy http://12.127.100.100:8080
npm config set strict-ssl false

npm install // npm 모듈 설치

npm run dev // 개발서버 실행

npm run build:dev // 개발서버 배포파일 생성
npm run build:production // 운영서버 배포파일 생성

npm run preview // build된 패키지 실행
```

</br>   
</br>

<h2>1. Nginx 배포 가이드

최초1회

```
cd ../sbdt_front (sbdt_front로 이동)
mkdir .../deploy (한칸 위 디렉토리에서 deploy폴더 생성)
```

build : 배포용 파일을 압축

```
cd ../sbdt_front        (sbdt_front로 이동)
npm run build:dev      (개발서버용 build, 명령어 확인)
```

nginx - 1.26.1 windows용 설치  
build시 생성된 dist폴더 내부 파일 전부  
nginx-1.26.1/nginx-1.26.1/html 에 복사

```
tar cvzf ../../deploy/dev_240628.tgz *
(deploy 폴더로 압축, 압축할때 html안 파일들만 압축)
```

deploy : 압축파일을 서버로 옮겨 배포  
HPC>FTP 파일 전송  
vwp에서

```
ssh jump01 -l caev13177.jump
ssh pbroad0051 -l caev13177
su - viststorage #비번 : vistwjwkd2@   (Nginx 계정 로그인)
cd user/viststorage2/vist2024/STwinner/nginx/sbin
nginx -s stop (실행중이면 종료, 아니면 error출력)
cd ../html
rm -rf * (기존 배포파일 삭제)
tar xvzf /user/caev13177/TMP/dev_240628.tgz
cd ../sbin
nginx #시작
```

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
    <img src="https://img.shields.io/badge/Pinia-F7DF1E?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTA4Ij48ZyBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yOS44OTMgNjguNzk0bC0xLjY4Ny45NzQgMiAzLjQ2NCAxLjY4Ny0uOTc0IDEyLjIxNC03LjA1MiAxLjY4Ny0uOTc0LTItMy40NjQtMS42ODcuOTc0ek04OC4xMDcgNzIuMjU4bDEuNjg3Ljk3NCAyLTMuNDY0LTEuNjg3LS45NzQtMTIuMjE0LTcuMDUyLTEuNjg3LS45NzQtMiAzLjQ2NCAxLjY4Ny45NzR6Ii8+PHBhdGggZD0iTTgwIDU0YzAtMTEuMDQ2LTguOTU0LTIwLTIwLTIwcy0yMCA4Ljk1NC0yMCAyMCA4Ljk1NCAyMCAyMCAyMCAyMC04Ljk1NCAyMC0yMHptLTM1Ljc2NyAwYzAtOC43MDggNy4wNTktMTUuNzY3IDE1Ljc2Ny0xNS43NjcgOC43MDggMCAxNS43NjcgNy4wNTkgMTUuNzY3IDE1Ljc2NyAwIDguNzA4LTcuMDU5IDE1Ljc2Ny0xNS43NjcgMTUuNzY3LTguNzA4IDAtMTUuNzY3LTcuMDU5LTE1Ljc2Ny0xNS43Njd6Ii8+PGNpcmNsZSBjeD0iMjQiIGN5PSI3NSIgcj0iMyIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iOTYiIHI9IjMiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjEyIiByPSIzIi8+PGNpcmNsZSBjeD0iOTYiIGN5PSIzMyIgcj0iMyIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMzMiIHI9IjMiLz48Y2lyY2xlIGN4PSI5NiIgY3k9Ijc1IiByPSIzIi8+PGNpcmNsZSBjeD0iNjAiIGN5PSI1NCIgcj0iMyIvPjxwYXRoIGQ9Ik0yIDUySDB2NGg0MnYtNGgtMnpNODAgNTJoLTJ2NGg0MnYtNGgtMnpNNzIuODMgNzAuMzg5bC0xLjAwNy0xLjcyOS0zLjQ1NiAyLjAxNCAxLjAwNyAxLjcyOCAxOS4xMjggMzIuODM1IDEuMDA3IDEuNzI4IDMuNDU2LTIuMDE0LTEuMDA3LTEuNzI4ek0zMi41ODEgMi4xNEwzMS41NzUuNDEybC0zLjQ1NyAyLjAxMyAxLjAwNyAxLjcyOSAxOS4xMjggMzIuODM0IDEuMDA3IDEuNzI4IDMuNDU2LTIuMDEzLTEuMDA2LTEuNzI4ek05MC43MSA0LjE1NGwxLjAwNi0xLjcyOUw4OC4yNi40MTIgODcuMjUzIDIuMTQgNjguMTI1IDM0Ljk3NWwtMS4wMDcgMS43MjggMy40NTcgMi4wMTMgMS4wMDYtMS43Mjh6TTUwLjgyNyA3Mi41OTdsMS4wMDYtMS43MjgtMy40NTYtMi4wMTQtMS4wMDcgMS43MjgtMTkuMTI4IDMyLjgzNS0xLjAwNyAxLjcyOCAzLjQ1NyAyLjAxNCAxLjAwNi0xLjcyOHpNNTggODcuMDE3Vjg5aDRWNzFoLTR2MS45ODN6TTU4IDM1LjA1MlYzN2g0VjE5aC00djEuOTQ4ek00Mi4xMDcgNDYuMjU4bDEuNjg3Ljk3NCAyLTMuNDY0LTEuNjg3LS45NzQtMTIuMjE0LTcuMDUyLTEuNjg3LS45NzQtMiAzLjQ2NCAxLjY4Ny45NzR6TTc1Ljg5MyA0Mi43OTRsLTEuNjg3Ljk3NCAyIDMuNDY0IDEuNjg3LS45NzQgMTIuMjE0LTcuMDUyIDEuNjg3LS45NzQtMi0zLjQ2NC0xLjY4Ny45NzR6Ii8+PC9nPjwvc3ZnPg==>"/> 
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

<h2>4. Package Structure

```
📦src
 ┣ 📂apis
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📜authConstants.js
 ┃ ┃ ┣ 📜commonApis.js
 ┃ ┃ ┣ 📜constants.js
 ┃ ┃ ┣ 📜errorConstants.js
 ┃ ┃ ┗ 📜util.js
 ┃ ┣ 📂sbdt
 ┃ ┃ ┗ 📜sbdtApis.js
 ┃ ┣ 📂sidt
 ┃ ┃ ┗ 📜sidtApis.js
 ┃ ┗ 📜index.js
 ┣ 📂assets
 ┃ ┣ 📂demo
 ┃ ┃ ┣ 📂flags
 ┃ ┃ ┃ ┣ 📜flags.css
 ┃ ┃ ┃ ┗ 📜flags_responsive.png
 ┃ ┃ ┣ 📜code.scss
 ┃ ┃ ┗ 📜demo.scss
 ┃ ┣ 📂font
 ┃ ┃ ┣ 📜MaterialSymbolsRoundedVariable.woff2
 ┃ ┃ ┣ 📜OutfitVariable.woff2
 ┃ ┃ ┗ 📜PretendardVariable.woff2
 ┃ ┣ 📂images
 ┃ ┃ ┣ 📜bg_bn.png
 ┃ ┃ ┣ 📜bg_video1.mp4
 ┃ ┃ ┣ 📜bg_video2.mp4
 ┃ ┃ ┣ 📜favicon.png
 ┃ ┃ ┣ 📜favicon_samsung.png
 ┃ ┃ ┣ 📜icons8-folder.svg
 ┃ ┃ ┣ 📜ic_arrow_right_wh.svg
 ┃ ┃ ┣ 📜ic_excel.svg
 ┃ ┃ ┣ 📜logo.svg
 ┃ ┃ ┣ 📜logo_wh.svg
 ┃ ┃ ┣ 📜mask_map_cover.svg
 ┃ ┃ ┗ 📜symbol.svg
 ┃ ┣ 📂layout
 ┃ ┃ ┣ 📜layout.scss
 ┃ ┃ ┣ 📜_config.scss
 ┃ ┃ ┣ 📜_content.scss
 ┃ ┃ ┣ 📜_custom.scss
 ┃ ┃ ┣ 📜_footer.scss
 ┃ ┃ ┣ 📜_main.scss
 ┃ ┃ ┣ 📜_menu.scss
 ┃ ┃ ┣ 📜_mixins.scss
 ┃ ┃ ┣ 📜_preloading.scss
 ┃ ┃ ┣ 📜_responsive.scss
 ┃ ┃ ┣ 📜_topbar.scss
 ┃ ┃ ┣ 📜_typography.scss
 ┃ ┃ ┣ 📜_utils.scss
 ┃ ┃ ┗ 📜_variables.scss
 ┃ ┗ 📜styles.scss
 ┣ 📂components
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📜CommonMessageDialog.vue
 ┃ ┃ ┣ 📜CommonUserInputField.vue
 ┃ ┃ ┣ 📜CommonUserSearchDialog.vue
 ┃ ┃ ┣ 📜RequestAuth.vue
 ┃ ┃ ┣ 📜RequestAuthApproval.vue
 ┃ ┃ ┣ 📜RequestAuthMain.vue
 ┃ ┃ ┣ 📜RequestAuthSelfCheck.vue
 ┃ ┃ ┣ 📜StyleGuideMenu.vue
 ┃ ┃ ┣ 📜TopMenu.vue
 ┃ ┃ ┣ 📜UploadDialog.vue
 ┃ ┃ ┗ 📜UserLoginInfo.vue
 ┃ ┣ 📂dashboard
 ┃ ┃ ┗ 📜CardFrame.vue
 ┃ ┣ 📂sbdt
 ┃ ┃ ┣ 📜AnalyzeDialog.vue
 ┃ ┃ ┣ 📜CustomWaferMap.vue
 ┃ ┃ ┣ 📜FileManagerDialog.vue
 ┃ ┃ ┣ 📜FluxMap.vue
 ┃ ┃ ┣ 📜InferenceWaitingDialog.vue
 ┃ ┃ ┣ 📜LotTrackingCompareDialog.vue
 ┃ ┃ ┣ 📜ModelListDetailDialog.vue
 ┃ ┃ ┣ 📜OptimizationDialog.vue
 ┃ ┃ ┣ 📜ProfileCTCut.vue
 ┃ ┃ ┗ 📜ProfileCTCutDash.vue
 ┃ ┣ 📂sidt
 ┃ ┣ 📜BlockViewer.vue
 ┃ ┗ 📜Login.vue
 ┣ 📂layout
 ┃ ┣ 📂composables
 ┃ ┃ ┗ 📜layout.js
 ┃ ┣ 📜AppConfig.vue
 ┃ ┣ 📜AppFooter.vue
 ┃ ┣ 📜AppFooterMain.vue
 ┃ ┣ 📜AppLayout.vue
 ┃ ┣ 📜AppLayoutMain.vue
 ┃ ┣ 📜AppMenu.vue
 ┃ ┣ 📜AppMenuItem.vue
 ┃ ┣ 📜AppSidebar.vue
 ┃ ┣ 📜AppTopbar.vue
 ┃ ┗ 📜AppTopbarMain.vue
 ┣ 📂locales
 ┃ ┣ 📂en
 ┃ ┃ ┗ 📜message.json
 ┃ ┗ 📂ko
 ┃ ┃ ┗ 📜message.json
 ┣ 📂pages
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜LoginResult.vue
 ┃ ┃ ┗ 📜LogoutResult.vue
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📜board.js
 ┃ ┃ ┣ 📜Dashboard.vue
 ┃ ┃ ┣ 📜ErrorPage.vue
 ┃ ┃ ┣ 📜ManageAuthPage.vue
 ┃ ┃ ┣ 📜ManageCommonCode.vue
 ┃ ┃ ┣ 📜ManageLotTracking.vue
 ┃ ┃ ┣ 📜ManageMemberPage.vue
 ┃ ┃ ┣ 📜ManageModelApprovalInfo.vue
 ┃ ┃ ┣ 📜ManageNascaPage.vue
 ┃ ┃ ┣ 📜ManageNoticeDetailPage.vue
 ┃ ┃ ┣ 📜ManageNoticePage.vue
 ┃ ┃ ┣ 📜ManageNoticeRegPage.vue
 ┃ ┃ ┣ 📜ManageTempLog.vue
 ┃ ┃ ┣ 📜NoticeDetail.vue
 ┃ ┃ ┣ 📜NoticePage.vue
 ┃ ┃ ┗ 📜StyleGuidePage.vue
 ┃ ┣ 📂sbdt
 ┃ ┃ ┣ 📜LotTrackingPage.vue
 ┃ ┃ ┣ 📜ModelSetupListPage.vue
 ┃ ┃ ┣ 📜ModelSetupPage.vue
 ┃ ┃ ┣ 📜OptimizationPage.vue
 ┃ ┃ ┗ 📜PredictionPage.vue
 ┃ ┗ 📂sidt
 ┃ ┃ ┗ 📜MirroringPage.vue
 ┣ 📂plugins
 ┃ ┣ 📜commonprimevue.js
 ┃ ┣ 📜commonspinner.js
 ┃ ┣ 📜commonutils.js
 ┃ ┗ 📜nsdPlugin.js
 ┣ 📂router
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📜authRouter.js
 ┃ ┣ 📂common
 ┃ ┃ ┗ 📜commonRouter.js
 ┃ ┣ 📂sbdt
 ┃ ┃ ┗ 📜sbdtRouter.js
 ┃ ┣ 📂sidt
 ┃ ┃ ┗ 📜sidtRouter.js
 ┃ ┗ 📜index.js
 ┣ 📂store
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📜authStore.js
 ┃ ┣ 📂common
 ┃ ┃ ┗ 📜commonStore.js
 ┃ ┣ 📂sbdt
 ┃ ┃ ┗ 📜sbdtStore.js
 ┃ ┗ 📂sidt
 ┃ ┃ ┗ 📜sidtStore.js
 ┣ 📂utils
 ┃ ┣ 📂auth
 ┃ ┣ 📂chartData
 ┃ ┃ ┣ 📜folderPath.json
 ┃ ┃ ┣ 📜input_output_data.js
 ┃ ┃ ┣ 📜lot_tracking_data.js
 ┃ ┃ ┣ 📜predictionProfile.json
 ┃ ┃ ┣ 📜sample.json
 ┃ ┃ ┣ 📜sample_csv.csv
 ┃ ┃ ┗ 📜wafer_data.js
 ┃ ┗ 📜util.js
 ┣ 📜App.vue
 ┣ 📜i18n.js
 ┗ 📜main.js
```
