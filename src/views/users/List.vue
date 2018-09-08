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
        <!-- 搜索文本框 -->
        <el-input clearable v-model="searchValue" style="width: 300px" placeholder="请输入内容">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
       </el-input>
       <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <!-- v-loading是elementui自定义指令，显示加载转圈效果 -->
    <el-table
      v-loading="loading"
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
          @change="handleChange(scope.row)"
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
          <el-button @click="handleOpenEditDialog(scope.row)" size="mini" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger" icon="el-icon-delete" plain></el-button>
          <el-button @click="handleOpenSetRoleDialog(scope.row)" size="mini" type="success" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 事件
      size-change：页容量发生改变的时候执行
      current-change：当前页码发生改变的时候执行

      属性
      page-sizes：分页选择器显示的内容
      page-size：默认当前的页容量
      layout：布局
      total：总条数
     -->
    <el-pagination
      style="margin-top: 15px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 3, 4, 5]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户的对话框
      close关闭文本框事件 关闭文本框清空表单数据
    -->
  <el-dialog @close="handleClose" title="添加用户" :visible.sync="addUserDialogFormVisible">
    <el-form
    ref="form"
    :rules="rules"
    label-width="80px"
    :model="formData">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="formData.email" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model="formData.mobile" auto-complete="off"></el-input>
    </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
    <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleAdd">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 修改用户对话框 -->
  <el-dialog @close="handleClose" title="修改用户" :visible.sync="editUserDialogFormVisible">
    <el-form
    ref="form"
    :rules="rules"
    label-width="80px"
    :model="formData">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" auto-complete="off" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="formData.email" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model="formData.mobile" auto-complete="off"></el-input>
    </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleEdit">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 分配角色对话框 -->
  <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogFormVisible"
      @close="handleClose">
      <el-form
        label-width="100px"
        :model="formData">
        <el-form-item label="用户名">
          {{ formData.username }}
        </el-form-item>
        <el-form-item label="请选择角色">
          <!-- 下拉框, currentRoleId默认为-1 -->
          <el-select v-model="currentRoleId" placeholder="请选择">
            <el-option
              label="请选择"
              :value="-1" disabled>
            </el-option>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRole">确 定</el-button>
      </div>
  </el-dialog>
 </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      // loading是v-loading绑定的值
      loading: true,
      // 分页数据
      // 页码
      pagenum: 1,
      // 每页条数
      pagesize: 2,
      // 总条数
      total: 0,
      // 绑定搜索文本框
      searchValue: '',
      addUserDialogFormVisible: false,
      // 控制修改用户对话框的显示或隐藏
      editUserDialogFormVisible: false,
      // 控制分配角色的对话框显示或者隐藏
      setRoleDialogFormVisible: false,
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      rules: {
        // 用户名验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      },
      // 绑定下拉框
      currentRoleId: -1,
      options: []
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
      // 请求开始只要请求就要先loading加载
      this.loading = true;
      // 设置token
      const token = sessionStorage.getItem('token');
      // 设置请求头
      this.$http.defaults.headers.common['Authorization'] = token;
      const response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
      // 请求结束
      this.loading = false;
      const {msg, status} = response.data.meta;
      // 判断获取数据是否ok
      if (status === 200) {
        this.tableData = response.data.data.users;
        // 设置总条数total
        this.total = response.data.data.total;
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
    },
    // 分页相关方法
    handleSizeChange(val) {
      // 当页容量发生变化时执行 val就是当前页容量
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 当页码发生变化时执行 val就是当前页码
      this.pagenum = val;
      this.loadData();
    },
    // 搜索功能
    handleSearch() {
      this.loadData();
    },
    // 删除用户
    handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击确定按钮执行
        const response = await this.$http.delete(`users/${id}`);
        // 获取返回的数据，判断删除是否成功
        const {msg, status} = response.data.meta;
        if (status === 200) {
          // 成功
          this.$message.success(msg);
          // 如果是最后一页，并且只要一条数据，此时删除数据会出现问题
          // 如果是最后一页并且表格中只有一条数据，删除后就让页码减一
          if (this.pagenum > 1 && this.tableData.length === 1) {
            this.pagenum--;
          }
          // 删除成功刷新表格
          this.loadData();
        } else {
          // 失败
          this.$message.error(msg);
        }
      }).catch(() => {

      });
    },
    // 修改用户状态
    async handleChange(user) {
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const {msg, status} = response.data.meta;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 添加用户
    handleAdd() {
      // 表单验证
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('验证失败');
          return;
        }
        // 验证成功，发送异步请求
        const response = await this.$http.post('users', this.formData);
        // 获取数据，判断添加是否成功 post提交的成功码是201
        const {msg, status} = response.data.meta;
        if (status === 201) {
        // 用户添加成功提示
          this.$message.success(msg);
          // 刷新表格数据
          this.loadData();
          // 设置弹出框的addUserDialogFormVisible属性为false关闭弹出框
          this.addUserDialogFormVisible = false;
        } else {
        // 用户添加失败
          this.$message.error(msg);
        }
      });
    },
    // 关闭对话框的时候清空文本框内容
    handleClose() {
    // 清空文本框 不能用这种方法，容易造成内存泄漏
    // this.formData = {};
    // 遍历对象的所有属性，将属性的每一项对应的值清空
      for (let key in this.formData) {
        this.formData[key] = '';
      }
      // 重置下拉框中默认显示的项
      this.currentRoleId = -1;
    },
    // 点击编辑按钮，打开修改用户的对话框
    handleOpenEditDialog(user) {
      // 打开修改用户对话框
      this.editUserDialogFormVisible = true;
      // 设置formdata值
      this.formData.username = user.username;
      this.formData.email = user.email;
      this.formData.mobile = user.mobile;
      // 点击编辑按钮的时候记录用户的id，点击确定按钮的时候使用
      this.formData.id = user.id;
    },
    // 点击确定按钮，修改用户信息
    async handleEdit() {
      // users/:id mobile email
      const response = await this.$http.put(`/users/${this.formData.id}`, {
        email: this.formData.email,
        mobile: this.formData.mobile
      });
      const {msg, status} = response.data.meta;
      if (status === 200) {
        // 成功之后
        // 关闭对话框
        this.editUserDialogFormVisible = false;
        // 刷新数据
        this.loadData();
        // 提示
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      };
    },
    // 点击分配角色，打开分配角色的对话框
    async handleOpenSetRoleDialog(user) {
      this.setRoleDialogFormVisible = true;
      this.formData.username = user.username;
      // 发送请求获取所有的角色
      const response = await this.$http.get('roles');
      this.options = response.data.data;
      // 设置当前用户默认的角色
      // 根据用户id，查询用户信息，找到当前用户对应的角色id
      const res = await this.$http.get(`users/${user.id}`);
      this.currentRoleId = res.data.data.rid;
      // 记录用户id
      this.formData.id = user.id;
    },
    // 点击确定按钮，设置用户角色
    async handleSetRole() {
      // put users/:id/role 请求需要rid
      const response = await this.$http.put(`users/${this.formData.id}/role`, {
        rid: this.currentRoleId
      });
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // 角色设置成功
        this.$message.success(msg);
        // 设置弹出框的setRoleDialogFormVisible属性为false关闭弹出框
        this.setRoleDialogFormVisible = false;
      } else {
        // 角色设置失败
        this.$message.error(msg);
      }
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
