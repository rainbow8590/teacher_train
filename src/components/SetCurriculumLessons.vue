<template>
  <div class="curriculum">
    <p class="title">
      <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item :to="{path:'/setcurriculum'}"><i class="icon-left-arrow"></i>配置约课课程</el-breadcrumb-item>
        <el-breadcrumb-item>{{YingInfo.XueBuName}}{{YingInfo.XueKeName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <p class="title1">可约课程</p>
    <div class="lesson-info">
    <span class="info">需约课老师(人)： {{YingInfo.TeacherCount}}</span> 
    <span class="info">应约课节：{{YingInfo.YingCount}}</span>  
    <span class="info">可约课节：{{YingInfo.KeCount}}</span> 
    <span class="info">缺口（节）：{{YingInfo.QueCount}}</span> 
    <p class="btn"><el-button size="mini" class="search-btn" @click="showLessonDialog">添加课程</el-button></p>
    </div>
 <!--    <el-form class="search">
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
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form> -->
    <div class="table">
      <el-table
        :data="tableData">
        <el-table-column
          prop="ClassName"
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="PrintTeachers"
          label="老师"
          width="140px">
        </el-table-column>
        <el-table-column
          prop="SemesterName"
          label="学期"
          width="140px">
        </el-table-column>
        <el-table-column
          prop="CurrentCount"
          label="报名人数"
          width="140px">
        </el-table-column>
        <el-table-column
          prop="AreaName"
          label="校区"
          width="200px">
        </el-table-column>
        <el-table-column
          prop="PrintTime"
          label="上课时间" >
        </el-table-column>
        <el-table-column
          label="操作"
          width="120px">
          <template slot-scope="scope">
            <span style="cursor:pointer;" @click="deleteLesson(scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
    </div>

    <el-dialog title="添加课程" :visible.sync="dialogVisible">
      <el-form :model="form">
          <el-form-item label="" label-width="0px">
            <el-select v-model="form.ClassYear" :placeholder="ClassYear" >
              <el-option :label="nowYear" :value="nowYear"></el-option>
              <el-option :label="nextYear" :value="nextYear"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" label-width="0px">
            <el-select v-model="form.Semester" :placeholder="SemesterName">
              <el-option value="1" label="秋季"></el-option>
              <el-option value="2" label="寒假"></el-option>
              <el-option value="3" label="春季"></el-option>
              <el-option value="4" label="暑假"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" label-width="0px">
            <el-input v-model="form.TeacherName" placeholder="老师姓名"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="0px">
            <el-button  class="search-btn" @click="searchTableClass">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="table">
          <el-table :data="LessonData">
           <el-table-column property="ClassName" label="课程名称" width="200">
            <template slot-scope="scope"><div class="table-first"><el-radio @change="changeIndex(scope.$index)" v-model="radioIndex" :label="scope.$index">{{radioText}}</el-radio><span>{{scope.row.ClassName}}</span></div></template>  
           </el-table-column>
           <el-table-column property="PrintTeachers" label="老师" width="100"></el-table-column>
           <el-table-column property="CurrentCount" label="报名人数" width="100"></el-table-column>
           <el-table-column property="AreaName" label="校区" width="160"></el-table-column>
           <el-table-column property="PrintTime" label="上课时间"></el-table-column>
         </el-table>
        </div>
      <p class="page">共 {{table_dataTotalNum}} 条 <span @click="tablePrevPage" class="pageone"> 上一页 </span>  {{table_pageNum}} / {{table_pageTotal}}  <span @click="tableNextPage" class="pageone"> 下一页 </span></p>
      <span slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="addLesson" :disabled="disabledBtn">添加课程</el-button>
        <el-button class="export" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import qs from 'qs';
  import Request from '../assets/request'
  import FlagSemester from '../assets/flagSemester'
  export default {
    inject:['reload'],
    name: 'SetCurriculum',
    data() {
      return {
        form:{
          ClassYear:null,
          Semester:null,
          TeacherName:null
        },
        nowYear: new Date().getFullYear(),
        nextYear: new Date().getFullYear()+1,

        TeacherName:null,
        ClassYear: '2018',
        Semester: FlagSemester(),
        SemesterName:FlagSemester()==1?'秋季':(FlagSemester()==2?'寒假':(FlagSemester()==3?'春季':'暑假')),
        dialogVisible: false,

        disabledBtn: true,
        radioIndex: null,
        radioText: null,

        pageNum: 1,
        dataTotalNum: 0,
        pageTotal: 0,
        table_pageNum: 1,
        table_dataTotalNum: 0,
        table_pageTotal: 0,
        tableData:[],
        LessonData:[],
      }
    },
    created(){
      this.getReserveClas(this.pageNum)
    },
    methods:{
      handleEdit(index,row){
        //this.tableData.splice(index,1);
      },
      showLessonDialog(){
        this.dialogVisible = true;
        this.getClassInfo(this.table_pageNum)
      },
      addLesson(){
        this.dialogVisible = false;
      },
      // 获取弹窗可约班级
      getClassInfo(pageNum){
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
          teachername: this.TeacherName,
          classyear: this.ClassYear,
          semter: this.Semester,
          pagesize:this.pageSize,
          pageindex:pageNum,
          xuebu:this.YingInfo.XueBu,
          xueke:this.YingInfo.XueKe
        }
        let option = {
          type:'get',
          api: 'api/Task/GetClassInfo',
          query: query
        }
        Request(option, function(res){

          if(res.data.ResultType == 0){
            that.LessonData = res.data.AppendData.DataList;
            console.log(that.LessonData)
            // //整理面试时间
            // for(var i =0 ; i < that.tableData.length; i++){
            //   for(var k in that.tableData[i]){
            //     if( k == 'InterviewDate'){
            //       that.tableData[i][k] = that.tableData[i][k].substr(0,that.tableData[i][k].indexOf('T'))
            //     }
            //   }
            // }
            // 计算页码
            that.table_pageNum = that.LessonData.length==0? 0:res.data.AppendData.PageIndex;
            that.table_dataTotalNum = res.data.AppendData.TotalCount;
            that.table_pageTotal = Math.ceil(that.table_dataTotalNum / that.pageSize);
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
      // 获取可约班级
      getReserveClas(pageNum){
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
          xuebu: this.YingInfo.XueBu,
          xueke: this.YingInfo.XueKe,
          pagesize:this.pageSize,
          pageindex:pageNum
        }
        let option = {
          type:'get',
          api: 'api/Task/GetReserveClass',
          query: query
        }
        Request(option, function(res){

          if(res.data.ResultType == 0){
            that.tableData = res.data.AppendData.DataList;
            // //整理面试时间
            // for(var i =0 ; i < that.tableData.length; i++){
            //   for(var k in that.tableData[i]){
            //     if( k == 'InterviewDate'){
            //       that.tableData[i][k] = that.tableData[i][k].substr(0,that.tableData[i][k].indexOf('T'))
            //     }
            //   }
            // }
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
       // 上一页
      prevPage(){
        this.pageNum--;
        if(this.pageNum<1){
          this.pageNum = 1;
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getReserveClas(this.pageNum)
      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getReserveClas(this.pageNum)
      },
       // 弹窗 上一页
      tablePrevPage(){
        this.radioIndex = null;
        this.disabledBtn = true;
        this.table_pageNum--;
        if(this.table_pageNum<1){
          this.table_pageNum = 1;
          return;
        }
        this.getClassInfo(this.table_pageNum)
      },
      //弹窗 下一页
      tableNextPage(){
        this.radioIndex = null;
        this.disabledBtn = true;
        this.table_pageNum++;
        if(this.table_pageNum>this.table_pageTotal){
          this.table_pageNum = this.table_pageTotal
          return;
        }
        this.getClassInfo(this.table_pageNum)
      },
      searchTableClass(){
        this.table_pageNum = 1;
  
        if(this.form.ClassYear){
          this.ClassYear = this.form.ClassYear;
        }else{
          this.ClassYear = new Date().getFullYear()
        }
        if(this.form.Semester){
          this.Semester = this.form.Semester;
        }else{
          this.Semester = FlagSemester();
        }
        if(this.form.TeacherName){
          this.TeacherName = this.form.TeacherName;
        }else{
          this.TeacherName = null;
        }
        this.getClassInfo(this.table_pageNum)
      },

      changeIndex(index){
        this.radioIndex = index;
        this.disabledBtn = false
      },
      // 添加班级
      addLesson(){
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        
        let select =this.LessonData[this.radioIndex];
        let data ={
          "ClassCode": select.ClassCode,
          "XueKe": select.XueKe,
          "XueBu": select.XueBu,
          "BeginDate": select.BeginDate,
          "EndDate": select.EndDate
        };

        let option = {
          type:'post',
          api: 'api/Task/AddClass',
          query: query,
          data: qs.stringify(data)
        }
        Request(option, function(res){
          console.log(res)
          if(res.data.ResultType == 0){
            that.$message({
              message:res.data.Message,
              type: 'success'
            })
            
            that.reload();
            
     
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
        })
      },
      //删除班级
      deleteLesson(index){

        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          classcode: this.tableData[index].ClassCode
        }
        
        let data = {};

        let option = {
          type:'post',
          api: 'api/Task/DeleteClass',
          query: query,
          data: '{}'
        }
        Request(option, function(res){
          console.log(res)
          if(res.data.ResultType == 0){
            that.$message({message:res.data.Message,type:'success'})
              that.reload();
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
        })
      }

    },
    computed:{
      ...mapState(['token']),
      ...mapState({
          YingInfo:function(state){
            if(!state.YingInfo){
              let YingInfo= JSON.parse(this.$storage.getStorage('YingInfo'));
              this.$store.state.YingInfo = YingInfo;
            }
            return state.YingInfo;
          },
         
        })
    },
    beforeDestroy(){
      // 离开这个组件的时候 将pageNum 改为1
      this.$storage.setStorage('pageNum',1)
    },
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .curriculum{
    width: 100%;

    .lesson-info{
      padding-right: 27px;
      padding-top: 20px;
      padding-left: 46px;
      padding-bottom: 20px;
      overflow: hidden;
      box-sizing: border-box;
      .info{
        float: left;
        width: 20%;
        line-height: 36px;
      }
      .btn{
        float: left;
        width: 20%;
        text-align: right;
      }
    }
    .el-form-item{
      display: inline-block;
      margin-right: 10px;
      width: 140px;
    }

    .table{
      padding-left: 20px;
    }
    .el-dialog {
      min-height: 400px;
    }
    .page{
      width: 100%;
    }
    .table-first{
      text-align:left;
      display:flex;
      align-items:center;
    }
    
  }

    
  
  
</style>