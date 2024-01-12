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
            component: () => import("../components/home/Home.vue"),
            children: [
                {
                    path: 'users',
                    name: 'users',
                    component: () => import("../components/home/Users.vue")
                },
                {
                    path: 'ad',
                    name: 'ad',
                    component: () => import("../components/home/AD.vue")
                },
                {
                    path: 'article',
                    name: 'article',
                    component: () => import("../components/home/Article.vue")
                },
                {
                    path: 'expert',
                    name: 'expert',
                    component: () => import("../components/home/Expert.vue")
                },
                {
                    path: 'hospital',
                    name: 'hospital',
                    component: () => import("../components/home/Hospital.vue")
                },
                {
                    path: 'medicineList',
                    name: 'medicineList',
                    component: () => import("../components/home/MedicineList.vue")
                },
                {
                    path: 'newsClassify',
                    name: 'newsClassify',
                    component: () => import("../components/home/NewsClassify.vue")
                },
                {
                    path: 'recipe',
                    name: 'recipe',
                    component: () => import("../components/home/Recipe.vue")
                },
                {
                    path: 'sickness',
                    name: 'sickness',
                    component: () => import("../components/home/Sickness.vue")
                },
                {
                    path: 'division',
                    name: 'division',
                    component: () => import("../components/home/Division.vue")
                },


            ]
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