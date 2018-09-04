import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import '@/assets/css/index.css';
import MyHttp from '@/plugins/MyHttp';
// 注册MyHttp插件
Vue.use(MyHttp);
// 注册ElementUI插件
Vue.use(ElementUI);
Vue.config.productionTip = false;
// 实例化vue对象
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
