<template>
    <el-card class="card">
      <!-- 面包屑 -->
      <my-breadcrumb level1="商品管理" level2="商品添加"></my-breadcrumb>
      <!-- 文字提示 -->
      <el-alert
        style="margin: 10px 0 10px 0"
        :closable="false"
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
      <!-- 步骤条
          align-center设置居中
          active设置能够打对勾索引从0开始
       -->
      <el-steps
        align-center
        :active="active"
        finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- tab栏
        tab-click是tab栏的点击事件
      -->
      <el-form
        label-position="top"
        label-width="80px"
        :model="formData">
        <el-tabs
          @tab-click="handleTabClick"
          tab-position="left"
          style="margin-top: 15px">
          <el-tab-pane label="基本信息">
            <!-- 基本信息 -->
            <el-form-item label="商品名称">
              <el-input v-model="formData.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="formData.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="formData.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="formData.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 多级下拉框
                v-model绑定的是所选中的菜单id是一个数组
              -->
              <el-cascader
                clearable
                @change="handleChange"
                expand-trigger="hover"
                :options="options"
                v-model="selectedOptions"
                :props="{label: 'cat_name', value: 'cat_id', children: 'children'}">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
              <!-- 商品参数-动态参数 -->
            <el-form-item
              v-for="item in dynamicParams"
              :key="item.attr_id"
              :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="val in item.attr_vals"
                  :key="val"
                  border
                  :label="val">
                  </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
              <!-- 商品属性-静态参数 -->
              <el-form-item
              v-for="item in staticParams"
              :key="item.attr_id"
              :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
              <!-- 商品图片-上传组件
                action是接口地址，全部的地址
              -->
            <el-upload
              :headers="headers"
              action="http://localhost:8888/api/private/v1/upload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <el-button @click="handleAdd">添加商品</el-button>
            <quill-editor
              v-model="formData.goods_instroduce">
            </quill-editor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
//   注册quillEditor组件局部组件
  components: {
    quillEditor
  },
  data() {
    return {
      // active是步骤条的步骤索引
      active: 0,
      formData: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 用逗号分隔的分类列表id
        goods_cat: '',
        pics: [],
        goods_instroduce: '',
        attrs: []
      },
      // 绑定多级下拉的数据
      options: [],
      selectedOptions: [],
      checkList: ['复选框 A'],
      // 动态参数
      dynamicParams: [],
      // 静态参数
      staticParams: [],
      // 给上传组件提供请求头
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    };
  },
  created() {
    //   组件创建完毕，加载多级下拉的分类数据
    this.loadOptions();
  },
  methods: {
    // 点击tab标签页的时候执行
    handleTabClick(tab) {
    //   被选中的标签tab实例
    //   console.log(tab);
    // tab.index 当前tab也的索引-字符串类型，需要转换成数值型，减个0，做隐式转换
      this.active = tab.index - 0;

      // 如果当前的标签页是商品参数/商品属性
      if (tab.index === '1' || tab.index === '2') {
        //   清空静态参数和动态参数
        this.dynamicParams.length = 0;
        this.staticParams.length = 0;
        // 判断当前的多级下拉中是否选择了3级分类
        if (this.selectedOptions.length < 3) {
          this.$message.warning('请选择商品的三级分类');
        } else {
          // 确保选择了三级分类
          // 加载商品参数
          const sel = tab.index === '1' ? 'many' : 'only';
          this.loadParams(sel);
        }
      }
    },
    // 加载分类参数(静态参数和动态参数)
    async loadParams(sel) {
      const response = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);
      if (sel === 'many') {
        //   加载动态参数
        this.dynamicParams = response.data.data;
        // console.log(dynamicParams)
        // 把动态参数的attr_vals转换成数组，方便界面上去遍历
        // 遍历dynamicParams数组，把attr_vals转换成数组
        this.dynamicParams.forEach((item) => {
          // 判断获取到的数据是否为空字符串，如果为空，放入一个空数组中，如果不为空，将字符串用逗号分隔成数组
          item.attr_vals = item.attr_vals.length === '' ? [] : item.attr_vals.split(',');
        });
      } else {
        // 加载静态参数
        this.staticParams = response.data.data;
      }
    },
    async loadOptions() {
      const response = await this.$http.get('categories?type=3');
      this.options = response.data.data;
    },
    // 多级下拉选中的内容发生变化的时候执行
    handleChange() {
      // 判断当前选择的是否是3级分类
      if (this.selectedOptions.length !== 3 && this.selectedOptions.length !== 0) {
        this.$message.warning('请选择三级分类');
      }
    },
    // 上传图片使用的方法
    handleRemove(file, fileList) {
    //   console.log(file);
    //   console.log(fileList);
    //   把图片从formData.pics中移除
      const index = this.formData.pics.findIndex((item) => {
        //   findIndex找的是满足条件的那一项的索引
        return item.pic === file.response.data.tmp_path;
      });
      this.formData.pics.splice(index, 1);
    //   console.log(this.formData.pics);
    },
    handleSuccess(response, file, fileList) {
      // 设置formData中的pics
      //   pics需要的格式如下：
    //   "pics": [
    //      {"pic": "/tmp_uploads/文件路径"}
    //   ]
    //   console.log(response);
      this.formData.pics.push({
        pic: response.data.tmp_path
      });
    },
    // 添加商品
    async handleAdd() {
    // goods_cat分类的id列表
      this.formData.goods_cat = this.selectedOptions.join(',');
      // attrs分类参数
      const arr1 = this.staticParams.map((item) => {
        // 回调函数返回的结果，组成一个新的数组返回
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        };
      });

      const arr2 = this.staticParams.map((item) => {
        // 回调函数返回的结果，组成一个新的数组返回
        return {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(',')
        };
      });
      this.formData.attrs = [...arr1, ...arr2];

      const response = await this.$http.post('goods', this.formData);
      const {msg, status} = response.data.meta;
      if (status === 201) {
        // 成功
        this.$message.success(msg);
        this.$router.push('/goods');
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.ql-editor {
    height: 400px;
}
.el-step__title {
    font-size: 12px;
}
</style>
