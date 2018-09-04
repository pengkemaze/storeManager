// 封装axios调用接口的插件
import axios from 'axios';
// 创建一个MyHttp对象
const MyHttp = {};
// vue的插件,必须有一个公共的install方法
MyHttp.install = function (Vue) {
    // 设置baseURL
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
    Vue.prototype.$http = axios;
};
// 开放MyHttp的使用权限，让其他文件可以使用这个插件
export default MyHttp;
