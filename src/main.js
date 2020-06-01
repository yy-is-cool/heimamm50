import Vue from 'vue'
import App from './App.vue'

//导入router
import router from './router/index'

import './plugins/elment'
// 导入request(封装了axios)
import './utils/request'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
