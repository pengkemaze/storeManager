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
          <el-submenu
            v-for="level1 in menus"
            :key="level1.id"
            :index="level1.path">
        <!-- 父菜单的内容 -->
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ level1.authName }}</span>
            </template>
        <!-- 菜单项 -->
            <el-menu-item
              v-for="level2 in level1.children"
              :key="level2.id"
              :index="'/' + level2.path">
              <i class="el-icon-view"></i>
              {{ level2.authName }}
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
  data() {
    return {
      // 获取菜单数据
      menus: []
    };
  },
  created() {
    // 加载菜单数据
    this.loadMenus();
  },
  // 判断是否登录
  // 需要在还没有加载到home页面之前判断是否登录
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
    },
    // 加载菜单数据
    async loadMenus() {
      const response = await this.$http.get('menus');
      const { meta: {msg, status} } = response.data;
      if (status === 200) {
        this.menus = response.data.data;
      };
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
    /* text-align: center; */
  }
</style>
