<template>
    <el-card class="card">
      <!-- 面包屑 -->
      <my-breadcrumb level1="商品管理" level2="商品添加"></my-breadcrumb>
      <!-- alert -->
      <el-alert
        style="margin-top: 10px; margin-bottom: 10px"
        :closable="false"
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon>
      </el-alert>
      <!-- 层级下拉框 -->
      <el-row>
        <el-col :span="24">
          请选择商品分类：
          <el-cascader
            clearable
            :show-all-levels="false"
            expand-trigger="hover"
            :options="options"
            :props="{label: 'cat_name', value: 'cat_id'}"
            v-model="selectedOptions"
            @change="handleChange">
         </el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏切换 -->
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="selectedOptions.length !== 3"
            type="primary">添加动态参数</el-button>
          <el-table
          border
          stripe
          :data="dynamicParams"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                v-for="(tag, index) in scope.row.params"
                :key="tag"
                closable
                @close="handleClose(scope.row.params, index, scope.row)">
                {{ tag }}
              </el-tag>

              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.params)"
                @blur="handleInputConfirm(scope.row.params)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            width="60">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="商品参数"
            width="300">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button
            :disabled="selectedOptions.length !== 3"
            type="primary">添加静态参数</el-button>
          <el-table
          border
          stripe
          :data="staticParams"
          style="width: 100%">
          <el-table-column
            type="index"
            width="60">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值"
            width="300">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" plain></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" plain></el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeTab: 'many',
      dynamicParams: [],
      staticParams: [],
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    //   多级下拉发生改变的时候执行
    handleChange() {
      this.loadParams();
    },
    //   点击tab的时候执行
    handleClick(tab) {
      this.loadParams();
    },
    //   加载商品分类
    async loadOptions() {
      const response = await this.$http.get('categories?type=3');
      //   console.log(response);
      this.options = response.data.data;
    },
    // 加载动态参数/静态参数
    async loadParams() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        return;
      }
      const response = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeTab}`);
      if (this.activeTab === 'many') {
        // 动态参数
        this.dynamicParams = response.data.data;
        this.dynamicParams.forEach((item) => {
        //   动态给item对象增加了一个属性params
          const arr = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
          //  动态给对象增加的属性，不是响应式的数据
          // 因为vue不会跟踪动态增加的属性值的变化
          // 所以通过this.$set()给对象增加一个响应式的数据，vue可以跟踪到这个数据的变化
          this.$set(item, 'params', arr);
        });
      } else {
        // 静态参数赋值
        this.staticParams = response.data.data;
      }
    },
    // 点击tag的关闭按钮的时候执行
    async handleClose(params, index, attr) {
      console.log(attr);
      //   从数组中把当前项删除
      params.splice(index, 1);
      //   console.log(params);
      // 服务器发送请求
      // put  categories/分类的id/attributes/参数的id
      const response = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`, {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: params.join(',')
      });
      attr.attr_vals = params.join(',');
      const {msg, status} = response.data.meta;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },

    handleInputConfirm(params) {
      let inputValue = this.inputValue;
      if (inputValue) {
        params.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    showInput() {
      this.inputVisible = true;
    //   $nextTick方法：等待下一次界面更新的时候，文本框才能获取焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  }
};
</script>

<style scoped>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
