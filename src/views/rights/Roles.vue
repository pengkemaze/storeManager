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
          <!-- 一级权限 -->
          <el-row
            class="level1"
            v-for="level1 in scope.row.children"
            :key="level1.id">
            <el-col :span="4">
              <!-- 显示一级权限的名字 -->
              <el-tag
              closable
              @close="handleClose(scope.row, level1.id)">{{ level1.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row
                v-for="level2 in level1.children"
                :key="level2.id">
                <el-col :span="4">
                  <!-- 显示二级权限的名字 -->
                  <el-tag
                    @close="handleClose(scope.row, level2.id)"
                    class="level2"
                    closable
                    type="success">
                    {{ level2.authName }}
                  </el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag
                    @close="handleClose(scope.row, level3.id)"
                    class="level3"
                    closable
                    type="warning"
                    v-for="level3 in level2.children"
                    :key="level3.authName">
                    {{ level3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 未分配权限 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">未分配权限</el-col>
          </el-row>
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
          <el-button @click="handleOpenDialog(scope.row)" size="mini" type="success" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="dialogVisible">
      <!-- tree
        data 绑定到树上的数据
        props 告诉树上的节点要展示的属性，子节点对应的属性
       -->
    <el-tree
      ref="tree"
      default-expand-all
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedKeys"
      :data="data"
      :props="defaultProps">
    </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
     </span>
   </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      //   控制对话框的显示隐藏
      dialogVisible: false,
      // 绑定树的数据
      data: [],
      defaultProps: {
        //   树上的节点绑定对象的属性
        label: 'authName',
        //   对象的子节点绑定对象的属性
        children: 'children'
      },
      checkedKeys: [],
      // 记录当前角色的id
      currentRoleId: -1
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
    },
    //   删除当前角色对应的权限
    async handleClose(role, rightId) {
    // role 当前行对应的角色对象
    // rightId 当前权限的id
      const response = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // 删除成功
        this.$message.success(msg);
        // 只重新加载当前角色的权限列表
        role.children = response.data.data;
      } else {
        // 删除失败
        this.$message.error(msg);
      }
    },
    async handleOpenDialog(role) {
      this.dialogVisible = true;
      //   获取所有权限tree
      const response = await this.$http.get('rights/tree');
      this.data = response.data.data;
      // 设置当前角色所拥有的权限被选中
      // 当前角色role所拥有的三级权限的id
      const arr = [];
      // 遍历一级权限
      role.children.forEach(level1 => {
        // 遍历二级权限
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            arr.push(level3.id);
          });
        });
      });
      this.checkedKeys = arr;
      // 记录当前角色的id
      this.currentRoleId = role.id;
    },
    // 点击确定按钮，给当前角色设置权限
    async handleSetRights() {
      // post roles/:roleId/rights  rids权限 id列表 每个id使用，分割
      // 获取树上选中和半选中的节点id
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedKeys();

      const arr = [...arr1, ...arr2];
      const rids = arr.join(',');
      // console.log(rids);
      // 发送请求
      const response = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: rids
      });

      const {meta: {msg, status}} = response.data;
      if (status === 200) {
        // 成功
        this.$message.success(msg);
        this.dialogVisible = false;
        this.loadData();
      } else {
        this.$message.error(msg);
      };
    }
  }
};
</script>

<style>
.level1 {
    margin-bottom: 20px;
}
.level3 {
    margin-left: 5px;
    margin-bottom: 5px;
}
</style>
