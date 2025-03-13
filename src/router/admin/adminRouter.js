export const adminRouter = [
    // {
    //     path: '/admin/login',
    //     name: 'adminLogin',
    //     component: () => import('@/pages/admin/AdminLoginPage.vue')
    // },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/pages/admin/AdminPage.vue'),
        meta: { authorization: ['ADMIN'] }
    },
    {
        path: '/admin/faq',
        name: 'AdminFaq',
        component: () => import('@/pages/admin/AdminFaqPage.vue'),
        meta: { authorization: ['ADMIN'] }
    },
    {
        path: '/admin/users',
        name: 'AdminUserMng',
        component: () => import('@/pages/admin/AdminUserMngPage.vue'),
        meta: { authorization: ['ADMIN'] }
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
