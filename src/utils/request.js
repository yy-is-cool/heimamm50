// import Vue from 'Vue'
// import axios from 'aixos'

import Vue from "vue";
import axios from "axios";
import { getToken, removeToken } from './token'
import router from '../router/index'

//设置基础路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL
// 允许携带cooke
axios.defaults.withCredentials = true

//请求拦截器
axios.interceptors.request.use(
    function (config) {
        const token = getToken();
        if (token) {
            config.headers.token = token
        }

        return config
    },
    function (error) {
        return Promise.reject(error);
    }
);

//响应拦截器
axios.interceptors.response.use(
    function (response) {
        if (response.data.code == 206) {
            // 移除token
            removeToken()
            // 跳转到登录页面
            router.push('/login')
            return
        }
        return response
    },
    function(error){
        return Promise.reject(error)
    }
)

Vue.prototype.$axios = axios