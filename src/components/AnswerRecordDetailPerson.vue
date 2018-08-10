<template>
  <div class="prejobrecorddetailperson">
    <p class="title">
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/arecord/examrecord' }" v-if="$route.path == '/arecorddetailperson/examrecorddetailperson'"><i class="icon-left-arrow"></i>复试记录</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/arecord/answerrecord' }" v-if="$route.path == '/arecorddetailperson/answerrecorddetailperson'"><i class="icon-left-arrow"></i>答辩记录</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: $route.path == '/arecorddetailperson/anwserrecorddetailperson'?'/arecorddetail/answerrecorddetail':'/arecorddetail/examrecorddetail'}">{{trainInfo.TrainName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{trainStudent.StudentName}}</el-breadcrumb-item>
    </el-breadcrumb>
    </p>
    <div class="title1">学员信息</div>
    <div class="person">
      <el-row>
        <el-col :span="10">
          <p>姓名: {{student.StudentName}}</p>
          <p>学部: {{student.XueBuName}}</p>
          <p v-if="$route.path == '/arecorddetailperson/answerrecorddetailperson'">学历: {{student.Education}}</p>
          <p v-if="$route.path == '/arecorddetailperson/examrecorddetailperson'">职位性质: {{student.JobsTypeName}}</p>
        </el-col>
        <el-col :span="10">
          <p>状态：<span :style="{color:student.TrainStatesName=='已淘汰'?'#c62e5d':'#33c27c'}">{{student.TrainStatesName}} </span>
            <span v-if="student.TrainStatesName=='已淘汰'||student.TrainStatesName=='转到下期'" class="reason" @click="showReason">查看原因</span>
            <span v-if="fstaotai || zztaotai">
              <span v-if="(student.TrainStates ==1 || student.TrainStates == 5)">
                <el-button class="giveup" @click="showDialog" data-text="淘汰">淘汰</el-button>
                <el-button class="gonext" @click="showDialog" data-text="转到下期" v-if="$route.path != '/arecorddetailperson/answerrecorddetailperson'">转到下期</el-button>
              </span>
            </span>
            </p>
          <p>学科：{{student.XueKeName}}</p>
          <p v-if="$route.path == '/arecorddetailperson/answerrecorddetailperson'">职位性质: {{student.JobsTypeName}}</p>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
    </div>
    <div class="title1" v-if="$route.path == '/arecorddetailperson/answerrecorddetailperson'&&!student.SkillLevel&&fushijilutianxie">转正答辩</div>
    <div class="person" v-if="$route.path == '/arecorddetailperson/answerrecorddetailperson'&&!student.SkillLevel&&fushijilutianxie">
       <el-form>
          <el-form-item label="专业课等级" label-width="120px">
            <el-select v-model="form.MajorLevel" placeholder="请选择" @change="check">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              <el-option label="D(淘汰)" value="D"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="技能课等级" label-width="120px" @change="check">
            <el-select v-model="form.SkillLevel" placeholder="请选择">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
              <el-option label="D(淘汰)" value="D"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评价" label-width="120px">
            <el-input v-model="form.commont" type="textarea" style="width:60%;" @input="check"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="120px">
            <el-button class="search-btn" @click="showdialogVisible" :disabled="isSure">提交</el-button>
            <el-button class="export" @click="$router.go(-1)" >返回</el-button>
          </el-form-item>
        </el-form>
    </div>
    <div class="title1" v-if="($route.path == '/arecorddetailperson/examrecorddetailperson'&& !(student.Level)&&fushijilutianxie)">复试结果</div>
    <div class="person" v-if="($route.path == '/arecorddetailperson/examrecorddetailperson'&& !(student.Level)&&fushijilutianxie)">
      <el-form :model="form">
        <el-form-item label="复试出勤" label-width="80px">
          <el-radio-group v-model="form.sign" @change="check">
              <el-radio label="1">参加</el-radio>
              <el-radio label="0">缺勤</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="复试等级" label-width="80px">
          <el-select v-model="form.level" placeholder="请选择"  @change="check">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D(淘汰)" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价" label-width="80px">
          <el-input v-model="form.commont" type="textarea" @input="check" style="width:60%;"></el-input>
        </el-form-item>
        <el-form-item label="" >
          <el-button class="search-btn" @click="showdialogVisible" :disabled="isSure">提交</el-button>
          <el-button class="export" @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title1" v-if="($route.path == '/arecorddetailperson/answerrecorddetailperson'&&student.SkillLevel)">答辩结果</div>
    <div class="person" v-if="($route.path == '/arecorddetailperson/answerrecorddetailperson'&&student.SkillLevel)">
      <p>专业课等级: {{student.MajorLevel}}</p>
      <p>技能课等级: {{student.SkillLevel}}</p>
      <p>评价: {{student.Comment}}</p>
    </div>
    <div class="title1" v-if="($route.path == '/arecorddetailperson/examrecorddetailperson'&&student.Level)">复试结果</div>
    <div class="person" v-if="($route.path == '/arecorddetailperson/examrecorddetailperson'&&student.Level)">
      <p>复试出勤: {{student.Sign}}</p>
      <p>复试等级: {{student.Level}}</p>
      <p>评价: {{student.Comment}}</p>
    </div>

    <!-- 淘汰  转到下期 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible1">
      <div class="tiptext" v-if="dialogTitle=='淘汰学员'">确认淘汰“{{student.StudentName}}”老师？<p>请填写淘汰原因</p></div>
      <div class="tiptext" v-if="dialogTitle=='转到下期'">确认将“{{student.StudentName}}”老师转到下期岗前培训？<p>请填写原因</p></div>
      <el-form :model="form">
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
        <el-button class="search-btn" @click="sure" :disabled="isSubmitReason">确定</el-button>
        <el-button class="export" @click="dialogFormVisible1 = false">取消</el-button>
      </div>
    </el-dialog>
    <!--提交表单 提示-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>请确认信息是否准确，提交后将无法修改！</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="submitScore">确 定</el-button>
        <el-button class="export" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 查看原因 -->
    <el-dialog title="查看原因" :visible.sync="dialogFormVisible2">
      <p class="reason-item"> <span v-if="student.TrainStatesName=='已淘汰'">淘汰原因:</span> <span v-if="student.TrainStatesName=='转到下期'">转到下期原因:</span> {{reasonResult.TrainTypeReason}}</p>
      <p class="reason-item"> <span>操作时间:</span> {{reasonResult.TrainTypeTime}}</p>
      <p class="reason-item"> <span>操作人:</span> {{reasonResult.OpertionName}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button class="export" @click="dialogFormVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import qs from 'qs';
  import Request from '../assets/request'
  import { mapState } from 'vuex';
  export default {
    name: 'PreJobRecordDetail',
    inject:  ['reload'],
    data() {
      return {
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogVisible: false,
        selectIndex:0,
        ajaxOver:true,
        form:{
          sign:null,
          level:null,
          commont:null,
          MajorLevel:null,
          SkillLevel:null,
        },

        dialogTitle:'淘汰学员',

        textarea:'',
        value:'',
        isSure: true, // 提交的按钮是否可点击
        isSubmitReason: true, // 提交淘汰和转到下期的按钮是否可点击
        student:{},
        reasonResult:{
          TrainTypeReason: null,
          TrainTypeTime: null,
          OpertionName: null
        },
        form:{SignScore:null,ExamScore:null,TaskScore:null,LessonScore: null,LessonLevel:''},
        tableData: [
          {name: '第一天',status:12,num:'--',conform: '--',pass: 16,giveup: 4,edit: '填写',},
          {name: '第二天',status:12,num:23,conform: 0,pass: 16,giveup: 4,edit: '填写',},
          {name: '第三天',status:12,num:23,conform: 0,pass: 16,giveup: 4,edit: '填写',},
          {name: '第四天',status:12,num:23,conform: 0,pass: 16,giveup: 4,edit: '填写',},
        ],
        // form:{
        //   isIn:0,
        //   name:'',
        //   region:''
        // }
      }
    },
    created(){
      this.AjaxAsRouter()
    },
    methods:{
      onSubmit() {
        console.log('submit!');
      },
      showdialogVisible(){
        this.dialogVisible =true;
      },
      showDialog(e){

        if(e.currentTarget.dataset.text == '淘汰'){
          this.dialogTitle = '淘汰学员'
        }else if(e.currentTarget.dataset.text == '转到下期'){
          this.dialogTitle = '转到下期'
        }
        this.dialogFormVisible1 = true;
         console.log(this.dialogTitle)
      },
      // sure(){
      //   if(this.dialogTitle == '淘汰学员'){
      //     this.student.TrainStatesName = '已淘汰';
      //   }else if(this.dialogTitle == '转到下期'){
      //     this.student.TrainStatesName = '转到下期';
      //   }
      // },
      sure(){
        if(this.dialogTitle == '淘汰学员'){
          this.submitReason(2)
          this.$set(this.student,'TrainStatesName','已淘汰')
        }else if(this.dialogTitle == '转到下期'){
          this.submitReason(4)
          this.$set(this.student,'TrainStatesName','转到下期')
        }
      },
      showReason(){
        this.dialogFormVisible2 = true
      },
      checkTextarea(){ 
        this.textarea = this.textarea.replace(/(^\s*)|(\s*$)/g, "")
        if(this.textarea.length){
          this.isSubmitReason = false
        }else{
          this.isSubmitReason = true
        }
      },
      submitEvaluate(){
        //this.$massage('提交成功')
      },
      AjaxAsRouter(){
        if(this.$route.path == '/arecorddetailperson/examrecorddetailperson'){ // 复试
          this.getPersonInfo()
        }else if(this.$route.path == '/arecorddetailperson/answerrecorddetailperson'){ // 答辩
          this.getPersonInfo()
        }
      },
      check(){
        if(this.$route.path == '/arecorddetailperson/examrecorddetailperson'){
          if( this.form.sign && this.form.level && this.form.commont ){
            this.isSure = false;
          }else{
            this.isSure = true;
          }
        }else{
          if( this.form.MajorLevel && this.form.SkillLevel && this.form.commont ){
            this.isSure = false;
          }else{
            this.isSure = true;
          }
        }
          
      },

      /* 复试===================================================================================================================*/
      getPersonInfo(){
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
          traincode: this.trainInfo.TrainCode,
          studentcode: this.trainStudent.StudentCode,
        }
        let option = {
          type:'get',
          api: 'api/PreWorkSecond/GetSecondStudentInfo',
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.student = res.data.AppendData;
            if(that.$route.path == '/arecorddetailperson/answerrecorddetailperson'){
              if(that.student.TrainStates == 1){
                that.student.TrainStatesName = '待答辩'
              }else if(that.student.TrainStates == 2){
                that.student.TrainStatesName = '已淘汰'
              }else if(that.student.TrainStates == 3){
                that.student.TrainStatesName = '答辩通过'
              }else if(that.student.TrainStates == 5){
                that.student.TrainStatesName = '待组长确认'
              }
            }
            that.$set(that.reasonResult,'TrainTypeReason',that.student.TrainTypeReason)
            that.$set(that.reasonResult,'TrainTypeTime',that.student.TrainTypeTime?that.student.TrainTypeTime.substr(0,that.student.TrainTypeTime.indexOf('T')):null)
            that.$set(that.reasonResult,'OpertionName',that.student.OpertionName)
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
      //复试  提交淘汰/转到下期原因
      submitReason(TrainStates){
        let that = this;

        const loading = this.$loading({
          lock: true,
          text: '保存中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let date = new Date();
        let query = {
          timestamp:date.getTime(),
          appid:this.appid,
          token: this.token
        }
        let data = {
            "TrainCode": this.student.TrainCode,
            "StudentCode": this.student.StudentCode,
            "TrainStates": TrainStates,
            "Reason": this.textarea,
        }
        let option = {
          type:'post',
          api: 'api/PreWorkSecond/WeedOut',
          query: query,
          data: qs.stringify(data)
        }

        Request(option, function(res){
          that.dialogFormVisible1 = false;
          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
            that.$set(that.reasonResult,'TrainTypeReason',that.textarea)
            that.$set(that.reasonResult,'TrainTypeTime',new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate())
            that.$set(that.reasonResult,'OpertionName',that.username)
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
          loading.close();
        })
      },
      submitScore(){
        if(this.$route.path == '/arecorddetailperson/examrecorddetailperson'){ // 复试
          this.submitResultFun(2)
        }else if(this.$route.path == '/arecorddetailperson/answerrecorddetailperson'){ // 岗后
          this.submitResultFun(3)
        }else if(this.$route.path == '/arecorddetailperson/answerrecorddetailperson'){ // 答辩
          this.submitResultFun(4)
        }
      },
      // 提交复试结果
      submitResultFun(trainType){
        let that = this;
        const loading = this.$loading({
          lock: true,
          text: '保存中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let date = new Date();
        let query = {
          traintype: trainType,
          timestamp:date.getTime(),
          appid:this.appid,
          token: this.token
        }
        let data = {
            "TrainCode": this.student.TrainCode,
            "StudentCode": this.student.StudentCode,
            "IsSign": this.form.sign?(this.form.sign == 1 ? true: false):null,
            "MajorLevel": this.form.MajorLevel?this.form.MajorLevel:null,
            "SkillLevel": this.form.SkillLevel?this.form.SkillLevel:null,
            "TrainLevel": this.form.level?this.form.level:null,
            "Comment": this.form.commont
        }
        
        let option = {
          type:'post',
          api: 'api/PreWorkSecond/SaveCommonGloabl',
          query: query,
          data: qs.stringify(data)
        }

        Request(option, function(res){
          that.dialogVisible = false;

          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
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
          loading.close();
        })
      },
      // 提交答辩结果
     /* submitAnswerResultFun(trainType){
        let that = this;
        const loading = this.$loading({
          lock: true,
          text: '保存中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let date = new Date();
        let query = {
          traintype: trainType,
          timestamp:date.getTime(),
          appid:this.appid,
          token: this.token
        }
        let data = {
            "TrainCode": this.student.TrainCode,
            "StudentCode": this.student.StudentCode,
            "IsSign": this.sign == 1 ? true: false,
            "MajorLevel": this.form.MajorLevel,
            "SkillLevel": this.form.SkillLevel,
            "TrainLevel": null,
            "Comment": this.form.commont
        }
        
        let option = {
          type:'post',
          api: 'api/PreWorkSecond/SaveCommonGloabl',
          query: query,
          data: qs.stringify(data)
        }

        Request(option, function(res){
          that.dialogFormVisible = false;

          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
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
          loading.close();
        })
      },*/
      /* ===================================================================================================================*/
      
    },
    computed:{
      fstaotai:function(){
        let allCodes = JSON.stringify(this.$storage.getStorage('allCodes'));
        return allCodes.indexOf('fstaotai') != -1? true: false;
      },
      zztaotai:function(){
        let allCodes = JSON.stringify(this.$storage.getStorage('allCodes'));
        return allCodes.indexOf('zztaotai') != -1? true: false;
      },
      fushijilutianxie:function(){
        let allCodes = JSON.stringify(this.$storage.getStorage('allCodes'));
        return allCodes.indexOf('fushijilutianxie') != -1? true: false;
      },
      dabianjilutianxie:function(){
        let allCodes = JSON.stringify(this.$storage.getStorage('allCodes'));
        return allCodes.indexOf('dabianjilutianxie') != -1? true: false;
      },
      ...mapState(['token','username','roleCode']),
      ...mapState({
        trainInfo:function(state){
          if(!state.trainInfo){
            let trainInfo= JSON.parse(this.$storage.getStorage('trainInfo'));
            this.$store.state.trainInfo = trainInfo;
          }
          return state.trainInfo;
        }
      }),
      ...mapState({
        trainStudent:function(state){
          if(!state.trainStudent){
            let trainStudent= JSON.parse(this.$storage.getStorage('trainStudent'));
            this.$store.state.trainStudent = trainStudent;
          }
          return state.trainStudent;
        }
      })
    }
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .prejobrecorddetailperson{
    width: 100%;
    
  // .search-btn{
  //   width: 110px;
  //   height: 36px;
  //   border-color: #30c27c;
  //   line-height: 36px;
  //   background: #30c27c;
  //   color: #fff;
  // }
    
    .el-textarea{
      width: 100%
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
    .reason-item {
      line-height: 30px;
      span{
        display: inline-block;
        width: 100px;
        text-align: right;
        padding-right: 20px;
      }
    }
      
  }
</style>