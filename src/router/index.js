import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { authRouter } from '@/router/auth/authRouter';
import { adminRouter } from '@/router/admin/adminRouter';
import { commonRouter } from '@/router/common/commonRouter';
import { companyRouter } from '@/router/company/companyRouter';
import { userRouter } from '@/router/user/userRouter';
import { policyRouter } from '@/router/policy/policyRouter';
import { useAuthStore } from '@/store/auth/authStore';
import { storeToRefs } from 'pinia';
import { AUTH_EXCLUSIONS_ROUTER_NAME } from '@/apis/auth/authConstants';
import { useMessagePop } from '@/plugins/commonutils';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      children: authRouter
    },
    {
      path: '/',
      component: AppLayout,
      children: [...policyRouter, ...commonRouter, ...companyRouter, ...userRouter]
    },
    {
      path: '/',
      children: adminRouter
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const { userInfo } = storeToRefs(authStore);
  const messagePop = useMessagePop();

  // 인증없이 접근가능 페이지 스킵
  if (AUTH_EXCLUSIONS_ROUTER_NAME.includes(to.name)) {
    // 로그인 상태에서 로그인 페이지 접근 불가
    if (authStore.isLogin() && to.name === 'login') {
      return next({ path: '/' });
    }

    // 관리자/기업회원 로그인시 해당 페이지로 이동
    if (userInfo.value?.roleCd === 'ROLE_ADMIN' && to.name === 'dashboard') {
      // 관리자
      return next({ path: '/admin/users' });
    } else if (userInfo.value?.roleCd === 'ROLE_MANAGER' && to.name === 'dashboard') {
      messagePop.alert('기업회원 페이지로 이동합니다.', 'info');

      // 기업회원
      return next({ path: '/company/index' });
    } else {
      return next();
    }
  }

  if (authStore.isLogin()) {
    // 권한별 접근제어
    const { authorization } = to.meta;

    if (!authorization || authorization?.length == 0) {
      // 권한 정의가 없다면
      return next();
    }

    // 접근권한 체크
    if (authStore.hasRoles(to.meta)) {
      // authStore.historyPage(to.name);
      return next();
    } else {
      messagePop.alert('접근 권한이 없습니다.', 'bad');
      return next({ path: from.path || 'dashboard' });
    }
  }
  /* 로그인진행 */
  //   authStore.setReferer(to.name); // 로그인 완료후 이동할 페이지
  authStore.login();
});

export default router;
