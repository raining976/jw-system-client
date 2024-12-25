// router/modules/base.js
/**
 * @Description: 路由项说明
 * @Author: raining
 *
 *  {
 *     path: "/components",          // 路由地址
 *     name: "components",           // 路由名称
 *     meta: {
 *         title: "组件示例",          // 路由标题
 *         icon: "Basketball",       // 路由图标
 *         requiresAuth: true,       // 是否需要登录
 *         isLink: false,            // 是否外链
 *         hidden: false,            // 是否隐藏
 *     },
 *     children: []                  // 子路由
 * }
 */
export default [
    {
        path: '/',
        redirect: "/homepage",
        component: () => import("@/views/home/index.vue"),
        children: [
            


        ]

    },

]