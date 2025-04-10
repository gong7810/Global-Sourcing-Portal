// 레이아웃 X 페이지
export const authRouter = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/common/LoginPage.vue')
  },
  {
    path: '/register-select',
    name: 'RegisterSelect',
    component: () => import('@/pages/common/RegisterSelect.vue')
  },
  {
    path: '/common/personalRegister',
    name: 'personalRegister',
    component: () => import('@/pages/common/PersonalRegisterPage.vue')
  },
  {
    path: '/common/companyRegister',
    name: 'companyRegister',
    component: () => import('@/pages/common/CompanyRegisterPage.vue')
  },
  {
    path: '/user/register/complete',
    name: 'userRegisterComplete',
    component: () => import('@/pages/user/RegisterComplete.vue')
  },
  {
    path: '/common/register/complete',
    name: 'companyRegisterComplete',
    component: () => import('@/pages/common/RegisterComplete.vue')
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
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: () => import('@/pages/common/ResetPasswordPage.vue')
  }
];
