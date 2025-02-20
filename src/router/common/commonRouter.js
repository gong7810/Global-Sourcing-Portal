export const commonRouter = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('@/pages/Dashboard.vue')
    },
    {
        path: '/uikit/formlayout',
        name: 'formlayout',
        component: () => import('@/pages/uikit/FormLayout.vue')
    },
    {
        path: '/uikit/input',
        name: 'input',
        component: () => import('@/pages/uikit/InputDoc.vue')
    },
    {
        path: '/uikit/button',
        name: 'button',
        component: () => import('@/pages/uikit/ButtonDoc.vue')
    },
    {
        path: '/uikit/table',
        name: 'table',
        component: () => import('@/pages/uikit/TableDoc.vue')
    },
    {
        path: '/uikit/list',
        name: 'list',
        component: () => import('@/pages/uikit/ListDoc.vue')
    },
    {
        path: '/uikit/tree',
        name: 'tree',
        component: () => import('@/pages/uikit/TreeDoc.vue')
    },
    {
        path: '/uikit/panel',
        name: 'panel',
        component: () => import('@/pages/uikit/PanelsDoc.vue')
    },

    {
        path: '/uikit/overlay',
        name: 'overlay',
        component: () => import('@/pages/uikit/OverlayDoc.vue')
    },
    {
        path: '/uikit/media',
        name: 'media',
        component: () => import('@/pages/uikit/MediaDoc.vue')
    },
    {
        path: '/uikit/message',
        name: 'message',
        component: () => import('@/pages/uikit/MessagesDoc.vue')
    },
    {
        path: '/uikit/file',
        name: 'file',
        component: () => import('@/pages/uikit/FileDoc.vue')
    },
    {
        path: '/uikit/menu',
        name: 'menu',
        component: () => import('@/pages/uikit/MenuDoc.vue')
    },
    {
        path: '/uikit/charts',
        name: 'charts',
        component: () => import('@/pages/uikit/ChartDoc.vue')
    },
    {
        path: '/uikit/misc',
        name: 'misc',
        component: () => import('@/pages/uikit/MiscDoc.vue')
    },
    {
        path: '/uikit/timeline',
        name: 'timeline',
        component: () => import('@/pages/uikit/TimelineDoc.vue')
    },
    {
        path: '/pages/empty',
        name: 'empty',
        component: () => import('@/pages/tests/Empty.vue')
    },
    {
        path: '/pages/crud',
        name: 'crud',
        component: () => import('@/pages/tests/Crud.vue')
    },
    {
        path: '/documentation',
        name: 'documentation',
        component: () => import('@/pages/tests/Documentation.vue')
    }
];
