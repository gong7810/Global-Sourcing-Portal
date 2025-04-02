export const businessRouter = [
  {
    path: '/business/index',
    name: 'businessIndex',
    component: () => import('@/pages/business/Dashboard.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/business/CompanyInfoPage',
    name: 'CompanyInfoPage',
    component: () => import('@/pages/business/CompanyInfoPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/business/TalentSearchPage',
    name: 'TalentSearchPage',
    component: () => import('@/pages/business/TalentSearchPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/business/InterviewOffers',
    name: 'InterviewOffers',
    component: () => import('@/pages/business/InterviewOffersPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/business/interview-offer/create/:id',
    name: 'CreateInterviewOffer',
    component: () => import('@/pages/business/CreateInterviewOfferPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/business/InterviewResults',
    name: 'InterviewResults',
    component: () => import('@/pages/business/InterviewResultsPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  }
  // {
  //     path: '/manageMember',
  //     name: 'manageMember',
  //     component: () => import('@/pages/common/ManageMemberPage.vue'),
  //     meta: { authorization: ['BIZ_ADMIN'] }
  // },
  // {
  //     path: '/manageAuth',
  //     name: 'manageAuth',
  //     component: () => import('@/pages/common/ManageAuthPage.vue'),
  //     meta: { authorization: ['BIZ_ADMIN'] }
  // },
  // {
  //     path: '/notice',
  //     name: 'notice',
  //     component: () => import('@/pages/common/NoticePage.vue')
  // },
  // {
  //     path: '/style',
  //     name: 'style',
  //     component: () => import('@/pages/common/StyleGuidePage.vue')
  // }
];
