<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="数据统计" level2="数据报表"></my-breadcrumb>
    <!-- echart图表 -->
    <div ref="div" style="width: 800px; height: 600px; margin-top: 15px">

    </div>
  </el-card>
</template>

<script>
import echart from 'echarts';
export default {
    async mounted() {
        // 发送异步请求，获取图片数据
      const response = await this.$http.get('reports/type/1');
     //  2.准备图标的配置项和数据option
      let option = response.data.data;
    //   console.log(option);
      const data = {
          title: {
            text: '数据报表'
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
            }
          },
          toolbox: {
            feature: {
                saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          }
      };
    //   console.log(data);
      option = {...option, ...data};
    //   console.log(option);
      // 设置xAxis 中的 boundaryGap : false,
      option.xAxis[0].boundaryGap = false;
        // 1.初始化echiarts实例
      const myChart = echart.init(this.$refs.div);
    //  3.使用指定的配置项和数据显示图表
    myChart.setOption(option);
    }

};
</script>

<style>

</style>
