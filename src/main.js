import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/font/iconfont.css'
import {Message} from 'element-ui'
import {MessageBox} from 'element-ui'
import ZkTable from 'vue-table-with-tree-grid'
Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
Vue.component('tree-table',ZkTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
