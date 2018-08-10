<template>
  <div class="role">
    <p class="title">
      <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item><i class="icon-left-arrow"></i>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <p class="new-btn"><el-button class="search-btn" @click="newRole('new')">新建角色</el-button></p>
    <div class="table">
      <el-table
        :data="tableData">
        <el-table-column
          prop="Name"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="Description"
          label="角色职能">
        </el-table-column>
        <el-table-column
          prop="AccountCount"
          label="关联账号数量"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button size="mini" style="cursor:pointer;" @click="handleEdit('edit',scope.$index)" >修改</el-button>
            <el-button size="mini" style="cursor:pointer;" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
    <!-- 删除弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确认删除该角色?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="sure">确 定</el-button>
        <el-button class="export"@click="giveup">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import qs from 'qs'
  import { mapState } from 'vuex';
  import { Loading } from 'element-ui';
  import Request from '../assets/request'
  export default {
    inject:  ['reload'],
    name: 'Role',
    data() {
      return {
       dialogVisible: false,
       selectIndex:0,
       pageNum:0, //子页码
       pageTotal:0, // 总页码
       dataTotalNum:0,
       ajaxOver:true, // 翻页请求是否完成
       tableData:[]
      }
    },
    beforeRouteEnter: (to, from, next) => {
      console.log(from)
      window.VueObj =new Vue({
          data:{
            RouterFrom:from.fullPath
          }
      })
      next()
    },
    beforeRouteLeave:(to, from, next) => {
   
      if(to.fullPath == '/roleedit/new'){
        next(()=>{
          this.$storage.setStorage('pageNum',this.pageNum)
        });
      }else{
        next(()=>{
          this.$storage.setStorage('pageNum',1)
        });
      }
    },
    created(){
      let routerFrom = window.VueObj.RouterFrom
      console.log(routerFrom)

      if( routerFrom == '/'|| routerFrom == '/roleedit/new' ){
        this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
      }else{
        this.pageNum = 1
      }
      this.getRoles(this.pageNum);
    },
    methods:{
      handleEdit(target,index){
        this.$store.commit('$_setStorage',{key:'role',value:this.tableData[index]})
        this.$router.push({name:'RoleEdit',params:{target:target}})
      },
      newRole(target){
        this.$store.commit('$_setStorage',{key:'role',value:null})
        this.$router.push({name:'RoleEdit',params:{target:target,pageNum: this.pageNum}})
      },
       // 点击删除按钮
      handleDelete(index, row) {
        this.dialogVisible = true;
        this.selectIndex = index;
      },
      // 取消删除
      giveup(){
        this.dialogVisible = false;
      },
      // 确认删除
      sure(){
        this.dialogVisible = false;
        // this.tableData.splice(this.selectIndex,1)
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          rolecode: this.tableData[this.selectIndex].Code
        }
        // let data = this.tableData[this.selectIndex];
        // delete data.ID; 
        // data.Valid = 0;

        let option = {
          type:'get',
          api: 'api/Account/DeleteRole',
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
            that.tableData.splice(that.selectIndex,1)
            if(that.tableData.length < that.pageSize){
              console.log(12212)
              that.reload();
            }else{
              //重新计算页码
              that.dataTotalNum--;
              that.pageTotal = Math.ceil(that.dataTotalNum / that.pageSize);
              if(that.tableData.length == 0){
                that.pageNum = that.pageTotal;
                that.getRoles(that.pageNum)
              }
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
      // 获取角色
      getRoles(pageNum){
        if(this.ajaxOver == false) return;
        // 加载图标
        const loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.ajaxOver == false;
        this.tableData = [];
        let that = this;
        let query = {
          pagesize:this.pageSize,
          pageindex:pageNum,
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        let option = {
          type:'get',
          api: '/api/Account/GetRoleList',
          query: query,
        }
        Request(option, function(res){
          console.log(res.data.AppendData.DataList)
          if(res.data.ResultType == 0){
            that.tableData = res.data.AppendData.DataList;
            // 计算页码
            that.dataTotalNum = res.data.AppendData.TotalCount;
            that.pageNum = that.tableData.length==0? 0:res.data.AppendData.PageIndex;
            that.pageTotal = res.data.AppendData.PageCount;
            
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
          that.ajaxOver = true;
          loading.close();
        })
      },
      // 上一页
      prevPage(){
        this.pageNum--;
        if(this.pageNum<1){
          this.pageNum = 1;
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getRoles(this.pageNum)

      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getRoles(this.pageNum)
      },
    },
    computed:{
      ...mapState(['token'])
    },
    beforeDestroy(){
      // 离开这个组件的时候 将pageNum 改为1
      // this.$storage.setStorage('pageNum',1)
    },
  }
</script>

<style lang="scss" type="text/css">
   @import '../assets/public.css';
.role{
  width: 100%;
  .new-btn{
    margin-bottom: 30px;
    padding-left: 46px;
  }
  .table .el-button{
    width: 60px;
  }
  .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
}
  
</style>