import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: `${VITE_URL}`,
        name: 'index',
        component: () => import('@/view/Index.vue'),
    },
    {
        path: `${VITE_URL}/map`,
        name: 'map',
        component: () => import('@/view/WebMap.vue'),
    },
    {
        path: `${VITE_URL}/mapDetails/:id`,
        name: 'detail',
        component: () => import('@/view/MapDetails.vue'),
    },
    {
        path: '/Opp',
        name: 'Opp',
        component: () => import('@/view/Opp.vue'),
    },
    {
        path: `${VITE_URL}/Plane/:id`,
        name: 'plane',
        component: () => import('@/view/Plane.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
