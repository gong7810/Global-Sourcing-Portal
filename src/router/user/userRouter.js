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
