// router/index.js 
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store";


// 合并路由
const routes = [
    {
        path: '/',
        component: () => import("@/views/homeView/index.vue"),
        meta: {
            requireAuth: true,
            title: "首页"
        }
    },
    {
        path: '/courseList',
        component: () => import('@/views/courseListView/index.vue'),
        meta: {
            requireAuth: true,
            title: "课程列表"
        }
    },
    {
        path: '/myCourse',
        component: () => import('@/views/myCourseView/index.vue'),
        meta: {
            requireAuth: true,
            title: "我的课程"
        }
    },
    {
        path: '/score',
        component: () => import('@/views/scoreView/index.vue'),
        meta: {
            requireAuth: true,
            title: "我的成绩"
        }
    },
    {
        path: '/myInfo',
        component: () => import('@/views/myInfoView/index.vue'),
        meta: {
            requireAuth: true,
            title: "个人信息"
        }
    },
    {
        path: '/notice',
        component: () => import('@/views/noticeView/index.vue'),
        meta: {
            requireAuth: true,
            title: "我的通知"
        }
    },
    {
        path: '/auth',
        redirect: '/login',
        component: () => import('@/views/authView/index.vue'),
        children: [
            {
                path: '/login',
                name: 'login',
                component: () => import('@/views/authView/components/login.vue'),
                meta: {
                    requireAuth: false,
                    title: "登录"
                }
            },
            {
                path: '/register',
                name: 'register',
                component: () => import('@/views/authView/components/register.vue'),
                meta: {
                    requireAuth: false,
                    title: "注册"
                }
            }
        ]
    },
    // {
    //     path: '/:pathMatch(.*)',
    //     redirect: '/404',
    // }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return {
            el: '#app',
            top: 0,
            behavior: 'smooth'
        }
    }
})

// 路由前置守卫 主要用来进行鉴权
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    if (to.meta.requireAuth  && !userStore.isLoggedIn) {
        router.push('/login')
    }
    next()
})

// 路由后置守卫 
router.afterEach((to, from) => {

    window.document.title = to.meta.title + " | " + import.meta.env.VITE_SITE_TITLE;


})

export default router