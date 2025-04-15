export const adminRouter = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/pages/admin/AdminLoginPage.vue')
  },
  {
    path: '/admin/faq',
    name: 'AdminFaq',
    component: () => import('@/pages/admin/AdminFaqPage.vue'),
    meta: { authorization: ['ROLE_ADMIN'] }
  },
  {
    path: '/admin/users',
    name: 'AdminUserMng',
    component: () => import('@/pages/admin/AdminUserMngPage.vue'),
    meta: { authorization: ['ROLE_ADMIN'] }
  },
  {
    path: '/admin/businessApplications',
    name: 'AdminBusinessApplications',
    component: () => import('@/pages/admin/BusinessApplicationsPage.vue'),
    meta: { authorization: ['ROLE_ADMIN'] }
  },
  {
    path: '/admin/interviews',
    name: 'AdminInterviews',
    component: () => import('@/pages/admin/AdminInterviewManagementPage.vue'),
    meta: { authorization: ['ROLE_ADMIN'] }
  },
  {
    path: '/admin/inquiries',
    name: 'AdminInquiries',
    component: () => import('@/pages/admin/AdminInquiriesPage.vue'),
    meta: { authorization: ['ROLE_ADMIN'] }
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
