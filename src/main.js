/*
 * @Author: jinx
 * @Date: 2021-11-09 14:53:54
 * @LastEditors: jinx
 * @Descripttion: 文件描述
 */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import '@/assets/styles/element-variables.scss'
// import xburnertable from 'xburner-table'

Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.use(xburnertable)

new Vue({
  render: h => h(App),
}).$mount('#app')
