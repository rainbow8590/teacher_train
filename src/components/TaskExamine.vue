<template>
  <div class="examine">
    <p class="title">
      <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item><i class="icon-left-arrow"></i>实习任务审核</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <div class="search">
      <el-form ref="form" :model="form">
        <el-form-item label="提交时间" style="width:342px">
          <div class="time-input">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate" class="date-width" :picker-options="pickerOptions0" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
          <div class="line">--</div>
          <div class="time-input">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" class="date-width" :picker-options="pickerOptions1" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="审核状态" label-width="70px">
          <el-select v-model="form.examineStatus" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in examineStatus"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" label-width="70px">
          <el-select v-model="form.taskTypeStatus" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in taskTypeStatus"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button class="search-btn" @click="searchTaskExamine">搜索</el-button>
          <el-button class="export" @click="exportInfos">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData">
        <el-table-column
          prop="TaskName"
          label="任务名称">
          <template slot-scope="scope">
            <div @click="goDetail(scope.$index)" class="table-row-name">{{scope.row.TaskName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="TaskTypeStr" label="任务类型"></el-table-column>
        <el-table-column prop="SubName" label="提交人"></el-table-column>
        <el-table-column prop="SubTimes" label="提交时间"></el-table-column>
        <el-table-column prop="AuditState" label="审核状态"></el-table-column>
        <el-table-column prop="TaskLevel" label="任务评级"></el-table-column>
        <el-table-column prop="AuditName" label="审核人"></el-table-column>
        <el-table-column prop="AuditTimes" label="审核时间"></el-table-column>
      </el-table>
    </div>
    <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Request from '../assets/request';
  import ExportData from '../assets/exportData'

  export default {
    name: 'TaskExamine',
    data() {
      return {
        pageNum:1,
        dataTotalNum: 0,
        pageTotal:0,
        beginDate:null,
        endDate:null,
        audit:-1,
        tasktype:-1,
        beginTime:null,
        endTime: null,

        form: { 
          beginDate: '',
          endDate: '',
          examineStatus:null,
          taskTypeStatus:null
        },
        examineStatus:[
          {id:-1,value:'全部'},
          {id:'待审核',value:'待审核'},
          {id:'A',value:'A'},
          {id:'B',value:'B'},
          {id:'C',value:'C'}
        ],
        taskTypeStatus:[
          {id:-1,value:'全部'},
          {id:1,value:'实习期作业'},
          {id:2,value:'听课任务'},
          {id:3,value:'完善个人资料'}
        ],
        tableData:[],
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.form.endDate != "") {
                return time.getTime() > Date.now() || time.getTime() > this.form.endDate;
            } else {
                // return time.getTime() > Date.now();
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
              return time.getTime() < this.form.beginDate;
          }
        },
      }
    },
    beforeRouteEnter: (to, from, next) => {
      window.VueObj =new Vue({
          data:{
            RouterFrom:from.fullPath,

          }
      })
      next()
    },
    beforeRouteLeave:(to, from, next) => {
   
      if(to.fullPath == '/taskexaminedetail' ||to.fullPath == '/taskexaminedetail'){
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
      this.GetAuditList(this.pageNum);
    },
    methods:{
      init(){
        console.log(this.$storage.getStorage('pageNum'))
        let routerFrom = window.VueObj.RouterFrom
        // this.XueBu = this.$storage.getStorage('XueBu');
        // this.XueKe = this.$storage.getStorage('XueKe');
        // pageNum 要记录刷新时的pageNum 和初始化是的pageNum
        if( routerFrom == '/' || routerFrom == '/taskexaminedetail'){
          this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
        } else{
          this.pageNum = 1
        }
      },
      goDetail(index){
        this.$router.push('/taskexaminedetail')
        this.$store.commit('$_setStorage',{key:'trainStudent',value:this.tableData[index]});
      },
      //处理时间
      TimeFomat(time){
        if(time){
          if(time.lastIndexOf('.') == -1){
            return time.replace('T',' ');
          }else{
            return time.substr(0,time.lastIndexOf('.')).replace('T',' ');
          }
        }
      },
      // 获取实习任务审核
      GetAuditList(pageNum){
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
          audit: this.audit,
          tasktype: this.tasktype,
          pagesize:this.pageSize,
          pageindex:pageNum
        }
        let option = {
          type:'get',
          api: 'api/Task/GetAuditList',
          query: query
        }
        Request(option, function(res){
          
          if(res.data.ResultType == 0){
            that.tableData = res.data.AppendData.DataList;
            console.log(res.data);
            //数据处理
            for(var i = 0 ; i < that.tableData.length; i++){
              var tab = that.tableData[i];
              for(var k in tab){
                //提交时间
                tab.SubTimes = that.TimeFomat(tab.SubTime);
                //审核时间
                tab.AuditTimes = that.TimeFomat(tab.AuditTime);
              
                //任务类型…
                if (tab.TaskType == 1 ){ 
                  tab.TaskTypeStr = '实习期作业'
                }else if (tab.TaskType == 2 ){
                  tab.TaskTypeStr = '听课任务'
                }else if (tab.TaskType == 3 ){
                  tab.TaskTypeStr = '完善个人资料'
                }
                //完善个人资料 提交时间为空
                // if(tab.TaskType == 3){
                //   tab.SubTimes = '--'
                // }
              }
            }
            // 页码
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
          this.pageNum = 1;
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.GetAuditList(this.pageNum)
      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.GetAuditList(this.pageNum)
      },
      //搜索实习任务
      searchTaskExamine(){
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

        if(this.form.examineStatus){
          this.audit = this.form.examineStatus;
        }else{
          this.audit = -1;
        }
        if(this.form.taskTypeStatus){
          this.tasktype = this.form.taskTypeStatus;
        }else{
          this.tasktype = -1
        }
      
        this.ajaxOver = true;
        this.GetAuditList(this.pageNum);
      },
      // 导出
      exportInfos(){
        this.exportRecord('api/Task/ExportAuditList');
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
          starttime: this.beginDate,
          endtime: this.endDate,
          audit: this.audit,
          tasktype: this.tasktype,
        }
        let option = {
          type:'get',
          api: url,
          query: query,
        }
        Request(option, function(res){
          
          if(res.data.ResultType == 0){
            that.exportTableData = res.data.AppendData;
            for(var i =0 ; i < that.exportTableData.length; i++){
              for(var k in that.exportTableData[i]){
                that.exportTableData[i].SubTimes = that.TimeFomat(that.exportTableData[i].SubTime);
                that.exportTableData[i].AuditTimes = that.TimeFomat(that.exportTableData[i].AuditTime);
                if(that.exportTableData[i].TaskType == 3){
                  that.exportTableData[i].SubTimes = '--';
                }
              }
            }
            const tHeader = ['任务名称','任务类型','提交人','提交时间','审核状态','任务评级','审核人','审核时间']
            const filterVal = ['TaskName', 'TaskTypeStr','SubName','SubTimes','AuditState','TaskLevel','AuditName','AuditTimes']
            ExportData(tHeader,filterVal,that.exportTableData,'实习任务审核')
            
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
    },
    computed:{
       ...mapState(['token'])
    }
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .examine{
    width:100%;
  }
</style>