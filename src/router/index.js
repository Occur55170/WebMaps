import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/view/index.vue'),
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('@/view/WebMap.vue'),
    },
    {
        path: '/mapDetails/:id',
        name: 'detail',
        component: () => import('@/view/mapDetails.vue')
    },
    {
        path: '/Wes',
        name: 'Wes',
        component: () => import('@/view/Wes.vue')
    },
    // {
    //     path: '/Map_Demo/opp',
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

