<template>
  <el-card>
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
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
       <!-- 点击按妞，直接跳转 -->
       <el-button @click="$router.push('/goods/add')" type="success" plain>添加商品</el-button>
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
        width="80">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="100">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      // 分页数据
      pagenum: 1,
      pagesize: 10,
      total: 0
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 发送请求，获取商品列表
    async loadData() {
      const response = await this.$http.get(`/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      const {msg, status} = response.data.meta;
      if (status === 200) {
        console.log(response);
        this.tableData = response.data.data.goods;
        // 设置分页总条数
        this.total = response.data.data.total;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页方法
    // 每页显示多少条
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
    },
    // 当前页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    }
  }
};
</script>

<style>
.row {
    margin-top: 10px;
    margin-bottom: 10px;
}
.el-table .cell {
  overflow: hidden;
  /* 设置溢出内容省略号 */
  text-overflow: ellipsis;
  /* 设置不换行 */
  white-space: nowrap;
}
</style>
