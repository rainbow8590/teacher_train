<template>
  <div class="account">
    <p class="title">
      <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item><i class="icon-left-arrow"></i>账号管理</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <div class="search">
      <el-form>
        <el-form-item label="学部" label-width="40px">
          <el-select v-model="form.selectXueBu" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in XueBu"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" label-width="40px">
          <el-select v-model="form.selectXueKe" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in XueKe"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" label-width="40px">
          <el-select v-model="form.selectRole" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in Roles"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="40px">
          <el-select v-model="form.selectValid" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in AccountStatus"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-button class="search-btn" @click="search">搜索</el-button>
          <el-button class="search-btn" @click="newAccountDialog">新建账号</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData">
        <el-table-column prop="Name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="Email" label="账号"></el-table-column>
        <el-table-column prop="RoleName" label="角色" width="180"></el-table-column>
        <el-table-column prop="XueBuName" label="学部" width="180"></el-table-column>
        <el-table-column prop="XueKeName" label="学科" width="180"></el-table-column>
        <el-table-column prop="ValidName" label="状态" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" style="cursor:pointer;" @click="EditAccountDialog(scope.$index)">修改</el-button>
            <el-button size="mini" style="cursor:pointer;" @click="DeleteAccountDialog(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span> {{pageNum}}/ {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
    <!-- 添加/修改弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form1">
       <!--  <el-form-item label="账号">
          <el-input v-model="form1.account" placeholder=""></el-input>
        </el-form-item> -->
        <el-form-item label="姓名">
          <el-input v-model="form1.Name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="邮箱" >
          <el-input v-model="form1.Email1" placeholder="" style="width: 200px" :disabled="btnTarget=='edit'"></el-input>@gaosiedu.com
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form1.RoleCode" placeholder="请选择">
            <el-option
              v-for="item in Roles"
              :key="item.Code"
              :label="item.Name"
              :value="item.Code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form1.Valid" placeholder="请选择">
            <el-option
              v-for="item in Valids"
              :key="item.id"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学部">
          <el-checkbox v-model="checkAll1" :checked="checkAll1" true-label="true" false-label="false" @change="xueBuCheckAllChange">全部</el-checkbox>
          <el-checkbox-group 
            v-model="form1.XueBu" @change="xueBuCheckChange">
            <el-checkbox v-for="xuebu in XueBu" :label="xuebu.id" :key="xuebu.id" :checked="btnTarget=='new'?isInArray(form1.XueBu,xuebu.id):false">{{xuebu.value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="学科">
          <el-checkbox v-model="checkAll2"  :checked="checkAll2" true-label="true" false-label="false" @change="xueKeCheckAllChange">全部</el-checkbox>
          <el-checkbox-group 
            v-model="form1.XueKe" @change="xueKeCheckChange">
            <el-checkbox v-for="xueke in XueKe" :label="xueke.id" :key="xueke.id"  :checked="btnTarget=='new'?isInArray(form1.XueKe,xueke.id):false">{{xueke.value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search-btn"  @click="submit">确 定</el-button>
        <el-button class="export" @click="dialogFormVisible = false,checkAll1=false,checkAll2=false">取 消</el-button>
      </div>
    </el-dialog>
    
    <!-- 删除弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确认删除该角色?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="sure">确 定</el-button>
        <el-button class="export" @click="giveup">取 消</el-button>
      </span>
    </el-dialog>
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
       dialogVisible: false, // 控制删除弹窗
       selectIndex: 0, //点击了第几行
       dialogFormVisible:false,//控制修改弹窗
       // isIndeterminate1: true,
       // isIndeterminate2: true,
       checkAll1:false,
       checkAll2:false,
       dialogTitle:'',
       form:{ 
         Name: null,
         selectXueKe: null,
         selectXueBu: null,
         selectRole: null,
         selectValid:null,
       },
       Name: null,
       selectXueKe: -1,
       selectXueBu: -1,
       selectRole: null,
       selectValid:null,

       form1:{
        Code:'',
        Name:'',
        Email:'',
        Email1:'',
        RoleCode:'',
        Valid:'',
        XueBu:[],
        XueKe:[]
       },
       XueBu:[
         // {id: -1, value:'全部'},
         {id: 1, value:'小学'},
         {id: 2, value:'初中'},
         {id: 3, value:'高中'},
       ],
       XueKe:[
        // {id: -1, value: "全部"},
        {id: 1, value: "数学"},
        {id: 2, value: "语文"},
        {id: 3, value: "英语"},
        {id: 4, value: "物理"},
        {id: 5, value: "化学"},
        {id: 7, value: "生物"},
        {id: 15, value: "历史"},
        {id: 17, value: "地理"},
        {id: 18, value: "思想品德政治"}
       ],
       Roles:[],
       Valids:[{id:true, value:'启用'},{id:false, value:'停用'}],
       AccountStatus: this.AccountStatus,
       tableData:[],
       dataTotalNum:0,
       pageNum:1,
       pageTotal:0,
       ajaxOver:true,
       btnTarget:'new'
      }


    },
    created(){
      this.getRoles();
      // this.XueBu = this.$storage.getStorage('XueBu');
      // this.XueKe = this.$storage.getStorage('XueKe');
      if(this.$route.path == '/account'){
        this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
      }else{
        this.pageNum =1
      }
      
      this.getCountList(this.pageNum);
    },
    methods:{
      // 学部 全选
       xueBuCheckAllChange(val) {
        console.log(val)
        this.$set(this.form1, 'XueBu', val=='true'? [1,2,3]:[])
        // this.isIndeterminate1 = false;
      },
      // 学科 全选
       xueKeCheckAllChange(val) {
        console.log(val)
        this.$set(this.form1, 'XueKe', val=='true'? [1,2,3,4,5,7,15,17,18]:[])
        // this.isIndeterminate2 = false;
      },
      xueBuCheckChange(val){
        if(val.length == this.XueBu.length){
          this.checkAll1 = true;
        }else{
          this.checkAll1 = false;
        }
        
      },
      xueKeCheckChange(val){
        if(val.length == this.XueKe.length){
          this.checkAll2 = true;
        }else{
          this.checkAll2 = false;
        }
      },
     
      // 点击 修改 按钮
      EditAccountDialog(index) {
        this.checkAll1 = false
        this.checkAll2 = false
        this.dialogTitle = '修改账号';
        this.selectIndex = index;
        this.btnTarget = 'edit';
        this.$set(this.form1,'Code' , this.tableData[index].Code)
        this.$set(this.form1,'Name' , this.tableData[index].Name)
        this.$set(this.form1,'Email' , this.tableData[index].Email)
        this.$set(this.form1,'Email1' , this.tableData[index].Email1)
        this.$set(this.form1,'RoleCode' , this.tableData[index].RoleCode)
        this.$set(this.form1,'Valid' , this.tableData[index].Valid)
        this.$set(this.form1,'XueBu' , this.distinct(isArray(this.tableData[index].XueBu)))
        this.$set(this.form1,'XueKe' , this.distinct(isArray(this.tableData[index].XueKe)))
        this.$set(this.form1,'Email1' ,this.form1.Email.substr(0,this.form1.Email.indexOf('@')))

        

        if(this.tableData[index].XueBu.length  == this.XueBu.length){
          this.checkAll1 = true
        }
        console.log(this.tableData[index].XueKe.length)
        console.log(this.XueKe.length)
        if(this.tableData[index].XueKe.length  == this.XueKe.length){
          this.checkAll2 = true
        }

        this.dialogFormVisible = true;

        console.log(this.checkAll1)
        console.log(this.checkAll2)
        // //检测是不是数组
        function isArray(arr){
          if(typeof arr == 'string'){
            arr = arr.split(',')
            console.log(arr)
          }
          return arr;
        }
        
      },
      // 点击删除按钮
      DeleteAccountDialog(index, row) {
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
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          code:this.tableData[this.selectIndex].Code
        }
        let option = {
          type:'get',
          api: '/api/Account/DeleteAccount',
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
            that.tableData.splice(that.selectIndex,1)
            //重新计算页码
            that.dataTotalNum--;
            that.pageTotal = Math.ceil(that.dataTotalNum / that.pageSize);
            if(that.tableData.length == 0){
              that.pageNum = that.pageTotal;
              that.getCountList(that.pageNum)
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
      //搜索
      search(){
        this.pageNum = 1;

        if(this.form.selectXueBu){
          this.selectXueBu = this.form.selectXueBu;
        }else{
          this.selectXueBu = -1
        }
        if(this.form.selectXueKe){
          this.selectXueKe = this.form.selectXueKe;
        }else{
          this.selectXueKe = -1
        }
        if(this.form.selectValid){
          this.selectValid = this.form.selectValid;
        }else{
          this.selectValid = null
        }
        if(this.form.selectRole){
          this.selectRole = this.form.selectRole;
        }else{
          this.selectRole = null
        }
        if(this.form.Name){
          this.Name = this.form.Name;
        }else{
          this.Name = null
        }

        this.getCountList(this.pageNum)
      },
      // 获取账号列表
      getCountList(pageNum){
        let that = this;
        if(this.ajaxOver == false) return;
        const loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.ajaxOver == false;
        that.tableData = [];
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          name:this.Name,
          xuebu:this.selectXueBu,
          xueke:this.selectXueKe,
          valid:this.selectValid,
          rolecode:this.selectRole,
          pagesize: this.pageSize,
          pageindex:pageNum,
        }

       
        let option = {
          type:'get',
          api: '/api/Account/GetAccountList',
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            let resData = res.data.AppendData.DataList;
            
            for(let i = 0 ; i < resData.length; i++){
              let now = resData[i];
              if(now.XueKeName){
                that.$set(now,'XueKe',now.XueKe?now.XueKe.split(','):null)
                that.$set(now,'XueKeName',now.XueKeName.split(',').join(' '))
              }
              if(now.XueBuName){
                that.$set(now,'XueBu',now.XueBu?now.XueBu.split(','):null)
                that.$set(now,'XueBuName',now.XueBuName.split(',').join(' '))
              }
            }
            //判断checkAll 的状态
            that.tableData = resData;
            //计算页码
            that.pageNum = that.tableData.length==0? 0:res.data.AppendData.PageIndex;
            that.dataTotalNum = res.data.AppendData.TotalCount;
            that.pageTotal = Math.ceil(that.dataTotalNum / that.pageSize);
      
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
          this.pageNum =1;
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getCountList(this.pageNum)
      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getCountList(this.pageNum)
      },
      newAccountDialog(e){
        this.btnTarget = 'new';
        this.dialogTitle = '添加账号';
        this.dialogFormVisible = true;
        this.form1 = {
        Code:'',
        Name:'',
        Email:'',
        Email1:'',
        RoleCode:'',
        Valid:'',
        XueBu:[],
        XueKe:[]
       }
      },
      submit(){
        if(this.btnTarget == 'new'){
          this.submitAccount()
        }else{
          this.editAccount()
        }
      },
      // 添加账号
      submitAccount(){
        // if(this.ajaxOver == false) return;
        // Loading.service({ fullscreen: true });
        // this.ajaxOver == false;

        this.dialogFormVisible = false;
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }

        this.form1.Email = this.form1.Email1 +'@gaosiedu.com',
        this.form1.XueBu = this.form1.XueBu.join(',')
        this.form1.XueKe = this.form1.XueKe.join(',')

        var xuebu = this.form1.XueBu.split(',')
        var xueke = this.form1.XueKe.split(',')

        let option = {
          type:'post',
          api: '/api/Account/AddAccount',
          query: query,
          data: qs.stringify(this.form1)
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
            //修改tableData
            that.form1.XueBuName=''
            that.form1.XueKeName=''
            pinjie(that.XueBu,xuebu,'XueBuName')
            pinjie(that.XueKe,xueke,'XueKeName')
            function pinjie(base,son,key){
              for(var i = 0 ; i < base.length; i++){
                for(var k = 0 ; k < son.length; k++){
                  if( son[k] == base[i].id){
                    that.form1[key] +=base[i].value+','
                  }
                }
              }
            }
            that.form1.XueBuName.split(',').join(' ')
            that.form1.XueKeName.split(',').join(' ')

            if(that.tableData.length<5){
              that.tableData.push(that.form1)
            }else{
              that.tableData = [];
              that.tableData.push(that.form1)
              that.pageTotal++;
              that.pageNum = that.pageTotal;
            }
            that.getCountList(that.pageNum)
            //重新计算
            that.dataTotalNum++;
            that.pageTotal = Math.ceil(that.dataTotalNum / that.pageSize);
            // setTimeout(()=>{
            //   that.ajaxOver = true;
            //   Loading.service({ fullscreen: true }).close();
            // },500)
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
                that.$storage.clearStorage();
                setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
        })
      },
      //修改账号
      editAccount(){
        this.dialogFormVisible = false;
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }

        this.form1.XueBu = (this.distinct(this.form1.XueBu)).join(',')
        this.form1.XueKe =  (this.distinct(this.form1.XueKe)).join(',')
        var xuebu = this.form1.XueBu.split(',')
        var xueke = this.form1.XueKe.split(',')

        console.log(this.form1)
        let option = {
          type:'post',
          api: '/api/Account/EditAccount',
          query: query,
          data: qs.stringify(this.form1)
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
            //修改tableData
            that.form1.XueBuName=''
            that.form1.XueKeName=''
            pinjie(that.XueBu,xuebu,'XueBuName')
            pinjie(that.XueKe,xueke,'XueKeName')
            function pinjie(base,son,key){
              for(var i = 0 ; i < base.length; i++){
                for(var k = 0 ; k < son.length; k++){
                  if( son[k] == base[i].id){
                    that.form1[key] +=base[i].value+','
                  }
                }
              }
            }

            for(var i = 0 ; i < that.Roles.length; i++){
                if(that.form1.RoleCode ==  that.Roles[i].Code){
                  that.form1.RoleName = that.Roles[i].Name
                }
            }

            // for(var i = 0 ; i < that.Valids.length; i++){
            
              if(that.form1.Valid == true){
                that.form1.ValidName = '有效'
              }else{
                that.form1.ValidName = '无效/禁用'
              }
            // }


            that.form1.XueBuName.split(',').join(' ')
            that.form1.XueKeName.split(',').join(' ')
            // that.tableData[that.selectIndex] = that.form1;
            that.$set(that.tableData[that.selectIndex],'Name',that.form1.Name)
            that.$set(that.tableData[that.selectIndex],'Email1',that.form1.Email1)
            that.$set(that.tableData[that.selectIndex],'Email',that.form1.Email1+'@gaosiedu.com')
            that.$set(that.tableData[that.selectIndex],'RoleCode',that.form1.RoleCode)
            that.$set(that.tableData[that.selectIndex],'RoleName',that.form1.RoleName)
            that.$set(that.tableData[that.selectIndex],'Valid',that.form1.Valid)
            that.$set(that.tableData[that.selectIndex],'ValidName',that.form1.ValidName)
            that.$set(that.tableData[that.selectIndex],'XueBu',that.form1.XueBu)
            that.$set(that.tableData[that.selectIndex],'XueBuName',that.form1.XueBuName.split(',').join(' '))
            that.$set(that.tableData[that.selectIndex],'XueKe',that.form1.XueKe)
            that.$set(that.tableData[that.selectIndex],'XueKeName',that.form1.XueKeName.split(',').join(' '))

           
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
      getRoles(){
        let that = this;
        let query = {
          pagesize: 100,
          pageindex: 1,
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
          if(res.data.ResultType == 0){
            that.Roles = res.data.AppendData.DataList;
            // that.$storage.setStorage('Roles',)
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
        })
      },
      // 数组中是否有某个元素
      isInArray(arr,value){
          for(var i = 0; i < arr.length; i++){
              if(Number(value) == arr[i]){
                  return true;
              }
          }
          return false;
      },
      //数组去重
      distinct (arr){

        var len = arr.length;
        // 去掉逗号字符串
        for(var i = 0 ; i < arr.length; i++){
          if(arr[i] == ''){
            arr.splice(i,1);
          }else{
            arr[i] = Number(arr[i])
          }
        }
        arr.sort(function(a,b){  //对数组进行排序才能方便比较
          return a - b;
        })
        function loop(index){
          if(index >= 1){
            if(arr[index] == arr[index-1]){
              arr.splice(index,1);
            }
            loop(index - 1); //递归loop函数进行去重
          }
        }
        loop(len-1);
        return arr
      },
    },

    computed:{
      ...mapState(['token']),
    },
    beforeDestroy(){
      // 离开这个组件的时候 将pageNum 改为1
      this.$storage.setStorage('pageNum',1)
    }
  }
</script>

<style lang="scss" type="text/css">
   @import '../assets/public.css';
  .account{
    width: 100%;
    .table .el-button{
    width: 60px;
  }
  .el-dialog {
    width: 30%;
    .el-form-item{
      display: block;
      margin-bottom: 12px;
      .el-input,.el-select{
        width: 80%;
      }
      .el-select .el-input{
        width: 100%;
      }
    }
    .el-checkbox{
      margin-left: 0;
      margin-right: 30px;
      margin-top: 0;
    }
    .el-form-item__content{
      padding-left: 40px;
    }
  }
  
  .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
  }  
  }
</style>