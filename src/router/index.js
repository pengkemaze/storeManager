import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
// 为什么可以省略掉 .vue
// 加载一个模块的时候，如果省略后缀名，默认情况下 先加载.js, 如果找不到 再加载 .json
// 默认情况可以修改  在webpack.base.conf的35行设置
// 改造路由懒加载
const Login = () => import('@/views/Login');
const Home = () => import('@/views/Home');
const Users = () => import('@/views/users/List');
const Rights = () => import('@/views/rights/Rights');
const Roles = () => import('@/views/rights/Roles');
const Categories = () => import('@/views/goods/Categories');
const Goods = () => import('@/views/goods/Goods');
const GoodsAdd = () => import('@/views/goods/GoodsAdd');
const Params = () => import('@/views/goods/Params');
const Order = () => import('@/views/order/Order');
const Reports = () => import('@/views/reports/Reports');

// 注册Router插件
Vue.use(Router);
const router = new Router({
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
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'categories',
          path: '/categories',
          component: Categories
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goods
        },
        {
          name: 'goodsadd',
          path: '/goods/add',
          component: GoodsAdd
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'order',
          path: '/orders',
          component: Order
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
        }
      ]
    }
  ]
});

// 设置路由的前置守卫(路由跳转之前)
// from表示从哪来 to表示到哪去 next表示让它去
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next();
  } else {
    // 判断是否有token
    const token = sessionStorage.getItem('token');
    if (token) {
      next();
    } else {
      // 没有token，跳转到登录
      // this不是vue的实例对象，所以不能这样写
      // this.router.push('/login');
      router.push('/login');
      // 提示
      // this不是vue实例 不能这样提示
      // this.$message.warning('请先登录');
      // 只能单独引用message对象
      Message.warning('请先登录');
    }
  }
});

export default router;
