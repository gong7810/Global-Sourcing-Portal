export const policyRouter = [
  {
    path: '/policy/privacy',
    name: 'PrivacyPolicy',
    component: () => import('@/pages/policy/PrivacyPolicyPage.vue')
  },
  {
    path: '/policy/terms',
    name: 'TermsOfService',
    component: () => import('@/pages/policy/TermsOfServicePage.vue')
  }
]; 