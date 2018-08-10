<template>
  <div id="app">

       
        <el-container :style="{height: windowHeight+'px'}">
          <el-aside width="268px">
            <div class="main-logo">
              <img src="../assets/images/logo.png" alt="">
              <div>
                <p>高思教育</p>
                <p>教师培训系统</p>
              </div>
            </div>
            <div class="main-user">
              <i class="icon-avator"></i>
              <span class="username">{{username}}</span>
              <span class="loginout" @click="loginOut">[退出]</span>
            </div>
            <el-menu
              :default-active="navselected"
              class="el-menu-vertical-demo"
              unique-opened
              background-color="#f5f5f5"
              text-color="#5b5b5b"
              active-text-color="#fff"
              router>
              <el-submenu v-for="(menu,index) in menuList" :index="menu.id" :key="index" v-if="menu.children.length" popper-class="menu-arrow">
                <template slot="title"> 
                  <strong class="icon-interview" v-if="menu.name == '面试'"></strong>     
                  <strong class="icon-prejob" v-if="menu.name == '岗前培训'"></strong>     
                  <strong class="icon-exam" v-if="menu.name == '岗前培训复试'"></strong>     
                  <strong class="icon-task" v-if="menu.name == '实习任务'"></strong>     
                  <strong class="icon-postjob" v-if="menu.name == '岗后培训'"></strong>     
                  <strong class="icon-answer" v-if="menu.name == '转正答辩'"></strong>     
                  <strong class="icon-account" v-if="menu.name == '权限管理'"></strong>     
                  <span>{{menu.name}}</span>
                  <!-- <span>{{menu.id}}</span> -->
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(menulist,ind) in menu.children" :key="ind" :index="menulist.UiUrl">
                  {{menulist.Name}}
                  <i class="icon-exam" slot="icon"></i>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main :style="{width:mainWidth+'px'}">
            <!-- <transition name="fade" mode="out-in"> -->
              <router-view v-if="isRouterAlive" />
            <!-- </transition> -->
          </el-main>
        </el-container>
  </div>
</template>

