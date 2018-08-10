<template>
  <div class="prejobrecord">
    <!-- 记录 -->

      <p class="title">
        <el-breadcrumb separator-class="el-icon-caret-right">
          <el-breadcrumb-item v-if="$route.path == '/arecord/examrecord'"><i class="icon-left-arrow"></i>复试记录</el-breadcrumb-item>
          <el-breadcrumb-item v-if="$route.path == '/arecord/answerrecord'"><i class="icon-left-arrow"></i>答辩记录</el-breadcrumb-item>
        </el-breadcrumb>
      </p>
      <div class="search">
        <el-form ref="form" :model="form">
          <el-form-item :label="$route.path == '/arecord/examrecord'?'复试时间':'答辩时间'" style="width:342px">
            <div class="time-input">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate" class="date-width" :picker-options="pickerOptions0" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
            <div class="line">--</div>
            <div class="time-input">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" class="date-width" :picker-options="pickerOptions1" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item  :label="$route.path == '/arecord/examrecord'?'复试状态':'答辩状态'" label-width="70px">
            <el-select v-model="form.trainStatus" placeholder="请选择" class="select-width">
              <el-option
                v-for="item in AnswerStatus"
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
            <el-button class="search-btn" @click="searchList">搜索</el-button>
            <el-button class="export" @click="exportInfos">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
            <el-table
              :data="tableData">
              <el-table-column
                prop="TrainName"
                :label="$route.path == '/arecord/examrecord'?'复试名称':'答辩名称'">
                <template slot-scope="scope">
                  <div @click="goDetail(scope.$index)" class="table-row-name">{{scope.row.TrainName}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="Futime"
                :label="$route.path == '/arecord/examrecord'?'复试时间':'答辩时间'">
              </el-table-column>
              <el-table-column
                prop="TrainState"
                :label="$route.path == '/arecord/examrecord'?'复试状态':'答辩状态'">
              </el-table-column>
              <el-table-column
                prop="TrainCount"
                :label="$route.path == '/arecord/examrecord'?'复试人数':'答辩人数'">
              </el-table-column>
              <el-table-column
                prop="ConfirmCount"
                label="待组长确认">
              </el-table-column>
              <el-table-column
                prop="PassedCount"
                :label="$route.path == '/arecord/examrecord'?'复试通过(人)':'答辩通过(人)'">
              </el-table-column>
              <el-table-column
                prop="WeedOutCount"
                label="淘汰(人)">
              </el-table-column>
        </el-table>
      </div>
      <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>

    <!-- 详情 -->
    
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  export default {
    name: 'Main1',
    data() {
      return {
        isShowDetail: false,
        ajaxOver:true,
        form: {
          name: null, 
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
   
      if(to.fullPath == '/arecorddetail/examrecorddetail' ||to.fullPath == '/arecorddetail/answerrecorddetail'){
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
        if( routerFrom == '/'){
          this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
        }else{
          this.pageNum = 1
        }
      },
      AjaxAsRouter(){
        if(this.$route.path == '/arecord/examrecord'){ // 复试分组
          this.getExamList(this.pageNum,'api/PreWorkSecond/GetSecondList')
        }else if(this.$route.path == '/arecord/answerrecord'){ // 答辩分组
          this.getExamList(this.pageNum,'api/Reply/GetReplyList')
        }
      },
      goDetail(index){
        this.$store.commit('$_setStorage',{key:'trainInfo',value:this.tableData[index]})
        if(this.$route.path == '/arecord/examrecord'){
          this.$router.push({path:'/arecorddetail/examrecorddetail'})
        }else{
          this.$router.push({path:'/arecorddetail/answerrecorddetail'})
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
      //搜索岗前培训记录
      searchList(){
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
        
        this.ajaxOver = true;
        this.AjaxAsRouter()
      },
      /* 复试分期列表===================================================================================================================*/
      getExamList(pageIndex,url){
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
                if(k == 'Futime'){
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
      //导出复试分期列表
      exportInfos(){
        let path = this.$route.path;
        if(path == '/arecord/examrecord'){
          this.exportRecord('api/PreWorkSecond/ExportSecondList');
        }else{
          this.exportRecord('api/Reply/ExportReplyList');

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
          trainstatus:this.trainStatus,
          xuebu: this.selectXueBu,
          xueke: this.selectXueKe
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
            const filterVal = ['TrainName', 'FuTime', 'TrainState', 'TrainCount', 'ConfirmCount','PassedCount','WeedOutCount']
            if(that.$route.path == '/arecord/examrecord'){
              const tHeader = ['复试名称', '复试时间', '复试状态', '复试人数', '待组长确认','复试通过(人)','淘汰(人)']
              ExportData(tHeader,filterVal,that.exportTableData,'复试记录')
            }else{
              const tHeader = ['答辩名称', '答辩时间', '答辩状态', '答辩人数', '待组长确认','答辩通过(人)','淘汰(人)']
              ExportData(tHeader,filterVal,that.exportTableData,'答辩记录')
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
      /* ===================================================================================================================*/
    },
    computed:{
      ...mapState(['token'])
    },
    beforeDestroy(){
      // 离开这个组件的时候 将pageNum 改为1
      // this.$storage.setStorage('pageNum',1)
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
  
    .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
   
    
  }
  
</style>