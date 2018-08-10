<template>
  <div class="prejobrecord">
    <!-- 记录 -->
    <div class="record" >
      <p class="title">
        <el-breadcrumb separator-class="el-icon-caret-right">
          <el-breadcrumb-item v-if="$route.path=='/group/examgroup'"><i class="icon-left-arrow"></i>复试分组</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.path=='/group/answergroup'"><i class="icon-left-arrow"></i>答辩分组</el-breadcrumb-item>
        </el-breadcrumb>
      </p>
      <!-- <p class="new-btn" v-if="$route.path=='/group/examgroup'"><el-button class="search-btn" @click="newAnswer">新建复试</el-button></p>
      <p class="new-btn" v-if="$route.path=='/group/answergroup'"><el-button class="search-btn" @click="newAnswer">新建答辩</el-button></p> -->
      <div class="search">
        <el-form ref="form" :model="form">
          <el-form-item :label="$route.path=='/group/answergroup'?'答辩时间':'复试时间'" style="width:342px">
            <div class="time-input">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate" class="date-width" :picker-options="pickerOptions0" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
            <div class="line">--</div>
            <div class="time-input">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" class="date-width" :picker-options="pickerOptions1" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item :label="$route.path=='/group/answergroup'?'答辩状态':'复试状态'" label-width="70px">
            <el-select v-model="form.trainStatus" placeholder="请选择" class="select-width">
              <el-option
                v-for="item in AnswerStatus"
                :key="item.value"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
            <!-- <el-select v-model="form.selectJobStatus" placeholder="请选择" class="select-width" v-if="$route.path=='/group/examgroup'">
              <el-option
                v-for="item in JobStatus"
                :key="item.value"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="" label-width="20px">
            <el-button class="search-btn" @click="searchRecord">搜索</el-button>
            <el-button class="export" @click="exportInfos">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="table">
        <el-table
          :data="tableData">
          <el-table-column
            prop="TrainName"
            :label="$route.path=='/group/answergroup'?'答辩名称':'复试名称'">
            <template slot-scope="scope">
              <div @click="goDetail(scope.$index)" class="table-row-name">{{scope.row.TrainName}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="FuTime"
            :label="$route.path=='/group/answergroup'?'答辩时间':'复试时间'">
          </el-table-column>
          <el-table-column
            prop="TrainState"
            :label="$route.path=='/group/answergroup'?'答辩状态':'复试状态'">
          </el-table-column>
          <el-table-column
            prop="TrainCount"
            :label="$route.path=='/group/answergroup'?'答辩人数':'复试人数'">
          </el-table-column>
          <el-table-column
            prop="GroupCount"
            label="分组数量">
          </el-table-column>
        </el-table>
      </div>
      <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
    </div>
    <!-- 详情 -->
    
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  // import qs from 'qs';
  // import Vue from 'vue';
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  export default {
    name: 'Main1',
    data() {
      return {
        isShowDetail: false,
        ajaxOver:true,
        form: {
          beginDate: null,
          endDate: null,
          trainStatus: null,
        },
        beginDate: null,
        endDate: null,
        trainStatus:-1,

        beginTime:null,
        endTime: null,
        AnswerStatus: this.AnswerStatus,
        tableData: [],
        pageNum: 1,
        dataTotalNum: 0,
        pageTotal:0,
        pickerOptions0: {
          disabledDate: (time) => {
            if(this.form.endDate){
              return time.getTime() > new Date(this.form.endDate).getTime();
            }else{
              return 0
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
             if(this.form.beginDate){
              return  time.getTime() < new Date(this.form.beginDate).getTime()-8.64e7;
            }else{
              return 0;
            }
          }
        },
       
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
    beforeRouteLeave:(to, from, next) => {
   
      if(to.fullPath == '/groupdetail/examgroupdetail' ||to.fullPath == '/groupdetail/answergroupdetail'){
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
      this.init()
      this.beginDate = this.beginTime;
      this.endDate = this.endTime;
      this.AjaxAsRouter();
    },
    methods:{
      init(){
        let routerFrom = window.VueObj.RouterFrom
        this.XueBu = this.$storage.getStorage('XueBu');
        this.XueKe = this.$storage.getStorage('XueKe');

        // pageNum 要记录刷新时的pageNum 和初始化是的pageNum
        if( routerFrom == '/' ||routerFrom == '/groupdetail/examgroupdetail' ||routerFrom == '/groupdetail/answergroupdetail'){
          this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
        }else{
          this.pageNum = 1
        }
      },
      AjaxAsRouter(){
        if(this.$route.path == '/group/examgroup'){ // 复试分组
          this.getExamRecord(this.pageNum,'api/PreWorkSecond/GetSecondGroupList')
        }else if(this.$route.path == '/group/answergroup'){ // 答辩分组
          this.getExamRecord(this.pageNum,'api/Reply/GetReplyGroupList')
        }
      },
      goDetail(index){
        this.$store.commit('$_setStorage',{key:'trainInfo',value:this.tableData[index]})
        let path = this.$route.path;
        if(path == '/group/answergroup'){
          this.$router.push({path:'/groupdetail/answergroupdetail'})
        }else{
          this.$router.push({path:'/groupdetail/examgroupdetail'})
        }
      },
      newAnswer(){
        let path = this.$route.path;
        if(path == '/group/answergroup'){
          this.$router.push({path:'/new/newanswer'})
        }else{
          this.$router.push({path:'/new/newexam'})
        }
      },
      // 上一页
      prevPage(){
        this.pageNum--;
        if(this.pageNum<1){
          this.pageNum = 1;
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.AjaxAsRouter()
      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.AjaxAsRouter()
      },
      //搜索记录
      searchRecord(){
        this.pageNum = 1;
        if(!this.form.beginDate && !this.form.endDate ){
          this.beginDate = this.beginTime
          this.endDate = this.endTime
        }else if(this.form.beginDate && !this.form.endDate){
          this.beginDate = this.form.beginDate + ' 00:00:00' ;
          this.endDate = this.endTime
        }else if(!this.form.beginDate && this.form.endDate){
          this.beginDate = this.beginTime
          this.endDate = this.form.endDate +' 23:59:59';
        }else{
          this.beginDate = this.form.beginDate  + ' 00:00:00' ;
          this.endDate = this.form.endDate +' 23:59:59';
        }

        if(this.form.trainStatus){
          this.trainStatus = this.form.trainStatus;
        }else{
          this.trainStatus = -1;
        }
        
        this.ajaxOver = true;
        this.AjaxAsRouter()
      },


      /* 复试分组===================================================================================================================*/
      // 获取分组信息
      getExamRecord(pageIndex,url){
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
          pagesize: this.pageSize,
          pageindex: pageIndex,
          begindate: this.beginDate,
          enddate: this.endDate,
          trainstatus:this.trainStatus
        }
        let option = {
          type:'get',
          api: url,
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.tableData = res.data.AppendData.DataList;
            for(var i = 0 ;i < that.tableData.length; i++){
              // 修改开始和结束时间
              for(var k in that.tableData[i]){
                if(k == 'FuTime'){
                  that.tableData[i][k] = that.tableData[i][k].substr(0,that.tableData[i][k].indexOf('T'))
                }
              }
            }
            // 页码
            that.pageNum = that.tableData.length==0? 0:res.data.AppendData.PageIndex;
            that.dataTotalNum = res.data.AppendData.TotalCount;
            that.pageTotal = Math.ceil(that.dataTotalNum / that.pageSize) == 0? 1:Math.ceil(that.dataTotalNum / that.pageSize);

            
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
        if(path == '/group/examgroup'){
          this.exportRecord('api/PreWorkSecond/ExportSecondGroupList');
        }else{
          this.exportRecord('api/Reply/ExportReplyGroupList');
        }
      },
      // 获取复试要导出的数据
      exportRecord(url){
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
          begindate: this.beginDate,
          enddate: this.endDate,
          trainstatus:this.trainStatus
        }
        let option = {
          type:'get',
          api: url,
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.exportTableData = res.data.AppendData;
            const filterVal = ['TrainName', 'FuTime', 'TrainState', 'TrainCount', 'GroupCount']
            if(url == 'api/PreWorkSecond/ExportSecondGroupList'){
              const tHeader = ['复试名称', '复试时间', '复试状态', '复试人数', '分组数量'] 
              ExportData(tHeader,filterVal,that.exportTableData,'复试分组')
            }else{
              const tHeader = ['答辩名称', '答辩时间', '答辩状态', '答辩人数', '分组数量'] 
              ExportData(tHeader,filterVal,that.exportTableData,'答辩分组')
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
      }
      /* 复试分组===================================================================================================================*/
    },
    computed:{
      ...mapState(['token'])
    },
    beforeDestroy(){
      // 离开这个组件的时候 将pageNum 改为1
      //this.$storage.setStorage('pageNum',1)
    },
    watch:{
      $route(to) {
        this.init();
        this.beginDate = this.beginTime;
        this.endDate = this.endTime;
        this.AjaxAsRouter()
      }
    },
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .prejobrecord{
    width: 100%;
    
    .pr10{
      padding-right: 10px;
    }
    .new-btn{
      padding-left: 46px;
      padding-bottom: 30px;
    }
    
    .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
   
  }
  
</style>