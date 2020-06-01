// import Vue from 'Vue'
// import axios from 'aixos'

import Vue from "vue";
import axios from "axios";

//设置基础路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL
// 允许携带cooke
axios.defaults.withCredentials = true

Vue.prototype.$axios = axios