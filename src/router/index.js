import { createRouter, createWebHistory } from 'vue-router'
console.log(VITE_URL)
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
        component: () => import('@/view/MapDetails.vue')
    },
    {
        path: '/Wes',
        name: 'Wes',
        component: () => import('@/view/Wes.vue')
    },
    {
        path: `${VITE_URL}/projectPlane/:id`,
        name: 'projectPlane',
        component: () => import('@/view/projectPlane.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    if (!to.name){
        next({ name: 'map' })
    } else {
        next()
    }
})

export default router
