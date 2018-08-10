<template>
  <div class="roleedit">
    <p class="title">
      <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item :to="{ path: '/role'}"><i class="icon-left-arrow"></i>角色管理 </el-breadcrumb-item>
        <el-breadcrumb-item><span v-if="$route.params.target=='edit'">修改</span><span v-if="$route.params.target=='new'">新建</span>角色</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <div class="form">
      <el-form ref="form" :model="role"  label-width="80px" style="width:60%;float: left; border-right:1px solid #ccc;margin-right: 20px;">
        <el-form-item label="角色名称">
          <el-input v-model="roles.Name" @input="checkForm"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="roles.Code" :disabled="$route.params.target == 'edit'"  @input="checkForm"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="roles.Description"  @input="checkForm"></el-input>
        </el-form-item>
        <el-form-item label="权限" class="rules">
            <el-tree
              :data.sync="data"
              show-checkbox
              node-key="Code"
              :default-checked-keys="defaultKeys"
              default-expand-all
              :props="defaultProps"
              :expand-on-click-node="true"
              ref="tree"
              @node-click="showIcon"
              @check="RoleCheckChange" 
              v-if="data.length"
              >
              <!-- <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span class="icon" v-if="data.isShowIcon">
                  <i class="el-icon-edit" @click.stop="edit(data)"></i>
                  <i class="el-icon-plus" @click.stop="append(data)"></i>
                  <i class="el-icon-close" @click.stop="remove(node, data)"></i>
                </span>
              </span> -->
            </el-tree>
        </el-form-item>
        <!-- <el-form-item label="" label-width="80px">
          <el-button @click="addRoot" style="margin-left:0;">添加一级权限</el-button>
        </el-form-item> -->
        <el-form-item style="text-align: center;" class="rules">
          <el-button type="primary" class="search-btn" @click="addAndEditRole" :disabled="isCheckForm">提交</el-button>
          <el-button type="info" class="export" @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
      <div class="desc" style="width: 30%; float: left">
        <p>权限名称: {{rule.name}}</p> 
        <p>权限描述: {{rule.desc}}</p> 
      </div>
    </div>
    <!-- 添加修改权限 -->
    <!-- <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" >
      <el-form :model="form">
        <el-form-item label="编码" label-width="100px">
          <el-input v-model="form.Code" :disabled="codeDisabled"></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="100px">
          <el-input v-model="form.Name"></el-input>
        </el-form-item>
        <el-form-item label="父级" label-width="100px">
          <el-input v-model="form.ParentName" :disabled="parentDisabled"></el-input>
        </el-form-item>
        <el-form-item label="序号" label-width="100px">
          <el-input v-model="form.SortID" ></el-input>
        </el-form-item>
        <el-form-item label="URL地址" label-width="100px">
          <el-input v-model="form.UiUrl" ></el-input>
        </el-form-item>
        <el-form-item label="有效" label-width="100px">
          <el-checkbox v-model="form.Valid" ></el-checkbox>
        </el-form-item>
        <el-form-item label="叶节点" label-width="100px">
          <el-checkbox v-model="form.IsLeaf" ></el-checkbox>
        </el-form-item>
        <el-form-item label="类型" label-width="100px">
          <el-radio-group v-model="form.OperationType">
            <el-radio :label="0">菜单</el-radio>
            <el-radio :label="1">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="超级管理员" label-width="100px">
          <el-checkbox v-model="form.IsSystem" ></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="submit">确 定</el-button>
        <el-button class="export" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import qs from 'qs';
  import { mapState } from 'vuex';
  import Request from '../assets/request'
  export default {
    name: 'Role',
    data() {
      return {
        defaultKeys:[],
        isCheckForm: true,
        CheckArr:[],
        baseForm:{
          Code:null,
          Description:null,
          IsLeaf:false,
          IsSystem:false,
          OperationType:0,
          ParentID:null,
          SortID:null,
          UiUrl:null,
          Url:null,
          Valid:false,
          Name:null,
          ChildrenOperation: [] 
        },
        form:{
          Code:null,
          Description:null,
          IsLeaf:false,
          IsSystem:false,
          OperationType:0,
          ParentID:null,
          SortID:null,
          UiUrl:null,
          Url:null,
          Valid:false,
          Name:null,
          ChildrenOperation: [] 
        },
        defaultProps: {
          children: 'ChildrenOperation',
          label: 'Name',
        },
        data:[],
        dialogTitle: '添加权限',
        // dialogVisible: false,
        codeDisabled: false,
        parentDisabled: true,
        rule:{
          name:'',
          desc:''
        },
        roles:{
          Code:'',
          ID:0,
          Name:'',
          Description:'',
          Valid:true
        }
      }
    },
    
    created(){
      var target = this.$route.params.target
      if(target == 'edit'){
        this.roles = this.role;
      }
      this.getRules();
      
    },
    methods:{
      checkForm(){
        let Name = this.roles.Name.replace(/\s/g,'')
        let Description = this.roles.Description.replace(/\s/g,'')
        if(Name && Description && this.CheckArr.length){
          this.isCheckForm = false;
        }else{
          this.isCheckForm = true;
        }

      },
      RoleCheckChange(data, checked){

        this.CheckArr = checked.checkedKeys.concat(checked.halfCheckedKeys);
        this.checkForm()

      },
      // 获取修改的角色权限
      getEditRole(resolve){
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          rolecode: this.role.Code,
        }
        let option = {
            type:'get',
            api: 'api/Account/GetRoleInfo',
            query: query,
          }
          Request(option, function(res){
            if(res.data.ResultType == 0){
              var allRoles = res.data.AppendData.OperationList;
              var check = [];
              for(var i = 0 ; i < allRoles.length ; i++){
                  for(var j = 0 ; j < allRoles[i].ChildrenOperation.length ; j++){
                    var childs = allRoles[i].ChildrenOperation
                    if(childs[j].IsSelected){
                      check.push(childs[j].Code)
                    }
                  }
              }
              that.CheckArr = check;
              that.checkForm();
              resolve(check)
            }else{
              this.$message.error(res.data.Message)
            }
      
          })
      },

      // 添加 修改角色
      addAndEditRole(){
        if(this.$route.params.target == 'new'){
          this.addRole()
        }else if(this.$route.params.target == 'edit'){
          this.editRole();
        }
          
      },
      //添加角色
      addRole(){
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        let data = {
          "ID": this.roles.Id,
          "Code": this.roles.Code,
          "Name": this.roles.Name,
          "Description": this.roles.Description,
          "AccountCount": null,
          "Valid": true,
          "OperationList":this.CheckArr
        }
        let option = {
          type:'post',
          api: '/api/Account/AddRole',
          query: query,
          data: qs.stringify(data)
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.$message({
              message:res.data.Message,
              type:'success'
            })
            setTimeout(()=>{ that.$router.go(-1);},that.backTime)
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
        })
      },
      // 修改角色
      editRole(){
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        let data = {
          "ID": this.roles.ID,
          "Code": this.roles.Code,
          "Name": this.roles.Name,
          "Description": this.roles.Description,
          "AccountCount": this.roles.AccountCount,
          "Valid": this.roles.Valid,
          "OperationList":this.CheckArr
        }

        let option = {
          type:'post',
          api: '/api/Account/EditRole',
          query: query,
          data: qs.stringify(data)
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
            that.$router.go(-1);
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
        })
      },

      //获取权限
      getRules(){
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        let option = {
          type:'get',
          api: '/api/Account/GetOperationItem',
          query: query,
        }
        Request(option, function(res){

          if(res.data.ResultType == 0){
            let resData = res.data.AppendData;
            resData = JSON.parse(JSON.stringify(resData));
            
            //递归 添加isShowIcon
            function parseJson1(jsonObj){
              for(var i = 0 ; i < jsonObj.length; i++){
                var p = jsonObj[i];
                for(var key in p){
                  p.isShowIcon =false;
                  p.Name = p.label;
                  // p.Description = 'assdsdsdfdsf';
                  if (p[key] && p[key].length > 0 && typeof(p[key]) == "object") {
                    parseJson1(p[key])
                  }
                }
              }
              return jsonObj;
            }


            if(that.$route.params.target == 'edit'){
              new Promise(function(resolve, reject){

                  that.getEditRole(resolve)
              }).then(function(check){

                that.defaultKeys = check;
                that.data = parseJson1(resData);
              })
            }else{
              that.data = parseJson1(resData);
            }
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
    
        })
      },
      addRoot(){
        this.dialogTitle = '添加权限';
        this.dialogVisible = true;
        this.codeDisabled = false;
        this.parentDisabled = true;
        this.form.IsLeaf = true;
        this.form.ParentID = 0;
        this.form.ParentName = '根节点';
      },
      // 修改权限弹窗
      edit(data){
        this.dialogTitle = '修改权限';
        this.dialogVisible = true;
        this.codeDisabled = true;
        this.parentDisabled = true;
        this.form = data;
        this.form.ParentID = data.id;
        this.form.ParentName = data.Name;
      },
      // 添加权限弹窗
      append(data){
        this.dialogTitle = '添加权限';
        this.dialogVisible = true;
        this.codeDisabled = false;
        this.parentDisabled = true;
        this.form.ParentID = data.id;
        this.form.ParentName = data.Name;
      },
      // 添加/修改权限
      submit() {
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        //添加权限
        if(this.dialogTitle == '添加权限'){
          that.form.ID = 0;
          let option = {
            type:'post',
            api: '/api/Account/AddOperation',
            query: query,
            data: qs.stringify(that.form)
          }
          Request(option, function(res){
            that.dialogVisible = false;
            if(res.data.ResultType == 0){
              that.$refs.tree.append(that.form,that.form.ParentID)
              that.$message({
                message: res.data.Message,
                type: 'success'
              })

            }else{
              that.$message.error(res.data.Message)
            }
            that.form = that.baseForm
          })
        }else if(this.dialogTitle == '修改权限'){
          let option = {
            type:'post',
            api: '/api/Account/EditOperation',
            query: query,
            data: qs.stringify(that.form)
          }
          Request(option, function(res){
            that.dialogVisible = false;
            if(res.data.ResultType == 0){
              that.$message({
                message: res.data.Message,
                type: 'success'
              })
            }else{
              that.$message.error(res.data.Message)
              if(res.data.Message == '身份验证失败'){
                that.$storage.clearStorage();
                setTimeout(()=>{that.$router.replace('/')},that.backTime)
              }
            }
            that.form = that.baseForm
          })
        }
      },

      //删除权限
      remove(node, data) {
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        data.Valid = 0;
        let option = {
          type:'post',
          api: 'api/Account/EditOperation',
          query: query,
          data: qs.stringify(data)
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.$refs.tree.remove(data.id)
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
                that.$storage.clearStorage();
                setTimeout(()=>{that.$router.replace('/')},that.backTime)
              }
          }
        })
      },
      showIcon(data){

        this.rule.name = data.label;
        this.rule.desc = data.Description;
        parseJson1(this.data)
        //递归 处理每次点击只出现对应的图标
        function parseJson1(jsonObj){
          for(var i = 0 ; i < jsonObj.length ; i++){
            var p = jsonObj[i];
            for(var key in p){
              p.isShowIcon = false;
  
              if (!p.IsLeaf && p[key] && typeof(p[key]) == "object") {
                parseJson1(p[key])
              }
            }
          }
        }

        data.isShowIcon = true;
      },

    },
    computed:{
      ...mapState(['token']),
      ...mapState({
          role:function(state){
            if(!state.role){
              let role= JSON.parse(this.$storage.getStorage('role'));
              this.$store.state.role = role;
            }
            return state.role;
          },
         
        }),
      ...mapState({
          defaultMenu:function(state){
            if(!state.defaultMenu){
              let defaultMenu = JSON.parse(this.$storage.getStorage('defaultMenu'));
              this.$store.state.defaultMenu = defaultMenu;
            }
            return state.defaultMenu;
          },
         
        })
    }
  }
