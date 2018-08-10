<template>
  <div class="taskexaminedetail">
    <p class="title">
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/taskexamine' }" ><i class="icon-left-arrow"></i>实习任务审核</el-breadcrumb-item>
      <el-breadcrumb-item >{{student.StudentName}}--{{student.TaskName}}</el-breadcrumb-item>
    </el-breadcrumb>
    </p>
    <div class="title1">学员信息</div>
    <div class="person">
      <el-row>
          <el-col :span="8">
            <p>姓名：{{student.StudentName}}</p>
            <p>学部：{{student.XueKeName}}</p>
          </el-col>
          <el-col :span="8">
            <p>学科：{{student.XueBuName}}</p>
            <p>职位性质: {{student.JobsTypeName}}</p>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
    </div>
   <div class="title1">任务信息</div>
   <div class="person">
     <el-row>
        <el-col :span="8">
          <p>任务类型：{{student.TaskName}}</p> <!-- 共 -->
          <p>课程名称：{{student.ClassName}}</p><!--  听课 -->
          <p>校区：{{student.AreaName}}</p><!--  听课 -->
          <p v-if="student.TeacherInfoUrl">高思官网个人资料页: <a :href="student.TeacherInfoUrl" target="_blank">查看</a></p>
        </el-col>
        <el-col :span="8">
          <p>任务状态: <el-tag :type="student.AuditState == '已审核' ? 'success' : 'danger' " size="mini">{{student.AuditState}}</el-tag></p><!-- 实习期 及 听课 -->
          <p>上课时间: {{student.LessonDate | TimeFomat(student.LessonDate)}}</p><!--  听课 -->
          <p><span>听课笔记</span>提交时间: {{student.SubTime | TimeFomat(student.SubTime)}}</p><!-- 共 -->
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
   </div>

    <div v-if="isPerson">
      <div class="title1">任务审核 {{student.TaskLevel}}</div>
      <div class="person">
        <el-form :mode="form">
          <el-form-item label="任务评级">
            <el-select v-model="form.taskGrade" placeholder="请选择">
                <el-option
                  v-for="item in taskGrade"
                  :key="item.value"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit-btn" @click="dialogVisible = true">提交</el-button>
            <el-button class="back" @click="back()">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-if="isPersonOk">
      <div class="title1">任务审核</div>
      <div class="person">
        <el-row>
          <el-col :span="8">
            <p>任务评级：{{student.TaskLevel}}</p>
            <p>审核人：{{student.AuditName}}</p>
            <p style="padding-top: 20px;"><el-button class="back" @click="back()">返回</el-button></p>
          </el-col>
          <el-col :span="8">
            <p style="color:#fff;">审核时间</p> 
            <p>审核时间: {{student.AuditTime | TimeFomat(student.AuditTime)}}</p> 
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </div>
    </div>
  
  
    <!--提交表单 提示-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确认提交？提交后将不可修改！</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="submitEvaluate">确 定</el-button>
        <el-button class="export" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import qs from 'qs';
  import Request from '../assets/request';
  import { mapState } from 'vuex';
  export default {
    inject:  ['reload'],
    name: 'PreJobRecordDetail',
    data() {
      return {
        dialogVisible:false,
        form:{
          taskGrade:''
        },
        taskGrade:[
          {id:'A',value: 'A'},
          {id:'B',value: 'B'},
          {id:'C',value: 'C'},
        ],
        student:{},
        isPerson:true, // 任务审核前状态
        isPersonOk:false, //任务审核后
        TaskLevels:null,
      }
    },
    created(){
      this.getPersonInfo('api/Task/GetAuditInfo');
    },

    methods:{
      // 返回
      back(){
        this.$router.go(-1);
      },
      isTaskLevel(str){
        console.log(this.TaskLevels);
        //console.log(str);
        
      },
      // 提交
      submitEvaluate(){
        this.dialogVisible = false;
        this.isPersonOk= true;
        this.isPerson = false;

        //提交审核
        let that = this;
        let date = new Date();
        let query = {
          timestamp:date.getTime(),
          appid:this.appid,
          token: this.token
        }
        let data = {
            TrainCode: this.student.TrainCode,
            StudentCode: this.student.StudentCode,
            ClassCode: this.student.ClassCode,
            TaskType:this.student.TaskType,
            TaskLevel: this.form.taskGrade,
            LessonNo: this.trainStudent.LessonNo
        }

        const loading = this.$loading({
          lock: true,
          text: '数据提交中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let option = {
          type:'post',
          api: 'api/Task/AuditTask',
          query: query,
          data: qs.stringify(data)
        }
        Request(option, function(res){
          console.log(res);
          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
            
            
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
        that.reload();
      },
      
      //获取学员信息
      getPersonInfo(url){
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
          appid: this.appid,
          token: this.token,
          traincode: this.trainStudent.TrainCode,
          studentcode: this.trainStudent.StudentCode,
          classcode: this.trainStudent.ClassCode,
          lessonno: this.trainStudent.LessonNo,
          tasktype: this.trainStudent.TaskType
        }
        let option = {
          type:'get',
          api: url,
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.student = res.data.AppendData;
            //that.SubTimes = that.student.SubTime.substr(0,that.student.SubTime.lastIndexOf(':')).replace('T',' ');
            //判断审核任选是否有值
            if(that.student.TaskLevel){
              that.isPerson = false;
              that.isPersonOk= true;
            }else{
              that.isPerson = true;
              that.isPersonOk= false;
            }
            //任务评级转
            /*if(that.student.TaskLevel == 0){
              that.student.TaskLevel = 'A'
            }else if(that.student.TaskLevel == 1){
              that.student.TaskLevel = 'B'
            }else if(that.student.TaskLevel == 2){
              that.student.TaskLevel = 'C'
            }*/
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
      ...mapState(['token','token']),
      ...mapState({
        trainStudent:function(state){
          if(!state.trainStudent){
            let trainStudent= JSON.parse(this.$storage.getStorage('trainStudent'));
            this.$store.state.trainStudent = trainStudent;
          }
          return state.trainStudent;
        }
        
      })
      
    },
    filters:{
      //处理时间
      TimeFomat(time){
        if(time){
          if(time.lastIndexOf('.') == -1){
            return time.replace('T',' ');
          }else{
            return time.substr(0,time.lastIndexOf('.')).replace('T',' ');
          }
        }
      }
    }
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .taskexaminedetail{
    width: 100%;
    
  .back{
    width: 110px;
    height: 36px;
    border-color: #ccc;
    line-height: 36px;
    background: #fff;
    color: #909090;
   }
   .submit-btn{
    width: 110px;
    height: 36px;
    border-color: #30c27c;
    line-height: 36px;
    background: #30c27c;
    color: #fff;
  }
   

  }
</style>