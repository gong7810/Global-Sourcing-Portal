export const businessRouter = [
    {
        path: '/business/index',
        name: 'businessIndex',
        component: () => import('@/pages/business/Dashboard.vue')
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
    {
        path: '/business/job-offer/create/:candidateId',
        name: 'CreateJobOfferPage',
        component: () => import('@/pages/business/CreateJobOfferPage.vue')
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