</script>

<style lang="scss" type="text/css">
   @import '../assets/public.css';
.roleedit{
  width: 100%;
  // .el-form{
  //   padding-top: 20px;
  // }
  .el-input,.el-textarea{
    width: 80%;
  }
  .el-button{
    width: 160px;
    margin-left: -120px;
  }
  .el-button+.el-button{
    margin-left: 80px;
  }
  /* .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
    padding-left: 14px;
  }
  .el-table_1_column_2.el-table-column--selection {
    border-right: none;
  }
  .el-table_1_column_3 .cell{
    padding-left: 0!important;
  }
  .el-table td, .el-table th {
    padding: 8px 0;
  } */

  .el-dialog .el-input{
    width: 100%;
  }
  
  .form{
    width: 100%;
    overflow: hidden;
    // padding-left: 0;
    box-sizing:border-box;
    .desc{
      padding-top: 100px;
      padding-left: 100px;
      box-sizing:border-box;
    }
    .el-checkbox{
      margin-top: 0;
    }
  }
  .rules{
    // width: 60%;
  }
  .el-tree-node__content{
    height: 30px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
 
    // box-sizing:border-box;
    .icon{
      float: right;
      i{
        font-size: 20px;
        margin: 0 10px;
      }
    }
  }
}


  
</style>