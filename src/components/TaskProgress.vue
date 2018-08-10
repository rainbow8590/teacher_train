<template>
  <div class="progress">
    <p class="title">
      <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item><i class="icon-left-arrow"></i>实习任务进度</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <div class="search">
      <el-form ref="form" :model="form">
        <el-form-item label="开始实习时间" class="begin-time" style="width:350px; display: block;">
          <div class="time-input">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate"  :picker-options="pickerOptions0" class="select-width" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
            <div class="line">--</div>
          <div class="time-input">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate"  :picker-options="pickerOptions1" class="select-width" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="学部" label-width="40px">
          <el-select v-model="form.xuebu" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in XueBu"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" label-width="40px">
          <el-select v-model="form.xueke" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in XueKe"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实习任务" label-width="70px">
          <el-select v-model="form.tasktype" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in examineStatus"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="form.finishtype" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in taskTypeStatusOne"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实习状态" label-width="70px">
          <el-select v-model="form.taskstate" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in taskTypeStatus"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" label-width="40px">
          <el-input placeholder="输入姓名" v-model="form.studentname" class="select-width"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="20px">
          <el-button class="search-btn" @click="searchProgressList">搜索</el-button>
          <el-button class="export" @click="exportRecord">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData">
        <el-table-column
          prop="StudentName"
          label="姓名">
          <template slot-scope="scope">
            <div @click="goDetail(scope.$index)" class="table-row-name">{{scope.row.StudentName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="TaskTime" label="开始实习时间"></el-table-column>
        <el-table-column prop="XueBuName" label="学部"></el-table-column>
        <el-table-column prop="XueKeName" label="学科"></el-table-column>
        <el-table-column prop="JobsTypeName" label="职位性质"></el-table-column>
        <el-table-column prop="PerfectName" label="完善信息任务"></el-table-column>
        <el-table-column prop="ListenTaskName" label="听课任务"></el-table-column>
        <el-table-column prop="TaskName" label="实习期作业"></el-table-column>
        <el-table-column prop="TaskStatesName" label="实习状态"></el-table-column>
      </el-table>
    </div>
    <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  // import qs from 'qs';
  // import Vue from 'vue';
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  export default {
    name: 'TaskExamine',
    data() {
      return {
        form: { 
          beginDate: null,
          endDate: null,
          xuebu: null,
          xueke: null,
          tasktype: null,
          finishtype:null,
          taskstate: null,
          studentname: null,
        },
        XueBu:[],
        XueKe:[],
        beginDate: null,
        endDate: null,
        xuebu: -1,
        xueke: -1,
        tasktype: -1,
        finishtype:-1,
        taskstate: -1,
        studentname: null,

        beginTime:null,
        endTime: null,
        pageNum:0,
        dataTotalNum: 0,
        pageTotal:0,
        examineStatus:[
          {id:-1,value:'全部'},
          {id:1,value:'实习期作业'},
          {id:2,value:'听课任务'},
          {id:3,value:'完善个人资料'}
        ],
        taskTypeStatusOne:[
          {id:-1,value:'全部'},
          {id:1,value:'未完成'},
          {id:2,value:'逾期未完成'},
          {id:3,value:'已完成'}
        ],
        taskTypeStatus:[
          {id:-1,value:'全部'},
          {id:1,value:'实习中'},
          {id:2,value:'已淘汰'},
          {id:3,value:'已完成'}
        ],
        tableData:[],
        ajaxOver: true,
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
   
      if(to.fullPath == '/taskprogressdetail'){
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
      this.getProgressList(this.pageNum);
    },
    methods:{
      search(){
        console.log(this.form)
      },
      goDetail(index){
        this.$store.commit('$_setStorage',{key:'trainStudent',value:this.tableData[index]})
        this.$router.push('/taskprogressdetail')
      },
      init(){
        let routerFrom = window.VueObj.RouterFrom;
        this.XueBu = this.$storage.getStorage('XueBu');
        this.XueKe = this.$storage.getStorage('XueKe');
        // pageNum 要记录刷新时的pageNum 和初始化是的pageNum
        if( routerFrom == '/' || routerFrom == '/taskprogressdetail'){
          this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
        } else{
          this.pageNum = 1
        }
      },
      // 获取任务进度列表
      getProgressList(pageNum){
        if(this.ajaxOver == false) return;
        this.ajaxOver = false
        const loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          starttime: this.beginDate,
          endtime: this.endDate,
          xuebu: this.xuebu,
          xueke: this.xueke,
          tasktype: this.tasktype,
          finishtype:this.finishtype,
          taskstate: this.taskstate,
          studentname: this.studentname,
          pagesize:this.pageSize,
          pageindex:pageNum
        }
        let option = {
          type:'get',
          api: 'api/Task/GetTaskProgress',
          query: query
        }
        Request(option, function(res){

          if(res.data.ResultType == 0){
            that.tableData = res.data.AppendData.DataList;
            for(var i = 0 ; i < that.tableData.length; i++){
              that.tableData[i].TaskTime = that.tableData[i].TaskTime.substr(0,that.tableData[i].TaskTime.indexOf('T'))
            }
            // 计算页码
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
          // setTimeout(()=>{
            
          // },500)
        })
      },
      //搜索岗前培训记录
      searchProgressList(){
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
        if(this.form.xuebu){
          this.xuebu = this.form.xuebu;
        }else{
          this.xuebu = -1
        }
        if(this.form.xueke){
          this.xueke = this.form.xueke;
        }else{
          this.xueke = -1;
        }
        if(this.form.tasktype){
          this.tasktype = this.form.tasktype;
        }else{
          this.tasktype = -1
        }
        if(this.form.finishtype){
          this.finishtype = this.form.finishtype;
        }else{
          this.finishtype = -1
        }
        if(this.form.taskstate){
          this.taskstate = this.form.taskstate;
        }else{
          this.taskstate = -1
        }
        if(this.form.studentname){
          this.studentname = this.form.studentname;
        }else{
          this.studentname = null
        }
        this.getProgressList(this.pageNum)
      },
      // 上一页
      prevPage(){
        this.pageNum--;
        if(this.pageNum<1){
          this.pageNum = 1;
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
         this.getProgressList(this.pageNum)
      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getProgressList(this.pageNum)
      },
      // 导出
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
          starttime: this.beginDate,
          endtime: this.endDate,
          xuebu: this.xuebu,
          xueke: this.xueke,
          tasktype: this.tasktype,
          finishtype:this.finishtype,
          taskstate: this.taskstate,
          studentname: this.studentname
        }
        let option = {
          type:'get',
          api: 'api/Task/ExportTaskProgress',
          query: query,
        }
        Request(option, function(res){
          console.log(res.data)
          if(res.data.ResultType == 0){
            that.exportTableData = res.data.AppendData;

            const tHeader = ['名称', '开始实习时间', '学部', '学科', '职位性质', '完善信息任务','听课任务','实习期作业','实习状态']
            const filterVal = ['StudentName', 'TaskTime', 'XueBuName', 'XueKeName', 'JobsTypeName', 'PerfectName','ListenTaskName','TaskName','TaskStatesName']
            ExportData(tHeader,filterVal,that.exportTableData,'任务完成进度')
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


    },
    computed:{
      ...mapState(['token'])
    },
    beforeDestroy(){
      // 离开这个组件的时候 将pageNum 改为1
      // this.$storage.setStorage('pageNum',1)
    }
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .progress{
    width:100%;
    .begin-time{
      float: none;
      margin-bottom: 12px;
    }
  }
</style>