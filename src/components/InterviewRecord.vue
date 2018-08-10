<template>
  <div class="interview">
    <p class="title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="icon-left-arrow"></i></i>面试记录</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <div class="search">
      <el-form ref="form" :model="form">
          <el-form-item label="面试时间" style="width: 342px">
            <div class="time-input">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate" class="date-width" :picker-options="pickerOptions0" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
            <div class="line">--</div>
            <div class="time-input">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" class="date-width" :picker-options="pickerOptions1" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
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
          <el-form-item label="面试结果" label-width="70px">
            <el-select v-model="form.selectInterviewResult" placeholder="请选择" class="select-width">
              <el-option
                v-for="item in JobResult"
                :key="item.value"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" label-width="40px">
            <el-input v-model="form.name" class="select-width" ></el-input>
            {{form.name}}
          </el-form-item>
          <el-form-item label="" label-width="20px">
            <el-button type="primary" class="search-btn" @click="searchInterviewRecord">搜索</el-button>
            <el-button type="primary" class="export" @click="exportInfos">导出</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData">
        <el-table-column
          prop="Name"
          label="姓名"
          width="100px">
          <template slot-scope="scope">
            <div @click="editViewResult(scope.$index)" class="table-row-name">{{scope.row.Name}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="SexName"
          label="性别"
          width="60px">
        </el-table-column>
        <el-table-column
          prop="Phone"
          label="电话"
          width="120px">
        </el-table-column>
        <el-table-column
          prop="Email"
          label="邮箱"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="GraduatedSchool"
          label="学校">
        </el-table-column>
        <el-table-column
          prop="SchoolMajor"
          label="专业">
        </el-table-column>
        <el-table-column
          prop="Education"
          label="学历"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="GraduatedYear"
          label="毕业年份"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="InterviewXueBuke"
          label="应聘科目"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="JobsTypeName"
          label="岗位性质"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="InterviewDate"
          label="面试日期"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="InterviewTime"
          label="面试时间"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="InterviewResultName"
          label="面试结果"
          width="100px">
        </el-table-column>
      </el-table>
    </div>
     <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>

    <!-- 填写面试结果 -->
    <el-dialog title="面试结果" :visible.sync="resultFormDialog">
      <el-form :model="resultForm">
        <div class="baseinfo">
          <el-form-item label="姓名:" label-width="80px" style="width: 100%">{{resultForm.Name}}</el-form-item>
          <el-form-item label="学历:" label-width="80px" style="width: 40%">{{resultForm.Education}}</el-form-item>
          <el-form-item label="应聘科目:" label-width="80px" style="width: 40%">{{resultForm.InterviewXueBuke}}</el-form-item>
          <el-form-item label="专业:" label-width="80px" style="width: 40%">{{resultForm.SchoolMajor}}</el-form-item>
          <el-form-item label="岗位性质:" label-width="80px" style="width: 40%">{{resultForm.JobsTypeName}}</el-form-item>
        </div>
        <el-form-item label="二面原因:" label-width="80px" style="width: 100%" v-if="resultForm.PreviousSecondReason">{{resultForm.PreviousSecondReason}}</el-form-item>
        <el-form-item label="面试结果" label-width="80px" style="width:100%">
          <el-select v-model="resultForm.InterviewResultName" @change="changeInterviewResult" :disabled="(resultForm.oldInterviewResult!= 1)">
            <el-option label="参加培训" value="2"></el-option>
            <el-option label="直接签约" value="3"></el-option>
            <el-option label="VIP1对1" value="4"></el-option>
            <el-option label="二次面试" value="5"></el-option>
            <el-option label="婉拒" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二面原因" label-width="80px" style="width:80%" v-if="(resultForm.InterviewResult == 5 && resultForm.oldInterviewResult !=5 )">
          <el-input
            type="textarea"
            :rows="2"
            maxlength="50"
            placeholder="请填写建议二次面试的原因，最多填写50个字符"
            v-model="resultForm.SecondReason" >
            </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search-btn" :disabled="(resultForm.oldInterviewResult != 1 || (resultForm.InterviewResult==5&&!resultForm.SecondReason.length) )"  @click="submitInterview">确 定</el-button>
        <el-button class="export" @click="resultFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


  import { mapState } from 'vuex';
  import qs from 'qs';
  import Request from '../assets/request'
  import FormatTime from '../assets/FormatTime'
  import ExportData from '../assets/exportData'
  export default {
    name: 'interviewrecord',
    data() {
      return {
       
        form:{
          beginDate:null,
          endDate:null,
          name:null,
          selectXueBu:null,
          selectXueKe:null,
          selectInterviewResult:null,
        },

        beginDate:'',
        endDate:'',
        name:null,
        selectXueBu:-1,
        selectXueKe:-1,
        selectInterviewResult:-1,

        // beginTime:  new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDate() +' 00:00:00',
        // endTime:  new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' 23:59:59',
        beginTime:null,
        endTime: null,
        resultForm:{
          Code:"",
          Education:"",
          Email:"",
          GraduatedSchool:"",
          GraduatedYear:null,
          ImportDateTime:"",
          InterviewDate:"",
          InterviewResult:null,
          InterviewResultName:"",
          InterviewTime:"",
          InterviewXuebu:null,
          InterviewXuebuke:"",
          InterviewXueke:null,
          JobsType:null,
          JobsTypeName:"",
          Name:"",
          Phone:"",
          PreviousSecondReason:null,
          SchoolMajor:"",
          SecondReason:'',
          Sex:null,
          SexName:"" 
        },
        pageNum: 1,
        dataTotalNum: 0,
        pageTotal: 0,
        resultFormDialog: false,
        isAbledArea: true,
        ajaxOver:true,
        XueKe: this.$storage.getStorage('XueKe'),
        XueBu: this.$storage.getStorage('XueBu'),
        JobResult: this.JobResult,
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
    created(){
      this.beginDate = this.beginTime;
      this.endDate = this.endTime;
      this.getInterviewRecord(this.pageNum)
    },
    methods:{
      changeInterviewResult(e){
        this.$set(this.resultForm,'InterviewResult',e)
        this.resultForm.SecondReason = ' '
        if(e == 2){
          this.$set(this.resultForm,'InterviewResultName','参加培训')
        }else if(e == 3){
          this.$set(this.resultForm,'InterviewResultName','直接签约')
        }else if(e == 4){
          this.$set(this.resultForm,'InterviewResultName','VIP1对1')
        }else if(e == 5){
          this.$set(this.resultForm,'InterviewResultName','二次面试')
          this.resultForm.SecondReason = ''
        }else if(e == 6){
          this.$set(this.resultForm,'InterviewResultName','婉拒')
        }
      },
      // 填写面试结果
      editViewResult(e){
        this.tipIndex = e;
        let code = this.tableData[e].Code;
        this.getStudentInfo(code)
        this.resultFormDialog = true;
      },
      //获取学员信息
      getStudentInfo(code){
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
          code: code
        }
        let option = {
          type:'get',
          api: 'api/Interview/GetInterviewInfo',
          query: query
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.resultForm = res.data.AppendData;
            that.resultForm.oldInterviewResult = that.resultForm.InterviewResult
            
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
      // 筛选面试分期记录
      getInterviewRecord(pageNum){
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
          name: this.name,
          xuebu: this.selectXueBu,
          xueke: this.selectXueKe,
          begindate: this.beginDate,
          enddate: this.endDate,
          interviewresult: this.selectInterviewResult,
          pagesize:this.pageSize,
          pageindex:pageNum
        }
        let option = {
          type:'get',
          api: '/api/Interview/GetInterviewStudent',
          query: query
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.tableData = res.data.AppendData.DataList;
            //整理面试时间
            for(var i =0 ; i < that.tableData.length; i++){
              for(var k in that.tableData[i]){
                if( k == 'InterviewDate'){
                  that.tableData[i][k] = that.tableData[i][k].substr(0,that.tableData[i][k].indexOf('T'))
                }
              }
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
      //搜索
      searchInterviewRecord(){
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

        if(this.form.name){
          this.name = this.form.name;
        }else{
          this.name = null;
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
  
        this.getInterviewRecord(this.pageNum)
      },
      // 提交面试信息
      submitInterview(){

        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        let data = {
            Code: this.resultForm.Code,
            InterviewResult: this.resultForm.InterviewResult,
            SecondReason: this.resultForm.SecondReason?this.resultForm.SecondReason.replace(/\s+/g, ""):'',
        }
     
        if(data.InterviewResult == 5 && !data.SecondReason.length){
          that.$message({
              message: '请填写二面原因',
              type: 'warming'
            })
          return;
        }

        const loading = this.$loading({
          lock: true,
          text: '数据提交中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });


        let option = {
          type:'post',
          api: '/api/Interview/SaveInterviewResult',
          query: query,
          data: qs.stringify(data)
        }
        Request(option, function(res){

          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })

            that.$set(that.tableData[that.tipIndex],'InterviewResultName',that.resultForm.InterviewResultName)
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
          that.resultFormDialog = false;
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
        this.getInterviewRecord(this.pageNum)
      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getInterviewRecord(this.pageNum)
      },
      // 导出
      exportInfos(){
        this.exportRecord('api/Interview/ExportInterviewStudent');
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
          name: this.name,
          xuebu: this.selectXueBu,
          xueke: this.selectXueKe,
          begindate: this.beginDate,
          enddate: this.endDate,
          interviewresult: this.selectInterviewResult
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
            for(var i =0 ; i < that.exportTableData.length; i++){
              for(var k in that.exportTableData[i]){
                if( k == 'InterviewDate'){
                  that.exportTableData[i][k] = that.exportTableData[i][k].substr(0,that.exportTableData[i][k].indexOf('T'))
                }
              }
            }
            const tHeader = ['姓名','性别','电话','邮箱','学校','专业','学历','毕业年份','应聘科目','岗位性质','面试日期','面试时间','面试结果',]
            const filterVal = ['Name', 'SexName','Phone','Email','GraduatedSchool','SchoolMajor','Education','GraduatedYear','InterviewXueBuke','JobsTypeName','InterviewDate','InterviewTime','InterviewResultName']
            ExportData(tHeader,filterVal,that.exportTableData,'面试记录')
            
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
      this.$storage.setStorage('pageNum',1)
    }
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .interview{
    .el-form{
      overflow: hidden;
      .el-form-item{
        float: left;
        overflow-y: hidden;
      }
    }
    .el-dialog{
      .el-form-item{
        margin-bottom: 12px;
      }
    }
    .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
  .el-table__fixed, .el-table__fixed-right{
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-top-left-radius: 10px;
  }

    /* .el-table__fixed-body-wrapper{
      border-left: 1px solid #ddd;
    } */
  
  }
</style>