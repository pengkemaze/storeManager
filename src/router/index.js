import Vue from 'vue';
import Router from 'vue-router';
// 为什么可以省略掉 .vue
// 加载一个模块的时候，如果省略后缀名，默认情况下 先加载.js, 如果找不到 再加载 .json
// 默认情况可以修改  在webpack.base.conf的35行设置
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/users/List';
// 注册Router插件
Vue.use(Router);
export default new Router({
  routes: [
    {name: 'login', path: '/login', component: Login},
    {
      name: 'home',
      path: '/',
      component: Home,
      // 嵌套子路由
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        }
      ]
    },
  ]
});
