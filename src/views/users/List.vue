<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="row">
      <el-col :span="24">
        <el-input style="width: 300px" placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
       </el-input>
       <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <!-- 序号列 -->
      <el-table-column
      type="index"
      width="50">
      </el-table-column>
       <!-- prop 绑定对象的属性，当前列的数据-->
      <el-table-column
        prop="username"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        width="150"
        prop="create_time"
        label="时间">
        <!-- 要自定义内容，必须写template，且有属性slot-scope="scope" -->
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="用户状态">
        <!-- 要是用模板，必须有slot-scope="scope"属性才能呈现内容 -->
        <template slot-scope="scope">
          <!-- scope.row 显示当前用户的数据
               scope.row.mg_state当前用户的状态
               开关要绑定当前用户的状态
           -->
          <el-switch
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        label="操作">
        <template slot-scope="scope">
          <!-- 通过scope.$index可以获取当前行的索引
               通过scope.row获取当前行的数据
           --> 
          <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
          <el-button size="mini" type="success" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    // 组件创建完毕，加载数据
    this.loadData();
  },
  methods: {
    // 异步请求用户列表数据
    // async  await  ES7语法 用于发送异步请求 少一层嵌套  能够使代码简洁
    async loadData() {
      // 设置token
      const token = sessionStorage.getItem('token');
      // 设置请求头
      this.$http.defaults.headers.common['Authorization'] = token;

      const response = await this.$http.get('users?pagenum=1&pagesize=10');
      const {msg, status} = response.data.meta;
      // 判断获取数据是否ok
          if (status === 200) {
            this.tableData = response.data.data.users;
          } else {
            this.$message.error(msg);
          }

      // 异步请求原始写法
      // this.$http
      //   .get('users?pagenum=1&pagesize=10')
      //   .then((response) => {
      //     // 判断response.data.meta.status状态是否为200
      //     const {msg, status} = response.data.meta;
      //     if (status === 200) {
      //       this.tableData = response.data.data.users;
      //     } else {
      //       this.$message.error(msg);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }
  }
};
</script>

<style>
.card {
    height: 100%;
}
.row {
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>
