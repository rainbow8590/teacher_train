<template>
  <div class="login">
    <div class="system-title">
      <img src="../assets/images/logo-white.png" alt="">
      <span>高思教师培训系统登录</span>
    </div>
    <div class="login-main">
      <div class="main-left">
        <img src="../assets/images/login-pic.png" alt="">
      </div>
      <div class="main-right">
        <div class="login-title">高思教师培训系统登录</div>
        <div class="login-form">
          <el-form :model="ruleForm"  :rules="rules" ref="ruleForm"  class="demo-ruleForm">
            <el-form-item  prop="user" label-width="56px" label="账号">
              <el-input
                placeholder="请输入账号"
                v-model="ruleForm.user">
                <template slot="append">@gaosiedu.com</template>
              </el-input>
            </el-form-item>
            <el-form-item  prop="pass" label-width="56px" label="密码"> 
              <el-input
                type="password"
                placeholder="请输入密码"
                v-model="ruleForm.pass"
                @keyup.enter.native="submitForm('ruleForm')">
              </el-input>
            </el-form-item>
            <el-form-item class="btn">
              <el-button class="submit-btn" @click="submitForm('ruleForm')">登录</el-button>
              <el-checkbox v-model="radio" label="true">记住密码</el-checkbox>
            </el-form-item>

          </el-form>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="login">
    <div class="login-wrap">
      <h3>高思教师培训系统</h3>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
        <el-form-item  prop="user" label-width="0">
          <el-input
            placeholder="请输入账号"
            prefix-icon="el-icon-search"
            v-model="ruleForm.user">
          </el-input>
        </el-form-item>
        <el-form-item  prop="pass" label-width="0"> 
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-search"
            v-model="ruleForm.pass"
            @keyup.enter.native="submitForm('ruleForm')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="submit-btn" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
        <el-form-item class="radio">
          <el-checkbox v-model="radio" label="true">记住密码</el-checkbox>
        </el-form-item>
          
      </el-form>
    </div>
  </div> -->
</template>

