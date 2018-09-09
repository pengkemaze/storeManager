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
              hello
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
        staticParams: []
      };
  },
  created() {
      this.loadOptions();
  },
  methods: {
    //   多级下拉发生改变的时候执行
      handleChange() {

      },
    //   点击tab的时候执行
      handleClick(tab) {

      },
    //   加载商品分类
    async loadOptions() {
      const response = await this.$http.get('categories?type=3');
    //   console.log(response);
      this.options = response.data.data;
    }
  }
};
</script>

<style>

</style>
