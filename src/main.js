import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import '@/assets/css/index.css';
import MyHttp from '@/plugins/MyHttp';
import moment from 'moment';
import MyBreadcrumb from '@/components/MyBreadcrumb';
// 过滤器，格式化日期字符串
// 过滤器在插值表达式和v-bind中才能使用
Vue.filter('fmtDate', (value, fmtStr) => {
  return moment(value).format(fmtStr);
});
// 全局注册面包屑组件
Vue.component(MyBreadcrumb.name, MyBreadcrumb);

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
