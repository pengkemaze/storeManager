<template>
    <el-card class="card">
     <!-- 面包屑 -->
      <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
      <!-- 表格 -->
      <el-table
      border
      stripe
      :data="tableData"
      style="width: 100%; margin-top: 10px">
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="300">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="80">
      </el-table-column>
      <el-table-column
        prop="order_pay"
        label="是否付款"
        width="100">
        <template slot-scope="scope">
          <el-tag type="danger">
            {{ scope.row.order_pay === 0 ? '未付款' : '付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="80">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间"
        width="200">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleOpenDialog" size="mini" type="primary" icon="el-icon-edit" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="省市区/县" >
          <!-- 级联下拉框 -->
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    </el-card>
</template>

<script>
// 导入省市数据
import cityData from './city_data2017_element.js';
export default {
  data() {
      return {
        tableData: [],
        // 当前页
        pagenum: 1,
        pagesize: 10,
        total: 0,
        dialogFormVisible: false,
        form: {

        },
        options: [],
        selectedOptions: []
      };
  },
  created() {
      this.loadData();
  },
  methods: {
    //   加载数据
      async loadData() {
        const response = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
        const { msg, status } = response.data.meta;
        if(status  === 200) {
            // 成功
            console.log(response);
            this.tableData = response.data.data.goods;
            this.total = response.data.data.total;
        } else {
            // 失败
            this.$message.error(msg);
        }
        
      },
      // 分页方法
    // 每页显示多少条
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页${val}条`);
    },
    // 当前页
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页：${val}`);
    },
    // 打开对话框
    handleOpenDialog() {
        this.dialogFormVisible = true;
        // 加载省市数据
        this.options = cityData;
    }
  }
};
</script>

<style>

</style>
