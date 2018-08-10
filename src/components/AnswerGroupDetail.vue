<template>
  <div class="prejobrecorddetail">
    <p class="title">
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item v-if="$route.path == '/groupdetail/answergroupdetail'" :to="{ path: '/group/answergroup' }"><i class="icon-left-arrow"></i>答辩分组</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.path == '/groupdetail/examgroupdetail'" :to="{ path:'/group/examgroup' }"><i class="icon-left-arrow"></i>复试分组</el-breadcrumb-item>
      <el-breadcrumb-item>{{trainInfo.TrainName}}</el-breadcrumb-item>
    </el-breadcrumb>
    </p>
    <p class="group">
      <span class="sp"><i class="icon-people-no"></i>待分组: {{groupInfo.WaitGroup}}人</span>
      <span class="sp"><i class="icon-people-ok"></i>已分组: {{groupInfo.AreadyGroup}}人</span>
      <el-button class="search-btn" @click="newGroup">新建分组</el-button>
      <el-button class="export" @click="exportInfos">导出分组名单</el-button>
    </p>

    <div class="table">
      <el-table
        :data="groupInfo.GroupRecord">
        <el-table-column
          prop="Address"
          :label="$route.path == '/groupdetail/answergroupdetail'?'答辩地点':'复试地点'"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="XueBuName"
          label="学部"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="PeopleCount"
          :label="$route.path == '/groupdetail/answergroupdetail'?'答辩人数':'复试人数'"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="FuTime"
          :label="$route.path == '/groupdetail/answergroupdetail'?'答辩时间':'复试时间'"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="Memo"
          label="备注">
        </el-table-column>
      </el-table>
    </div>
    
   <!-- <p class="page"> 共 55 条 <span> 上一页 </span>  2 / 5  <span> 下一页 </span> </p> -->
    <el-dialog title="新建分组" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item :label="$route.path == '/groupdetail/answergroupdetail'?'答辩地点':'复试地点'" label-width="120px">
          <el-input v-model="form.trainAddress" placeholder="请填写答辩地点，必填，最多填写20个字符" @input="check"></el-input>
        </el-form-item>
        <el-form-item label="学部" label-width="120px">
          <el-select v-model="form.selectXueBu" placeholder="请选择" @change="$route.path == '/groupdetail/answergroupdetail'?getXueKeStudentNum(form.selectXueBu,4):getXueKeStudentNum(form.selectXueBu,2)">
              <el-option
                v-for="item in XueBu"
                :key="item.value"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选择分组学员" label-width="120px">
          <div v-if="!xuekes.length">所选学部没有待分组学员</div>
          <div v-if="xuekes.length">
            <p class="option">已选择{{selectNum}}人, 剩余{{allCount-selectNum}}人</p>
            <p class="option" v-for="(xueke,index) in xuekes">{{xueke.XueKeName}}待分组{{xueke.PeopleCount}}人, 选取:
              <el-input type="number" :min="0" v-model="xueke.SelectNum" @input="getSelectNum(xueke.SelectNum,xueke.PeopleCount)" ref="inp"></el-input>
            </p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search-btn" :disabled="isDisabled" @click="submitGroup">确 定</el-button>
        <el-button class="export" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{msg}}</span>
      <div slot="footer" class="dialog-footer" v-if="msg != '创建分组成功'">
        <el-button class="search-btn" @click="sureGroup">确 定</el-button>
        <el-button class="export" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog> 
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import qs from 'qs';
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  export default {
    name: 'AnswerGroupDetail',
    inject:  ['reload'],
    data() {
      return {
        msg:'',
        dialogVisible: false,
        dialogFormVisible: false,
        isDisabled: true,
        ajaxOver:true,
        groupInfo:{},
        xuekes:[], 
        allCount:0,// 所有人数
        tableData: [],
        selectNum:0, // 选择人数
        form:{
          trainAddress:'',
          selectXueBu:'',
        }
      }
    },
    beforeRouteEnter: (to, from, next) => {
      window.VueObj =new Vue({
          data:{
            RouterFrom:from.fullPath
          }
      })
      next()
    },
    created(){
      this.init();
      this.AjaxAsRouter();
    },
    methods:{
      init(){
        let routerFrom = window.VueObj.RouterFrom;
        this.XueBu = this.$storage.getStorage('XueBu');
        for(var i = 0; i < this.XueBu.length; i++){
          if(this.XueBu[i].value == '全部'){
            this.XueBu.splice(i,1);
          }
        }
        
        // pageNum 要记录刷新时的pageNum 和初始化是的pageNum
        if( routerFrom == '/'){
          this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
        }else{
          this.pageNum = 1
        }
      },
      AjaxAsRouter(){

        if(this.$route.path == '/groupdetail/examgroupdetail'){ // 复试分组  二者公用
          this.getGroupList(2)
        }else if(this.$route.path == '/groupdetail/answergroupdetail'){ // 答辩分组 二者公用
          this.getGroupList(4)
        }
      },
      newGroup(){
        this.dialogFormVisible = true
      },
      submitGroup(e){
        // console.log(this.xuekes)
        this.dialogVisible = true;
        this.msg = '请检查信息是否准确，提交后本组学员将会收到短信通知！';
      },
      sureGroup(e){
        if(this.$route.path == '/groupdetail/answergroupdetail'){
          this.buildGroup(4)
        }else{
          this.buildGroup(2)
        }
      },
      // 计算输入的人数
      getSelectNum(e,max){console.log(e)
          this.selectNum = 0;
          if(this.ajaxOver == false) return;
          this.ajaxOver = false;
          if(e > max){
            this.$message({message:'超过该学科最多人数,请修改',type:"warming"})
            this.selectNum = 0;
            // this.allCount = 0;
            setTimeout(()=>{this.ajaxOver = true;},3000)
            return;
          }
          if(e < 0){
            this.$message({message:'选择人数不能为负数,请修改',type:"warming"})
            this.selectNum = 0;
            // this.allCount = 0;
            setTimeout(()=>{this.ajaxOver = true;},3000)
            return;
          }


          this.ajaxOver = true;
          for(let i = 0; i < this.xuekes.length; i++){
            this.selectNum += Number(this.xuekes[i].SelectNum)
          }
          this.check()
      },
      check(){
        if(this.form.trainAddress&&this.form.selectXueBu&&this.selectNum){
          this.isDisabled = false
        }else{
          this.isDisabled = true
        }
      },
      /* 复试 ====================================================================================================*/
      // 获取复试每期分组信息
      getGroupList(TrainType){
        let that = this;
        if(this.ajaxOver == false) return;
        this.ajaxOver == false;
        const loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          traincode:this.trainInfo.TrainCode,
          traintype:TrainType
        }
        let option = {
          type:'get',
          api: 'api/PreWorkSecond/GetGroupList',
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.groupInfo = res.data.AppendData;
            for(var i = 0; i < that.groupInfo.GroupRecord.length; i++){
              that.groupInfo.GroupRecord[i]['FuTime'] = that.groupInfo.GroupRecord[i]['FuTime'].replace('T',' ')
            }
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
      // 根据学部获取学科人数
      getXueKeStudentNum(xuebu,TrainType){
        let that = this;
        if(this.ajaxOver == false) return;
        this.ajaxOver == false;
        const loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          xuebu: xuebu,
          traincode:this.trainInfo.TrainCode,
          traintype:TrainType
        }
        let option = {
          type:'get',
          api: 'api/PreWorkSecond/GetNotGroup',
          query: query,
        }
        Request(option, function(res){
          that.allCount = 0;
          if(res.data.ResultType == 0){
            that.xuekes = res.data.AppendData;

            for(let i = 0; i < that.xuekes.length; i++){
              that.allCount += that.xuekes[i].PeopleCount
              that.xuekes[i]['SelectNum'] = null
            }
            
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
      // 导出
      exportInfos(){
        let path = this.$route.path;
        this.exportRecord();
        /*if(path == '/groupdetail/examgroupdetail'){
          this.exportRecord();
        }else{

        }*/
      },
      // 获取复试要导出的分组名单
      exportRecord(){
        let that = this;
        if(this.ajaxOver == false) return;
        this.ajaxOver == false;
        const loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          traincode:this.trainInfo.TrainCode
        }
        let option = {
          type:'get',
          api: 'api/PreWorkSecond/ExportGroup',
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.exportTableData = res.data.AppendData;
            const filterVal = ['StudentName','TrainName','Address', 'XueBuName','XueKeName', 'FuTime']
           
            if(that.$route.path == '/groupdetail/examgroupdetail'){
              const tHeader = ['姓名','复试名称','复试地点', '学部', '学科', '复试时间']
              ExportData(tHeader,filterVal,that.exportTableData,'复试分组名单')
            }else{
              const tHeader = ['姓名','答辩名称','答辩地点', '学部', '学科', '答辩时间']
              ExportData(tHeader,filterVal,that.exportTableData,'答辩分组名单')
            }

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
      //创建分组
      buildGroup(TrainType){
        let that = this;
        if(this.ajaxOver == false) return;
        this.ajaxOver == false;
        const loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        //处理学科数据
        for(var i = 0; i < this.xuekes.length; i++){
          for(var k in this.xuekes[i]){
            this.xuekes[i].PeopleCount = this.xuekes[i].SelectNum
          }
        }
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          traincode:this.trainInfo.TrainCode,
          traintype:TrainType
        }
        let data = {
          TrainCode: this.trainInfo.TrainCode,
          Address: this.form.trainAddress,
          XueBu: this.form.selectXueBu,
          CreateGroupItem: this.xuekes
        }
        let option = {
          type:'post',
          api: 'api/PreWorkSecond/CreateGroup',
          query: query,
          data: qs.stringify(data)
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.msg = '创建分组成功';
            that.reload();
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
          setTimeout(()=>{
            that.dialogVisible = false;
            that.dialogFormVisible = false;
          },1000)
          that.ajaxOver = true;
          loading.close();
        })
      },
      /* =========================================================================================================*/
    },
    computed:{
      ...mapState(['token']),
      ...mapState({
          trainInfo:function(state){
            if(!state.trainInfo){
              let trainInfo= JSON.parse(this.$storage.getStorage('trainInfo'));
              this.$store.state.trainInfo = trainInfo;
            }
            return state.trainInfo;
          },
         
        })
    },
    watch:{
      $route(to) {
        this.init();
        this.AjaxAsRouter()
      }
    },
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .prejobrecorddetail{
    width: 100%;
    
    // .title1{
    //   padding-top: 20px;
    //   .sp{
    //     padding-right: 30px;
    //   }
    // }
    .group{
      padding-left: 46px;
      padding-bottom: 30px;
      span{
        padding-right: 20px;
        i{
          padding-right: 6px;
          font-size: 24px;
        }
        .icon-people-no{
          color: #f8cc49;
        }
        .icon-people-ok{
          color: #20cc7a;
        }
      }
      .el-button span{
        padding-right: 0;
      }
      
    }
  
    .option {
      padding-bottom:10px;
      .el-input{
        display:inline-block;
        width: 40%;
        margin-left: 20px;
      }
    }

    .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
    
    
  }
</style>