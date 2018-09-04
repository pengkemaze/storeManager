<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png">
        </el-col>
        <el-col class="middle" :span="19">
          <span>电商后台管理系统</span>
        </el-col>
        <el-col :span="1">
          <a class="logout" href="#" @click.prevent="handleLogout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- unique-opened 设置后只保持一个菜单展开 
             router 设置可以路由跳转
        -->
        <el-menu
        :unique-opened="true"
        :router="true"
        default-active="0"
        style="height: 100%">
          <el-submenu index="1">
        <!-- 父菜单的内容 -->
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </template>
        <!-- 菜单项 -->
            <el-menu-item index="/users">
              <i class="el-icon-view"></i>
              用户列表
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
        <!-- 父菜单的内容 -->
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>权限管理</span>
            </template>
        <!-- 菜单项 -->
            <el-menu-item index="/roles">
              <i class="el-icon-view"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-view"></i>
              权限列表
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
        <!-- 父菜单的内容 -->
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>商品管理</span>
            </template>
        <!-- 菜单项 -->
            <el-menu-item index="3-1">
              <i class="el-icon-view"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-view"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-view"></i>
              商品分类
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
        <!-- 父菜单的内容 -->
            <template slot="title">
              <i class="el-icon-tickets"></i>
              <span>订单管理</span>
            </template>
        <!-- 菜单项 -->
            <el-menu-item index="4-1">
              <i class="el-icon-view"></i>
              订单列表
            </el-menu-item>
            <el-menu-item index="4-2">
              <i class="el-icon-view"></i>
              订单分类
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主内容区域 -->
      <el-main>
        <!-- 路由占位 -->
         <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
// 判断是否登录 需要在还没有加载到home页面之前判断是否登录
// 所以使用钩子函数  beforeCreate
beforeCreate() {
  // 获取sessionStorage中存储的token
  const token = sessionStorage.getItem('token');
  // 判断token是否存在
  if (!token) {
    // 如果token不存在，即没有登录
    this.$message.warning('请先登录');
    this.$router.push('/login');
  } 
},
methods: {
  // 退出
  handleLogout() {
    // 退出的原理就是，清除sessionStorage中的token
    sessionStorage.clear();
    // 提示退出成功
    this.$message.success('退出成功');
    // 跳转到登录页面
    this.$router.push('/login');
  }
}
};
</script>

<style>
.middle {
  color: #fff;
  font-size: 24px;
  text-align: center;
  line-height: 60px;
}
.logout {
  text-decoration: none;
  color: blue;
  line-height: 60px;
  font-size: 14px;
}
.el-container {
    height: 100%;
}
.el-header {
    background-color: #B3C0D1;
    color: #333;
    padding: 0;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    /* text-align: center; */
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }
</style>
