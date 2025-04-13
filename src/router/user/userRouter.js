export const userRouter = [
  // {
  //     path: '/user/index',
  //     name: 'userIndex',
  //     component: () => import('@/pages/user/Dashboard.vue')
  // },
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
  // {
  //   path: '/user/supportDetail',
  //   name: 'SupportDetail',
  //   component: () => import('@/pages/user/SupportDetailPage.vue')
  // },
  {
    path: '/user/jobOffers',
    name: 'JobOffers',
    component: () => import('@/pages/user/JobOffersPage.vue')
  },
  {
    path: '/user/jobSeekerInterviews',
    name: 'JobSeekerInterviews',
    component: () => import('@/pages/user/JobSeekerInterviewsPage.vue')
  }
  // {
  //   path: '/user/companyList',
  //   name: 'CompanyList',
  //   component: () => import('@/pages/user/CompanyList.vue')
  // }
  // }
];
