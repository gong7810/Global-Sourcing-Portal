import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { authRouter } from '@/router/auth/authRouter';
import { adminRouter } from '@/router/admin/adminRouter';
import { commonRouter } from '@/router/common/commonRouter';
import { userRouter } from '@/router/user/userRouter';
import { businessRouter } from '@/router/business/businessRouter';
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
      children: commonRouter
    },
    {
      path: '/',
      // component: AppLayout,
      children: adminRouter
    },
    {
      path: '/',
      component: AppLayout,
      children: businessRouter
    },
    {
      path: '/',
      component: AppLayout,
      children: userRouter
    }
    // {
    //   path: '/landing',
    //   name: 'landing',
    //   component: () => import('@/pages/tests/Landing.vue')
    // },
    // {
    //   path: '/pages/notfound',
    //   name: 'notfound',
    //   component: () => import('@/pages/tests/NotFound.vue')
    // }
    // {
    //   path: '/auth/access',
    //   name: 'accessDenied',
    //   component: () => import('@/pages/tests/auth/Access.vue')
    // },
    // {
    //   path: '/auth/error',
    //   name: 'error',
    //   component: () => import('@/pages/tests/auth/Error.vue')
    // }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const { userInfo } = storeToRefs(authStore);
  const messagePop = useMessagePop();

  if (AUTH_EXCLUSIONS_ROUTER_NAME.includes(to.name)) {
    // 인증없이 접근가능 페이지 스킵
    if (userInfo.value?.roleCd === 'ROLE_ADMIN' && to.name === 'dashboard') {
      // 관리자
      return next({ path: '/admin/users' });
    } else if (userInfo.value?.isCompany && userInfo.value?.roleCd === 'ROLE_MANAGER' && to.name === 'dashboard') {
      // 기업회원
      return next({ path: '/business/index' });
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
