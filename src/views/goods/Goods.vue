<template>
  <el-card>
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
     <!-- 搜索 -->
    <el-row class="row">
      <el-col :span="24">
        <!-- 搜索文本框 -->
        <el-input
          clearable
          style="width: 300px"
          placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
       </el-input>
       <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      border
      stripe
      :height="520"
      :data="tableData"
      style="width: 100%">
      <!-- el-table-tree-column
        treeKey：设置每一项的唯一标识
        parentKey：绑定到父id的属性
        levelKey：绑定到不同级别的属性
        indentSize： 控制缩进
       -->
       <el-table-column
        type="index"
        width="180">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品价格(元)"
        width="400">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品重量"
        width="400">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
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
        // 发送请求，获取商品列表
        async loadData() {
            const response = await this.$http.get(`/goods?pagenum=1&pagesize=10`);

        }
    }
};
</script>

<style scoped>
.row {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