<script>
import store from '@/vuex/store'
import { mapState } from 'vuex';
import Request from '../assets/request'
export default {
  name: 'App',
  store,
  provide () {
    return {
      reload: this.reload
    }
  },
  data(){
    return {
        isRouterAlive: true,
        navselected:'',
        windowHeight: document.documentElement.clientHeight,
        windowWidth: document.documentElement.clientWidth,
        mainWidth:document.documentElement.clientWidth-268,
        from:'',
        XueBu: this.XueBu,
        // menuList:[]
    }
  },
  created(){

    // this.menuList = this.$storage.getStorage('menuList');
    //console.log(this.menuList)
    /*this.menuList = [
    {id: "0", name: "面试", children: [
      {Name: "导入学员", UiUrl: "/importstudents"},
      {Name: "面试记录", UiUrl: "/interviewrecord"}
    ]},
    {id: "1", name: "岗前培训", children:[
      {Name: "新建岗前培训", UiUrl: "/new/newprejob"},
      {Name: "岗前培训记录", UiUrl: "/record/prejobrecord"}
    ]},
    {id: "2", name: "岗后培训复试", children: [
      {Name: "复试分组", UiUrl: "/group/examgroup"},
      {Name: "复试记录", UiUrl: "/arecord/examrecord"}
    ]},
    {id: "3", name: "实习任务", children: [
      {Name: "配置预约课程", UiUrl: "/setcurriculum"},
      {Name: "实习任务审核", UiUrl: "/taskexamine"},
      {Name: "实习任务进度", UiUrl: "/taskprogress"}
    ]},
    {id: "4", name: "岗后培训", children: [
      {Name: "新建岗后培训", UiUrl: "/new/newpostjob"},
      {Name: "岗后培训记录", UiUrl: "/record/postjobrecord"}
    ]},
    {id: "5", name: "转正答辩", children: [
      {Name: "答辩分组", UiUrl: "/group/answergroup"},
      {Name: "答辩记录", UiUrl: "/arecord/answerrecord"}
    ]},
    {id: "6", name: "权限管理", children: [
      {Name: "角色管理", UiUrl: "/role"},
      {Name: "账户管理", UiUrl: "/account"}
    ]}
    ],*/

    this.getXuebu();
    this.getXueke();
    this.getGrade();
  },
  updated(){
    this.updateForcus()
  },
  mounted(){
    this.updateForcus()
  },
  methods: {
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(()=>{ 
        this.isRouterAlive = true;
      })
    },
    updateForcus(){
      var path = this.$route.path;
      if(path=="/importstudents"){  //导入面试学员
        this.navselected = "/importstudents";
      }else if(path=="/interviewrecord"){  //面试记录
        this.navselected = "/interviewrecord";
      }else if(path=="/new/newprejob"){  //新建岗前培训
        this.navselected = "/new/newprejob";
      }else if (path=="/record/prejobrecord" || path=="/recorddetail/prejobrecorddetail" || path=="/recorddetailperson/prejobrecorddetailperson" ) { //岗前培训记录
        this.navselected = "/record/prejobrecord";
      }else if (path=="/new/newpostjob" ) { //新建岗后培训
        this.navselected = "/new/newpostjob";
      }if (path=="/record/postjobrecord" || path=="/recorddetail/postjobrecorddetail" || path=="/recorddetailperson/postjobrecorddetailperson" ) { // 岗后培训记录
        this.navselected = "/record/postjobrecord";
      }else if ( path=="/role" || path=="/roleedit/new" || path=="/roleedit/edit") { //角色管理
        this.navselected = "/role";
      }else if ( path=="/account") { //账号管理
        this.navselected = "/account";
      }else if ( path=="/group/answergroup" || path=="/groupdetail/answergroupdetail" ) { //答辩分组
        this.navselected = "/group/answergroup";
      }else if(path=="/new/newanswer"){  //新建答辩
        this.navselected = "/new/newanswer"
      }else if ( path=="/arecord/answerrecord" || path=="/arecorddetail/answerrecorddetail" || path=="/arecorddetailperson/answerrecorddetailperson" ) { //答辩记录
        this.navselected = "/arecord/answerrecord";
      }else if ( path=="/group/examgroup" || path=="/groupdetail/examgroupdetail" || path=="/new/newexam") { //复试分组
        this.navselected = "/group/examgroup";
      }else if(path=="/new/newexam"){ //新建复试
        this.navselected = "/new/newexam"
      }else if ( path=="/arecord/examrecord" || path=="/arecorddetail/examrecorddetail"|| path=="/arecorddetailperson/examrecorddetailperson" ) { //复试记录
        this.navselected = "/arecord/examrecord";
      }else if ( path=="/setcurriculum" || path=="/setcurriculumlessons" ) { //配置约课课程
        this.navselected = "/setcurriculum";
      }else if ( path=="/taskexamine" || path=="/taskexaminedetail" ) { //实习任务审核
        this.navselected = "/taskexamine";
      }else if ( path=="/taskprogress" || path=="/taskprogressdetail" ) { //实习任务进度
        this.navselected = "/taskprogress";
      }
    },
    //退出
    loginOut(){
      localStorage.clear();
      this.$router.replace('/')
    },
    //获取学部
    getXuebu(){
      var that = this;
      let query = {
        timestamp:new Date().getTime(),
        appid:this.appid,
        token: this.token
      }
      let option = {
        type:'get',
        api: '/api/Account/GetXueBuList',
        query: query,
      }
      Request(option, function(res){
        if(res.data.ResultType == 0){
          let resData = res.data.AppendData;
          let xuebu = [];
          for(let i =0; i < resData.length; i++){
            xuebu.push({id: resData[i].Value,value: resData[i].Name})
          }
          that.$storage.setStorage('XueBu',xuebu)
       
        }else{
          that.$message.error(res.data.Message)
        }

      })
    },
    //获取学科
    getXueke(){
      var that = this;
      let query = {
        timestamp:new Date().getTime(),
        appid:this.appid,
        token: this.token
      }
      let option = {
        type:'get',
        api: '/api/Account/GetSubjectList',
        query: query,
      }
      Request(option, function(res){
        if(res.data.ResultType == 0){
          let resData = res.data.AppendData;
          let xueke = [];
          for(let i =0; i < resData.length; i++){
            xueke.push({id: resData[i].Value,value: resData[i].Name})
          }
          that.$storage.setStorage('XueKe',xueke)
        }else{
          that.$message.error(res.data.Message)
        }

      })
    },
    //获取年级
    getGrade(){
      var that = this;
      let query = {
        timestamp:new Date().getTime(),
        appid:this.appid,
        token: this.token
      }
      let option = {
        type:'get',
        api: '/api/Account/GetGradeList',
        query: query,
      }
      Request(option, function(res){
        if(res.data.ResultType == 0){
          let resData = res.data.AppendData;
          let grade = [];
          for(let i =0; i < resData.length; i++){
            grade.push({id: resData[i].Value,value: resData[i].Name})
          }
          that.$storage.setStorage('Grade',grade)
        }else{
          that.$message.error(res.data.Message)
        }

      })
    },
    
  },
  computed:{
    ...mapState(['rememberPass']),
    ...mapState({
      username:function(state){
        if(!state.username){
          let user= JSON.parse(this.$storage.getStorage('username'));
          this.$store.state.username = user;
        }
        return state.username;
      }
      
    }),
    ...mapState({
      token: function(state){
        let token = JSON.parse(this.$storage.getStorage('token'));
        this.$store.state.token = token;
        return state.token;
      }
    }),
    ...mapState({
      menuList: function(state){
        let menuList = JSON.parse(this.$storage.getStorage('menuList'));
        this.$store.state.menuList = menuList;
        return state.menuList;
      }
    })
  },
  beforeDestroy(){
    // 如果不记住密码 就清空
    if(this.rememberPass != true){
      localStorage.clear();
    }
  }
}
</script>

