export const businessRouter = [
    {
        path: '/business/index',
        name: 'businessIndex',
        component: () => import('@/pages/business/Dashboard.vue')
    },
    {
        path: '/business/CandidatesPage',
        name: 'CandidatesPage',
        component: () => import('@/pages/business/CandidatesPage.vue')
    },
    {
        path: '/business/CompanyInfoPage',
        name: 'CompanyInfoPage',
        component: () => import('@/pages/business/CompanyInfoPage.vue')
    },
    {
        path: '/business/TalentSearchPage',
        name: 'TalentSearchPage',
        component: () => import('@/pages/business/TalentSearchPage.vue')
    },
    {
        path: '/business/InterviewOffers',
        name: 'InterviewOffers',
        component: () => import('@/pages/business/InterviewOffersPage.vue')
    },
    {
        path: '/business/interview-offer/create/:id',
        name: 'CreateInterviewOffer',
        component: () => import('@/pages/business/CreateInterviewOfferPage.vue')
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
