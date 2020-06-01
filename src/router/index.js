import Vue from 'vue'
import VueRouter from '../../node_modules/vue-router'

Vue.use(VueRouter);
import { getToken } from '../utils/token'

//导入页面
import Login from '../views/login/index.vue';
import Layout from '../views/layout/index.vue';
import Chart from '../views/layout/chart/index.vue'
import Enterprise from '../views/layout/enterprise/index.vue'
import Question from '../views/layout/question/index.vue'
import Subject from '../views/layout/subject/index.vue'
import User from '../views/layout/user/index.vue'

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: "/layout",
            component: Layout, children: [
                { path: 'chart', component: Chart },
                { path: 'enterprise', component: Enterprise },
                { path: 'question', component: Question },
                { path: 'subject', component: Subject },
                { path: 'user', component: User }
            ]
        },

    ]
});
//全局导航守卫
/* 
    在Vue中，只要放生了路由跳转，他都会来到这个方法中
    相当于拦截到了所有的路由跳转，然后我们在根据实际情况处理
*/
router.beforeEach((to, from, next) => {
    if (to.fullPath == '/login') {
        next();
    } else {
        //你要去非登录页面，这个时候，就要判断你是否登录了
        const token = getToken();
        if (token) {
            //代表登录了
            next(); // 去到你想去的页面
        } else {
            next('/login')
        }
    }
})

export default router;