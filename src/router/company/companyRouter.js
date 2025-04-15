export const companyRouter = [
  {
    path: '/company/index',
    name: 'CompanyIndex',
    component: () => import('@/pages/company/Dashboard.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/company/CompanyInfoPage',
    name: 'CompanyInfoPage',
    component: () => import('@/pages/company/CompanyInfoPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/company/TalentSearchPage',
    name: 'TalentSearchPage',
    component: () => import('@/pages/company/TalentSearchPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/company/InterviewOffers',
    name: 'InterviewOffers',
    component: () => import('@/pages/company/InterviewOffersPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/company/InterviewOffer/create/:id',
    name: 'CreateInterviewOffer',
    component: () => import('@/pages/company/CreateInterviewOfferPage.vue'),
    meta: { authorization: ['ROLE_MANAGER'] }
  },
  {
    path: '/company/InterviewResults',
    name: 'InterviewResults',
    component: () => import('@/pages/company/InterviewResultsPage.vue'),
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
