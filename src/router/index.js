import AppLayout from '@/layout/AppLayout.vue';
import { adminRouter } from '@/router/admin/adminRouter';
import { commonRouter } from '@/router/common/commonRouter';
import { ownerRouter } from '@/router/owner/ownerRouter';
import { userRouter } from '@/router/user/userRouter';
import { useAuthStore } from '@/store/auth/authStore';
import { AUTH_EXCLUSIONS_ROUTER_NAME } from '@/apis/auth/authConstants';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: commonRouter
    },
    {
      path: '/',
      component: AppLayout,
      children: adminRouter
    },
    {
      path: '/',
      component: AppLayout,
      children: ownerRouter
    },
    {
      path: '/',
      component: AppLayout,
      children: userRouter
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/common/LoginPage.vue')
    },
    {
      path: '/auth/login/google',
      name: 'loginGoogleResult',
      component: () => import('@/pages/common/LoginGoogleBridgePage.vue')
    },
    {
      path: '/auth/login/line',
      name: 'loginLineResult',
      component: () => import('@/pages/common/LoginLineBridgePage.vue')
    },
    {
      path: '/personal/register',
      name: 'personalRegister',
      component: () => import('@/pages/common/PersonalRegisterPage.vue')
    },
    {
      path: '/business/register',
      name: 'businessRegister',
      component: () => import('@/pages/common/BusinessRegisterPage.vue')
    },
    {
      path: '/user/register/complete',
      name: 'userRegisterComplete',
      component: () => import('@/pages/user/RegisterComplete.vue')
    },
    {
      path: '/business/register/complete',
      name: 'businessRegisterComplete',
      component: () => import('@/pages/business/RegisterComplete.vue')
    },
    {
      path: '/find-id',
      name: 'findId',
      component: () => import('@/pages/common/FindIdPage.vue')
    },
    {
      path: '/find-password',
      name: 'findPassword',
      component: () => import('@/pages/common/FindPasswordPage.vue')
    },
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

  if (AUTH_EXCLUSIONS_ROUTER_NAME.includes(to.name)) {
    // 인증없이 접근가능 페이지 스킵
    return next();
  }

  if (authStore.isLogin()) {
    // 권한별 접근제어
    const { authorization } = to.meta;

    if (!authorization || authorization?.length == 0) {
      // 권한 정의가 없다면
      return next();
    }

    // 접근권한 체크
    if (authStore.hasRoles(to.meta, true)) {
      authStore.historyPage(to.name);
      return next();
    } else {
      messagePop.alert('접근 권한이 없습니다.', 'bad');
      return;
    }
  }
  /* 로그인진행 */
  //   authStore.setReferer(to.name); // 로그인 완료후 이동할 페이지
  authStore.login();
});

export default router;
