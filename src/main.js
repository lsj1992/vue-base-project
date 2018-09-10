import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import 'vue-photo-preview/dist/skin.css'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import preview from 'vue-photo-preview'

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './errorLog'// error log
import './permission' // permission control

import './mock' // simulation data
import BaiduMap from 'vue-baidu-map'
// import '../node_modules/bmaplib.drawingmanager/'
// import 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js'
// import 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css'
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: '2AzZMFXbazx9PusRVfmC7kGesTyuks8d'
})

// import '@/directive/dialog' // 给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了

/**
 * 表单验证插件，可以用element自带的
 */
// import VeeValidate, { Validator } from 'vee-validate'
// import zh_CN from 'vee-validate/dist/locale/zh_CN'

// Validator.localize('zh_CN', zh_CN)

// const config = {
//   errorBagName: 'errors', // change if property conflicts.
//   fieldsBagName: 'fieldBags',
//   locale: 'zh_CN',
//   delay: 0,
//   events: 'blur|input',
//   messages: null,
//   strict: true
// }
// // 表单验证 可选
// Vue.use(VeeValidate, config)

// 图片查看
const option = {
  fullscreenEl: false, // 关闭全屏按钮
  bgOpacity: 0.6 // 背景色不透明度
}
Vue.use(preview, option)

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
