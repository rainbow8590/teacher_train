import Vue from 'vue'
import VueX from 'vuex'
import storage from '../../static/storage.js'  // 本地存储
Vue.use(VueX)
Vue.prototype.$storage = storage;
let $storage = Vue.prototype.$storage 

const state = {
  username: null, //用户名
  token: null,   // token
  rememberPass:false, // 是否记住密码
  defaultMenu:null, // 带按钮的菜单
  menuList:null, // 不带按钮的菜单
  loginTime: 0,  // 登录时间
  role:null, // 角色
  roleCode:null, // 角色类型
  trainInfo:'',// 每期的培训信息
  trainStudent:null, // 培训的学员信息
  YingInfo:null, // 应约课程信息

}
//过滤
const getters = {
  getStorage(state,key){
    if(!state[key]){
      state[key] = JSON.parse($storage.getStorage(key))
    }
    return state[key];
  }
}
const mutations = {
  // 改变state
  $_setStorage(state,obj){
    state[obj.key] = obj.value;
    $storage.setStorage(obj.key,JSON.stringify(obj.value))
  },
  // 移除state
  $_removeStorage(state,key){
    stage[key]= null;
    $storage.removeStorage(key)
  }
}

// const actions = {
//   $_changeStorage(context,obj){
//     context.commit('$_setStorage',obj)
//   }
// }
export default new VueX.Store({
  state,
  getters,
  mutations,
})