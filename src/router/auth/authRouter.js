// 레이아웃 X 페이지
export const authRouter = [
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
  }
];
