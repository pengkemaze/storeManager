import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login.vue';
// 注册Router插件
Vue.use(Router);
export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
});
