<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <!-- 添加按钮 -->
    <el-button class="btn" @click="handleOpenAddDialog" type="success" plain>添加分类</el-button>
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
      <el-table-tree-column
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        :indentSize="20"
        prop="cat_name"
        label="分类名称"
        width="300"
        ></el-table-tree-column>
      <el-table-column
        prop="cat_level"
        label="级别"
        width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效"
        width="200">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleOpenEditDialog(scope.row)" size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click="handleDelete(scope.row)" size="mini" type="danger" icon="el-icon-delete" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
   <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加的弹出对话框 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialogFormVisible">
      <el-form
        label-width="80px"
        :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 多级下拉框 
            expand-trigger：触发的方式(hover)
            options：提供绑定的数据，是数组
            v-model：绑定的是多级分类id，是一个数组
            change-on-select：选择任意一级菜单的选项
            clearable：关闭的小叉
            props: 对象，设置多级下拉框显示的属性，value对象的属性，子节点对应的属性
          -->
          <el-cascader
            clearable
            change-on-select
            expand-trigger="hover"
            :options="options"
            :props="{label: 'cat_name', value: 'cat_id', children: 'children'}"
            v-model="selectedOptions">
          </el-cascader>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog
      title="修改商品分类"
      :visible.sync="editDialogFormVisible">
      <el-form
        label-width="80px"
        :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
import ElTreeGrid from 'element-tree-grid';

export default {
  // 注册局部组件
  components: {
    'el-table-tree-column': ElTreeGrid
  },
  data() {
    return {
      tableData: [],
      searchValue: '',
      // 分页数据
      // 页码
      pagenum: 1,
      // 每页条数
      pagesize: 9,
      // 总条数
      total: 0,
      // 添加分类对话框的显示隐藏
      addDialogFormVisible: false,
      // 控制编辑对话框的显示和隐藏
      editDialogFormVisible: false,
      form: {
        cat_name: ''
      },
      // 绑定的数据
      options: [],
      // 绑定的多级下拉框id
      selectedOptions: [],
      // 点击编辑按钮的时候，记录当前的分类对象
      currentCat: {}
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载商品分类数据
    async loadData() {
      const response = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}$pagesize=${this.pagesize}`);
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // console.log(response);
        this.tableData = response.data.data;
        // 获取响应之后，设置total的值数组data的长度
        this.total = response.data.data.length;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页： ${val} `);
    },
    // 点击添加按钮，弹出添加对话框，加载多级下拉框数据
    async handleOpenAddDialog() {
      this.addDialogFormVisible = true;
      const response = await this.$http.get('categories?type=2');
      this.options = response.data.data;
    },
    // 点击确定按钮，添加分类
    async handleAdd() {
      // 请求：post categories
      // 参数
      // cat_pid 添加的分类的父id
      // cat_name 分类的名称
      // cat_level 分类的层级0,1,2
      this.form.cat_level = this.selectedOptions.length;
      this.form.cat_pid = 0;
      if (this.selectedOptions.length === 0) {
        // 要添加一级分类
        this.form.cat_pid = 0;
      } else if (this.selectedOptions.length === 1) {
        // 要添加二级分类
        this.form.cat_pid = this.selectedOptions[0];
      } else if (this.selectedOptions.length === 2) {
        // 要添加三级分类
        this.form.cat_pid = this.selectedOptions[1];
      };
      // 发送异步请求，添加商品分类
      const response = await this.$http.post('categories', this.form);

      const {msg, status} = response.data.meta;
      if(status === 201) {
        // 添加成功提示
        this.$message.success(msg);
        // 关闭弹出框
        this.addDialogFormVisible = false;
        // 刷新表格
        this.loadData();
      } else {
        this.$message.error(msg);
      }

    },
    // 点击删除按钮，删除分类
    async handleDelete(cat) {
      // cat是要删除的分类对象
      // 删除提示
      try {
        await this.$confirm('确认要删除当前商品分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      // 在此处，就是promise对象的then的回调函数中执行的代码
      // 点击完确定按钮要执行的代码
      const response = await this.$http.delete(`categories/${cat.cat_id}`);
      const {msg, status} = response.data.meta;
      if (status === 200) {
        // 删除成功
        this.$message.success(msg);
        this.loadData();
      } else {
        this.$message.error(msg);
      }
      } catch(err) {
        // 点击了取消按钮要执行的代码
      }
      
    },
    // 点击编辑按钮，弹出对话框，给文本框赋值
    handleOpenEditDialog(cat) {
      // cat是当前编辑的分类对象
      this.editDialogFormVisible = true;
      // 输入框显示当前要编辑的分类的名字
      this.form.cat_name = cat.cat_name;
      // 记录当前的分类对象
      this.currentCat = cat;
    },
    // 点击确定按钮，编辑分类数据
    async handleEdit() {
      // 准备数据：put请求 categories/:id cat_name
      const response = await this.$http.put(`categories/${this.currentCat.cat_id}`, this.form);
      const {msg, status} = response.data.meta;
      if(status === 200) {
        this.$message.success(msg);
        this.editDialogFormVisible = false;
        // 这样的写法是将界面的currentCat对象的值重新赋值了，这时原本与currentCat同一指向的cat与它没有关联了，
        // 在界面的显示上，修改的值就不能显示，所以不能重新赋值，只能修改
        // this.currentCat = response.data.data;
        this.currentCat.cat_name = response.data.data.cat_name;
      } else {
        this.$message.error(msg);
      }

    }
  }
};
</script>

<style>
.btn {
  margin-top: 15px;
}
</style>