<script>
  import qs from 'qs'
  import store from '@/vuex/store'
  import Request from '../assets/request'
  // import ELEMENT from 'element-ui'
  export default {
    name: 'Login',
    store,
    data () {
      // 验证密码
      var validateUser = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入用户名'));
          } else {
            callback();
          }
        };
      // 验证密码
      var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            callback();
          }
        };
      return {
        radio:false,
        ruleForm:{
          user:'',
          pass:''
        },
        rules:{
          user: [
            { validator: validateUser, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
        },
        appid: this.appid,
      }
    },
    methods: {
      
      submitForm(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          let data = {
                loginName: this.ruleForm.user,
                password: this.ruleForm.pass,
                appId: this.appid
              };
          let query = {
            appid: this.appid,
            timestamp:new Date().getTime()
          }
          // 验证通过
          if (valid) {
            let option = {
              type:'post',
              api: '/api/Account/Login',
              query: query,
              data: qs.stringify(data)
            }
            Request(option, function(res){
              if(res.data.ResultType == 0){
                if(that.radio == true){
                  that.$store.commit('$_setStorage',{key:'rememberPass',value:true})
                }
                let menu = res.data.AppendData.MenuList;
                console.log(menu);
                let menus = []
                for(let i = 0 ; i < menu.length; i++){
                  menus.push({
                    id: i+'',
                    code: menu[i].MenuName.Code,
                    name: menu[i].MenuName.Name,
                    children: menu[i].ListMenuName
                  })
                }
                that.$store.commit('$_setStorage',{key:'defaultMenu',value:menus})

                var allCodes = [];
                for(let k = 0; k < menus.length; k++){
                  var menu = menus[k];
                  for(let j = menu.children.length-1; j >=0 ;j--){
  
                    allCodes.push(menu.children[j].Code)
                    if( menu.children[j].ButtonType == 1){ //1是按钮 0是菜单
                      menu.children.splice(j,1)
                    }
                  }
                }

                // console.log(allCodes)

                
                
                

                that.$storage.setStorage('allCodes',allCodes)
                that.$store.commit('$_setStorage',{key:'menuList',value:menus})
                that.$store.commit('$_setStorage',{key:'loginTime',value:new Date().getTime()})
                that.$store.commit('$_setStorage',{key:'token',value:res.data.Message})
                that.$store.commit('$_setStorage',{key:'username',value:res.data.AppendData.AccountModel.Name})
                that.$store.commit('$_setStorage',{key:'roleCode',value:res.data.AppendData.AccountModel.roleCode})
                that.$router.push('/importstudents')
              }else{
                that.$message.error(res.data.Message)
              }
              
            })
          } else {
            console.log('请检查用户名和密码');
            return false;
          }
        });
      },
      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/css">
   @import '../assets/public.css';
   .el-checkbox{
    margin-top: 10px;
   }
  .login{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url('../assets/images/login-bg.png') repeat;
    background-size:cover;
    .system-title{
      line-height: 90px;
      padding-top: 15px;
      padding-left: 35px;
      border-bottom: 1px solid #7dc5b9;
      width: 1065px;
      margin: 0 auto 105px;
      img{
        vertical-align: middle;
        padding-right: 10px;
      }
      span{
        vertical-align: middle;
        font-size: 24px;
        color: #fff;
        font-weight: bold;
      }
    }
    .login-main{
      width: 855px;
      height: 417px;
      border-radius: 3px;
      padding: 83px 75px 0 100px;
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 0 18px rgba(0,0,0,.3);
      .main-left{
        float: left;
        margin-right: 172px;
      }
      .main-right{
        float: left;
        .login-title{
          font-size: 20px;
          line-height: 54px;
          text-align: center;
        }
        .login-form{
          width: 314px;
          padding-top: 24px;
          .el-form-item{
            border: 1px solid #ccc;
            border-radius: 3px;
            margin-bottom: 30px;
            height: 38px;
            .el-form-item__label{
              text-align: left;
              padding-left: 10px;
            }
            .el-form-item__content{
              line-height: 37px;
            }
            .el-input__inner{
              border: none;
              height: 37px;
              padding: 0
            }
            &.btn{
              border: none;
              .submit-btn{
                width: 100%;
                color: #fff;
                background: #33c27c;
                border-color: #33c27c;
                box-shadow:  0 8px 20px rgba(2,187,97,.3);
              }
              
            }
          }
        }
      }
    }
    .el-form-item__content .el-input-group, .el-form-item__label, .el-tag .el-icon-close {
        vertical-align: top;
    }
    .el-input-group__append{
      border: none;
      padding: 0 10px;
      // background: #fff;
    }
    // .login-wrap{
    //   height: 300px;
    //   width: 100%;
    //   position: absolute;
    //   left: 0;
    //   top: 50%;
    //   margin-top: -220px;
    //   text-align: center;
    //   h3{
    //     font-size: 40px;
    //     color: #fff;
    //     line-height: 100px;
    //     font-weight: normal;
    //   }
    //   .el-form{
    //     width: 300px;
    //     display: inline-block;
    //     .el-form-item__label{
    //       color: #fff;
    //     }
    //   }
    //   .el-input,.el-button{
    //     width: 300px;
    //   }
    // }
    // .submit-btn{
    //   background: #e97417;
    //   border-color: #e97417;
    //   color: #fff;
    // }
    // .radio{
    //   text-align: left;
    //   .el-checkbox{
    //     color: #fff;
    //     span{
    //       border-radius: 1px;
    //     }
    //     .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    //       border-color: red;
    //       background: red;
    //     }
    //     .el-checkbox__input.is-checked+.el-checkbox__label{
    //       color: #fff;
    //     }
       
    //   }
    // }
    
  }
 
 
</style>
