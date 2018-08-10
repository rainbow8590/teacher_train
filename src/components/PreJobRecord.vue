<template>
  <div class="prejobrecord">
    <!-- 记录 -->
    <div class="record" >
      <p class="title">
        <el-breadcrumb separator-class="el-icon-caret-right">
          <el-breadcrumb-item><span v-if="($route.path == '/record/prejobrecord')"><i class="icon-left-arrow"></i>岗前</span><span v-if="($route.path == '/record/postjobrecord')"><i class="icon-left-arrow"></i>岗后</span>培训记录</el-breadcrumb-item>
        </el-breadcrumb>
      </p>
      <div class="search">
        <el-form ref="form" :model="form">
          <el-form-item label="活动时间" style="width:342px">
              <div class="time-input">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate"  :picker-options="pickerOptions0" class="date-width" value-format="yyyy-MM-dd"></el-date-picker>
              </div>
              <div class="line">--</div>
              <div class="time-input">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate"  :picker-options="pickerOptions1" class="date-width" value-format="yyyy-MM-dd"></el-date-picker>
              </div>
          </el-form-item>
          <el-form-item label="培训状态" label-width="70px">
            <el-select v-model="form.trainStatus" placeholder="请选择" class="select-width">
              <el-option
                v-for="item in JobStatus"
                :key="item.value"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item label="" label-width="20px">
            <el-button class="search-btn" @click="searchPreRecord">搜索</el-button>
            <el-button class="export" @click="exportInfos">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <el-table
              :data="tableData">
              <el-table-column
                prop="TrainName"
                label="培训名称">
                <template slot-scope="scope">
                  <div @click="goDetail(scope.$index)" class="table-row-name">{{scope.row.TrainName}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="BeginDate"
                label="培训开始日期">
              </el-table-column>
              <el-table-column
                prop="EndDate"
                label="培训结束日期">
              </el-table-column>
              <el-table-column
                prop="TrainState"
                label="培训状态">
              </el-table-column>
              <el-table-column
                prop="TrainCount"
                label="培训人数">
              </el-table-column>
              <el-table-column
                prop="ConfirmCount"
                label="待组长确认">
              </el-table-column>
              <el-table-column
                prop="PassedCount"
                label="培训通过(人)">
              </el-table-column>
              <el-table-column
                prop="WeedOutCount"
                label="淘汰(人)">
              </el-table-column>
              <el-table-column
                prop="NextTimeCount"
                label="转到下期(人)">
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
  import qs from 'qs';
  // import Vue from 'vue';
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  export default {
    name: 'Main1',
    data() {
      return {
        isShowDetail: false,
        form: {
          beginDate: null,
          endDate: null,
          selectXueKe:null,
          selectXueBu:null,
          trainStatus:null,
        },
        beginDate: null,
        endDate: null,
        selectXueKe:-1,
        selectXueBu:-1,
        trainStatus:-1,

        beginTime:null,
        endTime: null,

        XueKe: [],
        XueBu: [],
        JobStatus: this.JobStatus,
        ajaxOver: true,
        pageNum: 1,
        dataTotalNum: 0,
        pageTotal:0,
        tableData: [],
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
            RouterFrom:from.fullPath,

          }
      })
      next()
    },
    beforeRouteLeave:(to, from, next) => {
   
      if(to.fullPath == '/recorddetail/prejobrecorddetail' ||to.fullPath == '/recorddetail/postjobrecorddetail'){
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
    watch:{
      $route(to,from) {

        this.init();
        this.beginDate = this.beginTime;
        this.endDate = this.endTime;
        this.AjaxAsRouter()
      }
    },
    methods:{
      init(){
        console.log(this.$storage.getStorage('pageNum'))
        let routerFrom = window.VueObj.RouterFrom
        this.XueBu = this.$storage.getStorage('XueBu');
        this.XueKe = this.$storage.getStorage('XueKe');
        // pageNum 要记录刷新时的pageNum 和初始化是的pageNum
        if( routerFrom == '/' || routerFrom == '/recorddetail/prejobrecorddetail' || routerFrom == '/recorddetail/postjobrecorddetail'){
          this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
        } else{
          this.pageNum = 1
        }

      },
      AjaxAsRouter(){
        if(this.$route.path == '/record/prejobrecord'){ // 岗前培训记录
          this.getPreRecord(this.pageNum,'api/PreWork/GetPreWorkList')
        }else if(this.$route.path == '/record/postjobrecord'){ // 岗后培训记录
          this.getPreRecord(this.pageNum,'api/WorkAfter/GetWorkedList')
        }
      },
      goDetail(index){
        this.$store.commit('$_setStorage',{key:'trainInfo',value:this.tableData[index]})
        if(this.$route.path == '/record/prejobrecord'){ // 岗前培训记录
          this.$router.push({path:'/recorddetail/prejobrecorddetail'})
        console.log(this.pageNum)
        }else if(this.$route.path == '/record/postjobrecord'){ // 岗后培训记录
         this.$router.push({path:'/recorddetail/postjobrecorddetail'})
        }
      },
      //获取岗前培训记录
      getPreRecord(pageIndex,url){
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
          xuebu: this.selectXueBu,
          xueke: this.selectXueKe,
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
                if(k == 'BeginDate' || k == 'EndDate'){
                  that.tableData[i][k] = that.tableData[i][k].substr(0,that.tableData[i][k].indexOf('T'))
                }
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
      //搜索岗前培训记录
      searchPreRecord(){
        this.pageNum = 1;
        // if(!this.ajaxOver) return;
        // this.ajaxOver = false;
        // if(!this.form.selectXueKe && !this.form.selectXueBu && !this.form.trainStatus && !this.form.beginDate && !this.form.endDate){
        //   this.$message({message:'请设置搜索条件', type:'warming'})
        //   setTimeout(()=>{
        //     this.ajaxOver = true;
        //   },3000)
        //   return;
        // }
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
        if(this.form.selectXueBu){
          this.selectXueBu = this.form.selectXueBu;
        }else{
          this.selectXueBu = -1
        }
        if(this.form.selectXueKe){
          this.selectXueKe = this.form.selectXueKe;
        }else{
          this.selectXueKe = -1;
        }
        if(this.form.selectInterviewResult){
          this.selectInterviewResult = this.form.selectInterviewResult;
        }else{
          this.selectInterviewResult = -1
        }
        this.ajaxOver = true;
        this.AjaxAsRouter()
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
        console.log(this.$storage.getStorage('pageNum'))
        this.AjaxAsRouter()
      },
       // 导出
      exportInfos(){
        let path = this.$route.path;
        if(path == '/record/postjobrecord'){
          this.exportRecord('api/WorkAfter/ExportWorkedList');
        }else{
          this.exportRecord('api/PreWork/ExportPreWorkList');
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
          xuebu: this.selectXueBu,
          xueke: this.selectXueKe,
          trainstatus:this.trainStatus
        }
        let option = {
          type:'get',
          api: url,
          query: query,
        }
        Request(option, function(res){
          console.log(res)
          if(res.data.ResultType == 0){
            that.exportTableData = res.data.AppendData;
            const tHeader = ['培训名称', '培训开始日期', '培训结束日期', '培训状态', '待组长确认', '培训通过(人)','淘汰(人)','转到下期(人)']
            const filterVal = ['TrainName', 'BeginDate', 'EndDate', 'TrainState', 'ConfirmCount', 'PassedCount','WeedOutCount','NextTimeCount']
            ExportData(tHeader,filterVal,that.exportTableData,'岗后培训列表')
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
  .prejobrecord{
    width: 100%;
    
    
    .pr10{
      padding-right: 10px;
    }

    // .el-form{
    //   overflow-y: hidden;
    // }
    // .el-form-item{
    //   float: left;
    //   padding-right: 10px;
    //   margin-bottom: 12px;
    // }
    .el-form-item__label{
      // text-align: left;
    }
    
    .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
  }
  
</style>