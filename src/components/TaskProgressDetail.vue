<template>
  <div class="taskexaminedetail">
    <p class="title">
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/taskprogress' }" ><i class="icon-left-arrow"></i>任务完成进度</el-breadcrumb-item>
      <el-breadcrumb-item>{{trainStudent.StudentName}}</el-breadcrumb-item>
    </el-breadcrumb>
    </p>
    <div class="title1">学员信息</div>
    <div class="person">
      <el-row>
          <el-col :span="10">
            <p>姓名：{{trainStudent.StudentName}}</p>
            <p>学部：{{trainStudent.XueBuName}}</p>
            <p>职位性质: {{trainStudent.JobsTypeName}}</p>
          </el-col>
          <el-col :span="10">
            <p>实习状态: <el-tag :type="progress.TotalStates == '已完成' ? 'success' : 'danger' " size="mini"> {{progress.TotalStates}}</el-tag>

              <el-button 
                size="mini" 
                type="primary" 
                style="margin-left:20px" 
                @click="showDialog" 
                class="giveup"
                v-if="(progress.TotalStates == '未完成' && sxtaotai )"
                >
                淘汰
              </el-button>
              <span class="reason" v-if="progress.TotalStates == '已淘汰'"  @click="dialogFormVisible = true">查看原因</span>
            </p>
            <p>学科：{{trainStudent.XueKeName}}</p>
            <p>开始实习时间: {{trainStudent.TaskTime}}</p>
          </el-col>
          <el-col :span="4"></el-col>
      </el-row>
    </div>
    <div class="title1">听课任务</div>
    <div class="person">
      <el-row>
        <el-col :span="10">
          <p>任务进度: {{progress.ListenProgress}}</p>    
        </el-col>
        <el-col :span="10">
          <p>任务描述: {{progress.ListenDesc}}</p>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
      <!-- 任务列表 -->
        <div class="list" v-for="(item,index) in listenClass" >
          <div class="list-info">
            <el-row>
              <el-col :span="10">
                <p>{{(index+1)}}.课程名称: {{item.ClassName}}</p>    
                <p>上课时间: {{item.LessonDate}}</p>    
              </el-col>
              <el-col :span="10">
                <p>校区: {{item.AreaName}}</p>
                <p>听课笔记提交时间: {{item.SubTime}}</p>
              </el-col>
              <el-col :span="4"></el-col>
            </el-row>
          </div>
          <div class="list-info" v-if="item.AuditState != null">
            <el-row>
              <el-col :span="10">
                <p>任务状态: {{item.AuditState}}</p>    
                <p>审核人: {{item.AuditName}}</p>    
              </el-col>
              <el-col :span="40">
                <p>任务评级: {{item.TaskLevel}}</p>
                <p>审核时间: {{item.AuditTime}}</p>
              </el-col>
              <el-col :span="4"></el-col>
            </el-row>
          </div>
          <div class="list list1" v-if="item.AuditState != null">
            <div class="list-img">
              <div class="imgs" v-for="pic in item.PicList">
                <img :src="pic" />
              </div>
              
            </div>
          </div>
        </div>
    </div>
    
    <div class="title1">实习期作业</div>
    <div class="person">
       <el-row>
          <el-col :span="10">
            <p>任务进度: {{progress.TaskState}}</p>    
          </el-col>
          <el-col :span="10">
            <p>截止时间:{{progress.TaskTime}}</p>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
        
        <div class="list" v-if="progress.TaskState != null">
          <div class="list-info">
            <el-row>
              <el-col :span="10">
                <p>任务状态: {{taskInfo.AuditState}}</p>    
                <p>审核人: {{taskInfo.AuditName}}</p>    
              </el-col>
              <el-col :span="10">
                <p>任务评级: {{taskInfo.TaskLevel}}</p>
                <p>审核时间: {{taskInfo.SubTime}}</p>
              </el-col>
              <el-col :span="4"></el-col>
            </el-row>
          </div>
          <div class="list list1">
          <div class="list-img">
            <div class="imgs" v-for="item in taskInfo.PicList">
              <img :src="item" />
            </div>
          </div>
          </div>
        </div>
    </div>
   
    <div class="title1">完善信息</div>
    <div class="person">
      <el-row>
          <el-col :span="10">
            <p>状态: {{progress.Perfect}}</p>
            <p>地址: <a :href="progress.TeacherInfoUrl">{{progress.TeacherInfoUrl}}</a> </p>
          </el-col>
          <el-col :span="10">
            <p>提交时间:</p> 
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
        <p style="padding-top: 20px;"><el-button class="back" @click="back()">返回</el-button></p>
    </div>

  
    <!--提交表单 提示-->
    <el-dialog title="淘汰学员" :visible.sync="dialogVisible">
      <div class="tiptext">确认淘汰“{{trainStudent.StudentName}}”老师？<p>请填写淘汰原因</p></div>
      <el-form>
        <el-form-item label="" label-width="0px">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请填写原因,最多50字"
            :maxlength="50"
            v-model="textarea" @input="checkTextarea"> 
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="submitEvaluate" :disabled="isSubmitReason">确定</el-button>
        <el-button class="export" @click="dialogVisible = false,textarea=''">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看原因" :visible.sync="dialogFormVisible">
      <p class="reason-item"> <span>淘汰原因:</span> {{progress.WeedOutReason}}</p>
      <p class="reason-item"> <span>操作时间:</span> {{progress.WeedOutTime}}</p>
      <p class="reason-item"> <span>操作人:</span> {{progress.WeedOutOperationName}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button class="export" @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import qs from 'qs';
  // import Vue from 'vue';
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  export default {
    name: 'PreJobRecordDetail',
    data() {
      return {
        dialogVisible:false,
        dialogFormVisible:false,
        isSubmitReason: true,
        nowStatus:'未完成',
        progress:{},
        listenClass:[],
        taskInfo:{},
        textarea:''
      }
    },
    created(){
      console.log(this.trainStudent)
      this.getProgressInfo()
    },
    methods:{
      // 返回
      back(){
        this.$router.go(-1);
      },
      // 提交
      submitEvaluate(){
        this.dialogVisible = false;
        this.getWeedOut()
      },
      //显示淘汰模态框
      showDialog(){
        this.dialogVisible = true;
      },
      checkTextarea(){ 
        this.textarea = this.textarea.replace(/(^\s*)|(\s*$)/g, "")
        if(this.textarea.length){
          this.isSubmitReason = false
        }else{
          this.isSubmitReason = true
        }
      },
      getProgressInfo(){
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
          traincode:this.trainStudent.TrainCode,
          studentcode:this.trainStudent.StudentCode
          
        }
        let option = {
          type:'get',
          api: 'api/Task/GetProgressInfo',
          query: query
        }
        Request(option, function(res){

          if(res.data.ResultType == 0){
            that.progress = res.data.AppendData;
            that.taskInfo = res.data.AppendData.TaskInfo;
            that.listenClass = res.data.AppendData.ListenClass;
            that.progress.TaskTime = that.progress.TaskTime.replace('T',' ')
            that.progress.TaskTime = that.progress.TaskTime.substr(0,that.progress.TaskTime.lastIndexOf(':'))

           

            that.taskInfo.SubTime = that.taskInfo.SubTime.replace('T',' ')
            that.taskInfo.SubTime = that.taskInfo.SubTime.substr(0,that.taskInfo.SubTime.lastIndexOf(':'))
            
            for(let i = 0; i < that.listenClass.length; i++){
              that.listenClass[i].SubTime = that.listenClass[i].SubTime.replace("T", ' ')
              that.listenClass[i].SubTime =  that.listenClass[i].SubTime.substr(0, that.listenClass[i].SubTime.lastIndexOf(':'))
              that.listenClass[i].LessonDate = that.listenClass[i].LessonDate.replace("T", ' ')
              that.listenClass[i].LessonDate =  that.listenClass[i].LessonDate.substr(0, that.listenClass[i].LessonDate.lastIndexOf(':'))
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
          // setTimeout(()=>{
            
          // },500)
        })
      },
      // 淘汰学员
      getWeedOut(){
        if(this.ajaxOver == false) return;
        this.ajaxOver = false
        const loading = this.$loading({
          lock: true,
          text: '操作中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token,
          studentcode:this.trainStudent.StudentCode,
          traintypereason:this.textarea
        }
        let option = {
          type:'get',
          api: 'api/Task/WeedOut',
          query: query
        }
        Request(option, function(res){

          if(res.data.ResultType == 0){
            that.$set(that.progress,'TotalStates','已淘汰')
            // that.progress = res.data.AppendData;
            // that.taskInfo = res.data.AppendData.TaskInfo;
            // that.listenClass = res.data.AppendData.ListenClass;
            // that.progress.TaskTime = that.progress.TaskTime.replace('T',' ')
            // that.progress.TaskTime = that.progress.TaskTime.substr(0,that.progress.TaskTime.lastIndexOf(':'))

            // that.taskInfo.SubTime = that.taskInfo.SubTime.replace('T',' ')
            // that.taskInfo.SubTime = that.taskInfo.SubTime.substr(0,that.taskInfo.SubTime.lastIndexOf(':'))
            
            // for(let i = 0; i < that.listenClass.length; i++){
            //   that.listenClass[i].SubTime = that.listenClass[i].SubTime.replace("T", ' ')
            //   that.listenClass[i].SubTime =  that.listenClass[i].SubTime.substr(0, that.listenClass[i].SubTime.lastIndexOf(':'))
            // }


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
  
      
    },
    computed:{
      sxtaotai:function(){
        let allCodes = JSON.stringify(this.$storage.getStorage('allCodes'));
        return allCodes.indexOf('sxtaotai') != -1? true: false;
      },
      ...mapState(['token','roleCode']),
      ...mapState({
        trainStudent:function(state){
            if(!state.trainStudent){
              let trainStudent= JSON.parse(this.$storage.getStorage('trainStudent'));
              this.$store.state.trainStudent = trainStudent;
            }
            return state.trainStudent;
          },
      })
    }
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .taskexaminedetail{
    width: 100%;


    .list{
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #d4d4d4;
      border-left-width: 3px;
      border-left-color: #35c57d;
    }
    .list1{
      padding-bottom: 0;
      padding-left: 0;
      border:none;
      margin: 0;
    }
   
   .el-button.back{
      width: 110px;
      height: 36px;
      border-color: #ccc;
      line-height: 36px;
      background: #fff;
      color: #2d2d2d;
   }
   .list-img{
    width: 100%;
    overflow: hidden;
     .imgs{
        float: left;
        width: 78px;
        height: 108px;
        border: 1px solid #d4d4d4;
        border-radius: 6px;
        margin-right: 20px;
        margin-bottom: 10px;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
     }
   }
    .el-dialog{
      .tiptext{
        line-height: 30px;
        font-size: 18px;
        text-align: center;
        p{
          font-size: 14px;
          color: #30c27c;
          padding-bottom: 20px;
        }
      }
    }
    .reason{
      color: blue;
      padding-left: 30px;
      padding-right: 30px;
      cursor: pointer;
    }
  }
</style>