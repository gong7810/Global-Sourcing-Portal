import AppLayout from '@/layout/AppLayout.vue';
import { adminRouter } from '@/router/admin/adminRouter';
import { commonRouter } from '@/router/common/commonRouter';
import { ownerRouter } from '@/router/owner/ownerRouter';
import { userRouter } from '@/router/user/userRouter';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: commonRouter
        },
        {
            path: '/',
            component: AppLayout,
            children: adminRouter
        },
        {
            path: '/',
            component: AppLayout,
            children: ownerRouter
        },
        {
            path: '/',
            component: AppLayout,
            children: userRouter
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/pages/tests/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/pages/tests/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/pages/tests/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/pages/tests/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/pages/tests/auth/Error.vue')
        }
    ]
});

export default router;
