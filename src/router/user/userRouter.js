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
    path: '/user/job-offers',
    name: 'JobOffers',
    component: () => import('@/pages/user/JobOffersPage.vue')
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
