<template>
  <el-card class="card">
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <!-- 按钮 -->
    <el-button style="margin-top: 10px; margin-bottom: 10px">添加角色</el-button>
    <!-- 表格 -->
    <el-table
      border
      stripe
      :data="tableData"
      style="width: 100%">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          hello
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
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
      this.loadData();
  },
  methods: {
    //   加载表格数据
    async loadData() {
      const response = await this.$http.get('roles');

      const { meta: { msg, status } } = response.data;
      if (status === 200) {
          this.tableData = response.data.data;
      } else {
          this.$message.error(msg);
      };
    }
  }
};
</script>

<style>
.card {
    height: 100%;
    overflow: auto;
}
</style>
