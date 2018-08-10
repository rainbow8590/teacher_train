// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
// import Vue from 'vue'
import App from './App'


// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css';

import './assets/icon/style.css'

import router from './router'
// import axios from 'axios'  // 请求数据
import storage from '../static/storage.js'  // 本地存储

// Vue.use(ElementUI)



Vue.config.productionTip = false



Vue.prototype.$axios = axios;
Vue.prototype.$storage = storage;
Vue.prototype.baseUrl = 'http://47.94.40.214:1212';


Vue.prototype.appid = 'web';
Vue.prototype.pageSize = 10;
Vue.prototype.ajax = false;
Vue.prototype.backTime = 3000;

// 每期培训状态
Vue.prototype.JobStatus = [
  {id:-1,value:'全部'},
  {id:1,value:'未开始'},
  {id:2,value:'进行中'},
  {id:3,value:'已完成'}
]
// 学生培训状态
Vue.prototype.StudentStatus = [
  {id:-1,value:'全部'},
  {id:1,value:'培训中'},
  {id:2,value:'已淘汰'},
  {id:3,value:'培训通过'},
  {id:4,value:'转到下期'},
  {id:5,value:'待组长确认'},
]
// 面试结果
Vue.prototype.JobResult = [
  {id:0,value:'全部'},
  {id:1,value:'待面试'},
  {id:2,value:'参加培训'},
  {id:3,value:'直接签约'},
  {id:4,value:'VIP1对1'},
  {id:5,value:'二次面试'},
  {id:6,value:'婉拒'},
]

// 账号状态
Vue.prototype.AccountStatus = [
  {id:-1,value:'全部'},
  {id:1,value:'正常'},
  {id:0,value:'已停用'},
]
//答辩/复试分组状态
Vue.prototype.AnswerStatus = [
  {id:-1,value:'全部'},
  {id:1,value:'未开始'},
  {id:2,value:'进行中'},
  {id:3,value:'已完成'},
]
//个人答辩状态
Vue.prototype.AnswerStatusPerson = [
  {id:0,value:'全部'},
  {id:1,value:'待答辩'},
  {id:2,value:'待组长确认'},
  {id:3,value:'已淘汰'},
  {id:4,value:'答辩通过'},
]
//个人复试状态
Vue.prototype.ExamStatusPerson = [
  {id:-1,value:'全部'},
  {id:1,value:'待复试'},
  {id:2,value:'已淘汰'},
  {id:3,value:'复试通过'},
  {id:4,value:'待组长确认'},
  {id:5,value:'转到下期'}
]


// import { mapState} from 'vuex'
// 登录 和 mian 拦截 
router.beforeEach((to, from, next) => {
    var loginTime = Vue.prototype.$storage.getStorage('loginTime');
    var nowTime = new Date().getTime();
    // 15天的毫秒数
    var minsec = 15 * 24 *60 *60 *1000;
    
    let username = Vue.prototype.$storage.getStorage('username');
    let rememberPass = Vue.prototype.$storage.getStorage('rememberPass');
    // 是否记住密码
    if(rememberPass == 'true'){ // 记住密码
      if(to.fullPath == '/'){
        next({path:'/importstudents'})
      }else{
        next()
      }
      
      /*console.log(nowTime - loginTime)
      if(nowTime - loginTime > minsec){  // 超过15天就重新登录
      //console.log(Vue.prototype.$route)
      // Vue.prototype.$router.replace('/')

        Vue.prototype.$storage.clearStorage()
        next({path: '/'})
      }else{

        next()
      }*/
    }else{ // 没有记住密码
        if(to.meta.requireAuth) {  // 判断该路由是否需要登录权限
            if (username) {  // 通过vuex state获取当前的username是否存在
              next()
            }else {
              next({
                path: '/',
              })
            }
        }else {
          next();
        }

    }

})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',

})