<style lang="scss" type="text/css">
  html,body{
    height: 100%;
  }
 
  .el-menu{
    border-right: none;
    font-size: 14px;
  }
  .el-submenu [class^=el-icon-]{
    margin-right: 40px;
  }
  .el-menu-item-group__title{
    padding: 0;
  }
  
  .el-menu-item-group .el-menu-item:hover{
    background-color: #dcdcdc!important;

  }
  .el-submenu__title{
    padding-left: 40px!important;
  }
  .el-submenu__title:hover{
    background-color: #dcdcdc!important;
    border-left-color: #dcdcdc!important;
    border-bottom-color: #dcdcdc!important;
  }
  .el-submenu__title:hover i{
    color: #fff;
  }

  .el-menu-item-group .el-menu-item{
    background-color: #f5f5f5!important;
    font-weight: normal;
  }
  .el-submenu__icon-arrow{
    font-weight: bolder;
    font-size: 14px;
  }
  .el-submenu .el-submenu__title{
    height: 70px;
    line-height: 70px;
    background-color: #f5f5f5;
    // color: #fff!important;
    border-bottom: 0px solid #f5f5f5;
    border-left: 6px solid #f5f5f5;
    transition: all .6s;
  }
  .el-submenu .el-submenu__title strong{
    font-size: 28px;
    padding-right: 36px;
  }
  .el-submenu.is-active .el-submenu__title{
    background-color: #33c37d!important;
    color: #fff!important;
    border-bottom: 0px solid #67d8a1!important;
    border-left: 6px solid #269a61!important;

  }
  .el-submenu.is-active .el-submenu__title i{
    color: #fff!important;
  }
  .el-menu-item-group .el-menu-item{
    background-color: #fff!important;
    color: #191919!important;
    text-align: center;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #eaeaea;
  }
  .el-menu-item-group .el-menu-item.is-active{
    background-color: #33c37d!important;
    color: #fff!important;
    font-weight: bold;
    border-top: 1px solid #67d8a1!important;
  }
 

  .el-submenu{
    color: #5b5b5b;
  }

  .el-submenu.is-active.is-opened{
    font-weight: bold;
  }


  .el-container{
    height: 100%;
    overflow: hidden;
    .el-aside {
      background-color: #f5f5f5;
      color: #333;
      height: 100%;
      min-height: 300px;
      float: left;
      font-size: 16px;
      border-left: 1px solid #dbdbdb;
      .main-logo{
        line-height: 90px;
        border-bottom: 1px solid #dbdbdb;
        text-align: left;
        img{
          padding-left: 40px;
          padding-right: 10px;
          vertical-align: middle;
        }
        div{
          text-align: left;
          display: inline-block;
          vertical-align: middle;
          line-height: 20px;
        }
      }
      .main-user{
        line-height: 56px;
        padding-left: 40px;
        border-bottom: 1px solid #dbdbdb;
        i{
          font-size: 20px;
          color: #5a5a5a;
          padding-left: 5px;
          margin-right: 15px;
          vertical-align: middle;
        }
        .username{
          vertical-align: middle;
        }
        .loginout{
          vertical-align: middle;
          cursor: pointer;
          padding: 0 10px;
          margin-left: 44px;
        }
      }
    }
    
  }

  // 侧边栏
 
  .el-main{
    float: left;
    height: 100%;
    box-sizing: border-box;
    // overflow: hidden;
    // overflow-y: scroll;
    padding: 0;
    border-left: 1px solid #dbdbdb;
  }

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.menu-arrow{
  padding-top: 40px;
}


// .el-icon-arrow-down:before {
//     content: "\E60B";
// }

  
  
  // 树形
  // .el-tree {
  //   background: transparent;
  //   color: #fff;
  // }
  // .el-tree-node__label {
  //   width: 100%;
  //   display: block;
  //   line-height: 50px;
  // }
  // .el-tree-node__content {
  //   height: 50px;
  // }
  // .el-tree-node__children .el-tree-node__content{
  //   background: #3c404a;
  // }
  // .el-tree-node__expand-icon{
  //   display: none;
  // }
  // .el-tree-node:focus>.el-tree-node__content {
  //   background-color: #e97417;
  // }
  // .el-tree-node__content:hover {
  //   background-color: #e97417;
  // }
  // .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  //   background-color: #1c1f26; // 一级导航的背景色
  // }
  // .el-tree--highlight-current .el-tree-node__children>.el-tree-node.is-current > .el-tree-node__content{
  //   background-color: #e97417; //二级导航背景色
  // }
  
</style>
