// 封装axios调用接口的插件
import axios from 'axios';
import { Loading, Message } from 'element-ui';
// 创建一个MyHttp对象
const MyHttp = {};
// vue的插件,必须有一个公共的install方法
MyHttp.install = function (Vue) {
  // 设置baseURL
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  // Add a request interceptor
  // 添加请求的拦截器
  let loadingInstance = null;
  axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 在请求发送之前，添加请求头token
    // 如果当前请求的地址是/login的时候，不给请求头加token
    // console.log(config.headers);
    // console.log(config.url);
    if (config.url !== 'login') {
      const token = sessionStorage.getItem('token');
      // 设置请求头
      config.headers.Authorization = token;
    }
    // 发送请求之前，显示loading
    loadingInstance = Loading.service();
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  // Add a response interceptor
  // 添加响应的拦截器
  axios.interceptors.response.use(function (response) {
    // 1.隐藏加载显示
    loadingInstance.close();

    // 2.统一处理获取相应数据，判断获取数据成功还是失败
      // const {msg: {msg, status}} = response.data;
      // if (status === 200 || status === 201) {
      //   // 成功
      // } else {
      //   // 失败
      //   Message.error(msg);
      // }
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

  Vue.prototype.$http = axios;
};
// 开放MyHttp的使用权限，让其他文件可以使用这个插件
export default MyHttp;
