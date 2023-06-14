import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/Map_Demo/',
        name: 'index',
        component: () => import('@/view/index.vue'),
    },
    {
        path: '/Map_Demo/map',
        name: 'map',
        component: () => import('@/view/WebMap.vue'),
    },
    {
        path: '/Map_Demo/mapDetails/:id',
        name: 'detail',
        component: () => import('@/view/mapDetails.vue')
    },
    {
        path: '/Map_Demo/Wes',
        name: 'Wes',
        component: () => import('@/view/Wes.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
