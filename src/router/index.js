import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/view/Index.vue'),
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('@/view/WebMap.vue'),
    },
    {
        path: '/mapDetails/:id',
        name: 'detail',
        component: () => import('@/view/MapDetails.vue')
    },
    {
        path: '/Wes',
        name: 'Wes',
        component: () => import('@/view/Wes.vue')
    },
    {
        path: '/projectPlane/:id',
        name: 'projectPlane',
        component: () => import('@/view/projectPlane.vue')
    },
    // {
    //     path: '/opp',
    //     name: 'opp',
    //     component: () => import('@/components/opp.vue')
    // },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    if (!to.name){
        next({ name: 'map' }) // 重定向到特定页面
    } else {
        next() // 继续导航
    }
})

export default router
