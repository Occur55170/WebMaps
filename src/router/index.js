import { createRouter, createWebHistory } from 'vue-router'
// const routes = [
//     {path: "/", name: "Home", component: () => import("@/views/Home.vue")},
//     {path: "/web_build", name: "WebBuild", component: () => import("@/views/auth/WebBuild.vue")}
//   ]
const routes = [
    {
        path: "/Map_Demo/",
        name: "Home",
        component: () => import("@/view/WebMap.vue"),
    },
    {
        path: "/Map_Demo/:action",
        name: "detail",
        component: () => import("@/view/mapDetails.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router