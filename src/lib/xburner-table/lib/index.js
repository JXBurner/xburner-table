/*
 * @Author: jinx
 * @Date: 2021-11-10 10:32:32
 * @LastEditors: jinx
 * @Descripttion: 文件描述
 */
// index.vue组件入口
import ldTable from './index.vue'

// 定义插件
    // 该插件有一个install方法
    // 方法的第一个参数是传入的Vue，第二个参数可以插件的自定义参数
    ldTable.install = function(Vue) {
        // 将其注册为vue的组件，'xburnertable'是组件名，tableComponent是我们开发的组件
        Vue.component('ld-table', ldTable)
    }

// 最后将插件导出，并在main.js中通过Vue.use()即可使用插件
export default ldTable