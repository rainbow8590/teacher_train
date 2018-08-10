<template>
  <div class="prejobrecorddetail">
    <p class="title">
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/arecord/answerrecord'}" v-if="$route.path == '/arecorddetail/answerrecorddetail'"><i class="icon-left-arrow"></i>答辩记录</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/arecord/examrecord'}" v-if="$route.path == '/arecorddetail/examrecorddetail'"><i class="icon-left-arrow"></i>复试记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{trainInfo.TrainName}}</el-breadcrumb-item>
    </el-breadcrumb>
    </p>
    <p class="tip"><i class="icon-yes"></i>本次培训所有学员培训完成后，才能流转到下一环节。</p>
    <div class="search">
      <el-form ref="form" :model="form" >
        <el-form-item label="状态" label-width="40px" v-if="$route.path=='/arecorddetail/answerrecorddetail'">
          <el-select v-model="form.selectStatus" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in AnswerStatusPerson"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="40px" v-if="$route.path=='/arecorddetail/examrecorddetail'">
          <el-select v-model="form.trainStatus" placeholder="请选择" class="select-width" >
            <el-option
              v-for="item in ExamStatusPerson"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" label-width="40px">
          <el-input v-model="form.studentName" placeholder="姓名" class="select-width"></el-input>
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
        <el-form-item label="">
          <el-button class="search-btn" @click="searchList">搜索</el-button>
          <el-button class="export" @click="exportInfos">导出</el-button>
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
          <el-table-column
            prop="XueBuName"
            label="学部">
          </el-table-column>
          <el-table-column
            prop="XueKeName"
            label="学科">
          </el-table-column>
          <el-table-column
            prop="JobsTypeName"
            label="职位性质">
          </el-table-column>
          <el-table-column
            prop="TrainStatesName"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="Sign"
            label="出勤"
            v-if="$route.path != '/arecorddetail/answerrecorddetail'">
          </el-table-column>
          <el-table-column
            prop="Level"
            label="复试等级"
            v-if="$route.path != '/arecorddetail/answerrecorddetail'">
          </el-table-column>
          <el-table-column
            prop="MajorLevel"
            label="专业课等级"
            v-if="$route.path == '/arecorddetail/answerrecorddetail'">
          </el-table-column>
          <el-table-column
            prop="SkillLevel"
            label="技能课等级"
            v-if="$route.path == '/arecorddetail/answerrecorddetail'">
          </el-table-column>
      </el-table>
    </div>
    <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNumSon}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  export default {
    name: 'PreJobRecordDetail',
    data() {
      return {
        ajaxOver:true,
        form: {
          selectXueKe:null,
          selectXueBu:null,
          studentName:null,
          trainStatus:null
        },
        selectXueKe:-1,
        selectXueBu:-1,
        studentName:null,
        trainStatus:-1,

        pageNumSon: 1,
        dataTotalNum: 0,
        pageTotal:0,

        XueKe: [],
        XueBu: [],
        AnswerStatusPerson: this.AnswerStatusPerson,
        ExamStatusPerson: this.ExamStatusPerson,
        tableData: [],
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
   
      if(to.fullPath == 'arecorddetailperson/examrecorddetailperson' ||to.fullPath == 'arecorddetailperson/answerrecorddetailperson'){
        next(()=>{
          this.$storage.setStorage('pageNumSon',this.pageNumSon)
        });
      }else{
        next(()=>{
          this.$storage.setStorage('pageNumSon',1)
        });
      }
    },
    created(){
      this.init();
      this.AjaxAsRouter()
    },
    methods:{
      goDetail(index){
        this.$store.commit('$_setStorage',{key:'trainStudent',value:this.tableData[index]})
        if(this.$route.path == '/arecorddetail/answerrecorddetail'){
          this.$router.push({path:'/arecorddetailperson/answerrecorddetailperson'})
        }else{
          this.$router.push({path:'/arecorddetailperson/examrecorddetailperson'})
        }
      },
      onSubmit() {
        console.log('submit!');
      },
      init(){
        let routerFrom = window.VueObj.RouterFrom
        this.XueBu = this.$storage.getStorage('XueBu');
        this.XueKe = this.$storage.getStorage('XueKe');

        // pageNumSon 要记录刷新时的pageNumSon 和初始化是的pageNumSon
        if( routerFrom == '/' || routerFrom == 'arecorddetailperson/examrecorddetailperson' ||routerFrom == 'arecorddetailperson/answerrecorddetailperson'){
          this.pageNumSon = this.$storage.getStorage('pageNumSon')?this.$storage.getStorage('pageNumSon'):1
        }else{
          this.pageNumSon = 1
        }
      },
      AjaxAsRouter(){
        if(this.$route.path == '/arecorddetail/examrecorddetail'){ // 复试
          this.getExamList(this.pageNumSon,'api/PreWorkSecond/GetSecondListByCode')
        }else if(this.$route.path == '/arecorddetail/answerrecorddetail'){ // 答辩
          this.getExamList(this.pageNumSon,'api/Reply/GetReplyListByCode')
          
        }
      },
      // 上一页
      prevPage(){
        this.pageNumSon--;
        if(this.pageNumSon<1){
          this.pageNumSon = 1;
          return;
        }
        this.$storage.setStorage('pageNumSon',this.pageNumSon)
        this.AjaxAsRouter()
      },
      //下一页
      nextPage(){
        this.pageNumSon++;
        if(this.pageNumSon>this.pageTotal){
          this.pageNumSon = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNumSon',this.pageNumSon)
        this.AjaxAsRouter()
      },
      //搜索岗前培训记录
      searchList(){
        this.pageNumSon = 1;
        if(this.form.trainStatus){
          this.trainStatus = this.form.trainStatus;
        }else{
          this.trainStatus = -1;
        }
        if(this.form.studentName){
          this.studentName = this.form.studentName;
        }else{
          this.studentName = null;
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
        
        // this.ajaxOver = true;
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
          traincode: this.trainInfo.TrainCode,
          studentname: this.studentName,
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
                }else if(k == 'Sign' || k == 'Level'){
                  that.tableData[i][k] = that.tableData[i][k]? that.tableData[i][k]:'--'
                }
              }
            }
            // 页码
            that.pageNumSon = that.tableData.length==0? 0:res.data.AppendData.PageIndex;
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
        if(path == '/arecorddetail/examrecorddetail'){
          this.exportRecord('api/PreWorkSecond/ExportSecondListByCode');
        }else{
          this.exportRecord('api/Reply/ExportReplyListByCode');
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
          studentname: this.studentName,
          traincode:this.trainInfo.TrainCode,
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
            const filterVal = ['StudentName', 'XueBuName', 'XueKeName', 'JobsTypeName', 'TrainStatesName','Sign','Level']
            if(that.$route.path == '/arecorddetail/examrecorddetail'){
              const tHeader = ['姓名', '学部', '学科', '职位性质', '状态','出勤','复试等级']
              ExportData(tHeader,filterVal,that.exportTableData,that.trainInfo.TrainName+'复试记录')
            }else{
              const tHeader = ['姓名', '学部', '学科', '职位性质', '状态','出勤','答辩等级']
              ExportData(tHeader,filterVal,that.exportTableData,that.trainInfo.TrainName+'答辩记录')
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
    beforeDestroy(){
      // 离开这个组件的时候 将pageNumSon 改为1
      // this.$storage.setStorage('pageNumSon',1)
    },
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .prejobrecorddetail{
    width: 100%;
    
   .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
    
  }
</style>