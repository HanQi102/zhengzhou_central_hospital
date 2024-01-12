import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            redirect: "/home"
        },
        {
            path: "/home",
            name: "home",
            component: () => import("../components/home/Home.vue")
        },

        {
            path: "/login",
            name: "login",
            component: () => import("../components/login/Login.vue")
        },

    ]
})

router.beforeEach((to, from, next) => {
    if (to.path == "/login") {
        next()
    } else {
        const token = sessionStorage.getItem("token")
        if (token) {
            next()
        } else {
            next("/login")
        }
    }
})

export default router