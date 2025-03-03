export const userRouter = [
  // {
  //     path: '/user/index',
  //     name: 'userIndex',
  //     component: () => import('@/pages/user/Dashboard.vue')
  // },
  {
    path: '/business/index',
    name: 'businessIndex',
    component: () => import('@/pages/business/Dashboard.vue')
  },
  {
    path: '/user/resume',
    name: 'Resume',
    component: () => import('@/pages/user/ResumePage.vue')
  },
  {
    path: '/user/userPage',
    name: 'UserPage',
    component: () => import('@/pages/user/UserPage.vue')
  },
  {
    path: '/user/applications',
    name: 'Applications',
    component: () => import('@/pages/user/ApplicationsPage.vue')
  },
  {
    path: '/user/job-offers',
    name: 'JobOffers',
    component: () => import('@/pages/user/JobOffersPage.vue')
  },
  {
    path: '/business/businessPage',
    name: 'BusinessPage',
    component: () => import('@/pages/business/businessPage.vue')
  },
  {
    path: '/business/postJobPage',
    name: 'PostJobPage',
    component: () => import('@/pages/business/PostJobPage.vue')
  },
  {
    path: '/business/JobPostsPage',
    name: 'JobPostsPage',
    component: () => import('@/pages/business/JobPostsPage.vue')
  },
  {
    path: '/business/CandidatesPage',
    name: 'CandidatesPage',
    component: () => import('@/pages/business/CandidatesPage.vue')
  },
  {
    path: '/business/TalentPoolPage',
    name: 'TalentPoolPage',
    component: () => import('@/pages/business/TalentPoolPage.vue')
  },
  {
    path: '/business/CompanyInfoPage',
    name: 'CompanyInfoPage',
    component: () => import('@/pages/business/CompanyInfoPage.vue')
  },
  {
    path: '/business/post-job/:id',
    name: 'EditJobPage',
    component: () => import('@/pages/business/PostJobPage.vue')
  },
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
