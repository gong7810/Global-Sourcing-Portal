export const commonRouter = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard.vue')
  },
  {
    path: '/faq',
    name: 'FaqPage',
    component: () => import('@/pages/common/FaqPage.vue')
  },
  {
    path: '/inquiry',
    name: 'InquiryPage',
    component: () => import('@/pages/common/InquiryPage.vue')
  }
];
