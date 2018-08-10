<template>
  <div class="prejobrecorddetailperson">
    <p class="title">
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: $route.path == '/recorddetailperson/prejobrecorddetailperson'?'/record/prejobrecord':'/record/postjobrecord' }"><span v-if="($route.path == '/recorddetailperson/prejobrecorddetailperson')"><i class="icon-left-arrow"></i>岗前</span><span v-if="($route.path == '/recorddetailperson/postjobrecorddetailperson')"><i class="icon-left-arrow"></i>岗后</span>培训记录
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: $route.path == '/recorddetailperson/prejobrecorddetailperson'?'/recorddetail/prejobrecorddetail':'/recorddetail/postjobrecorddetail' }">{{trainInfo.TrainName}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{trainStudent.StudentName}}</el-breadcrumb-item>
    </el-breadcrumb>
    </p>
    <div class="title1">学员信息</div>
    <div class="person">
      <el-row>
          <el-col :span="10">
            <p>姓名：{{student.StudentName}}</p>
            <p>学部：{{student.XueBuName}}</p>
            <p>职位性质：{{student.JobsTypeName}}</p>
          </el-col>
          <el-col :span="10">
            <p>状态：<span :style="{color:student.TrainStatesName=='已淘汰'?'#c62e5d':'#33c27c'}">{{student.TrainStatesName}}</span> 
              <span v-if="student.TrainStatesName=='已淘汰'||student.TrainStatesName=='转到下期'" class="reason" @click="showReason">查看原因</span>
              <span v-if="gqtaotai || ghtaotai">
                <span v-if="!(student.TrainStatesName=='已淘汰'||student.TrainStatesName=='转到下期'||student.TrainStatesName=='培训通过')">
                  <el-button class="giveup" @click="showDialog" data-text="淘汰">淘汰</el-button>
                  <el-button class="gonext" type="info" size="mini"  @click="showDialog" data-text="转到下期">转到下期</el-button>
                </span>
              </span>
              </p>
            <p>学科：{{student.XueKeName}}</p>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
    </div>
     <div class="title1" v-if="$route.path == '/recorddetailperson/prejobrecorddetailperson'">岗前培训记录</div>
     <div class="person person1" v-if="$route.path == '/recorddetailperson/prejobrecorddetailperson'">
       <div class="table">
         <el-table
          :data="tableData">
          <el-table-column
            prop="TrainDay"
            label="进度">
            <template slot-scope="scope">
              <div @click="goDetail(scope.$index)">第{{scope.row.TrainDay}}天</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="SignScore"
            label="考勤（分）">
          </el-table-column>
          <el-table-column
            prop="ExamScore"
            label="进门考（分）">
          </el-table-column>
          <el-table-column
            prop="TaskScore"
            label="作业（分）">
          </el-table-column>
          <el-table-column
            prop="LessonScore"
            label="练课（分）">
          </el-table-column>
          <el-table-column
            prop="LessonLevel"
            label="练课等级">
          </el-table-column>
          <el-table-column
            prop="edit"
            label="操作">
             <template slot-scope="scope">
              <div @click="showEdit(scope.$index)" style="color:#33c27c;cursor:pointer;" v-if="gangqianjilutianxie&&!(scope.row.LessonLevel!= ''||student.TrainStatesName=='已淘汰'||student.TrainStatesName=='转到下期')">填写</div>
              <div style="color:#33c27c;cursor:pointer;" v-if="!gangqianjilutianxie||(scope.row.LessonLevel!= ''||student.TrainStatesName=='已淘汰'||student.TrainStatesName=='转到下期')">--</div>
            </template>
          </el-table-column>
        </el-table>
       </div>
     </div>
     <div class="title1" v-if="$route.path == '/recorddetailperson/postjobrecorddetailperson'">岗后培训记录</div>
     <div class="person" v-if="$route.path == '/recorddetailperson/postjobrecorddetailperson'">
       <div class="table">
         <el-table
          :data="tableDataAfter">
          <el-table-column
            prop="TrainDay"
            label="进度">
            <template slot-scope="scope">
              <div @click="goDetail(scope.$index)">第{{scope.row.TrainDay}}天</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="JmkExam"
            label="进门考（分）">
          </el-table-column>
          <el-table-column
            prop="OwnLevel"
            label="放飞自我（评级）">
          </el-table-column>
          <el-table-column
            prop="OwnComment"
            label="放飞自我评价">
          </el-table-column>
          <el-table-column
            prop="Skill"
            label="技能课">
          </el-table-column>
          <el-table-column
            prop="Major"
            label="专业课落实(评级)">
          </el-table-column>
          <el-table-column
            prop="PrepareLesson"
            label="备课第一讲(评级)">
          </el-table-column>
          <el-table-column
            prop="Task"
            label="作业(分)">
          </el-table-column>
          <el-table-column
            prop="edit"
            label="操作">
             <template slot-scope="scope">
              <div @click="showEdit(scope.$index)" style="color:#33c27c;cursor:pointer;" v-if="ganghoujilutianxie&& !(scope.row.OwnLevel!= null||student.TrainStatesName=='已淘汰')">填写</div>
              <div style="color:#33c27c;cursor:pointer;" v-if="!ganghoujilutianxie||(scope.row.OwnLevel!= null||student.TrainStatesName=='已淘汰')">--</div>
            </template>
          </el-table-column>
        </el-table>
       </div>
     </div>
     <div class="title1" v-if="$route.path == '/recorddetailperson/postjobrecorddetailperson'">综合评价</div>
      <div class="tip"  v-if="$route.path == '/recorddetailperson/postjobrecorddetailperson'">请对该学员的岗后培训表现进行评价：</div>
      <el-form :model="form"  v-if="$route.path == '/recorddetailperson/postjobrecorddetailperson'">
        <el-form-item label="综合评价" label-width="90px" v-if="!student.Level">
          <el-select v-model="form.allLevel" placeholder="请选择" >
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D(淘汰)" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="综合评价:" label-width="100px" v-if="student.Level">
          <span>{{student.Level}}</span>
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="27px" >
          <el-button class="search-btn" @click="saveLevel" v-if="!student.Level" :disabled="WorkedScoreList.length != 7">提交</el-button>
          <el-button class="export" @click="$router.go(-1)" v-if="student.Level">返回</el-button>
        </el-form-item>
      </el-form>
    
    <!-- 岗前培训记录 -->
    <el-dialog title="填写培训记录" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="出勤情况" label-width="90px">
          <el-radio-group v-model="form.SignScore" @change="check">
            <el-radio label="1">参加</el-radio>
            <el-radio label="0">缺勤</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="进门考得分" label-width="90px" v-if="selectIndex != 0">
          <el-input type="number" min="0.0" max="2" step="0.1" v-model="form.ExamScore" auto-complete="off" placeholder="可输入1位小数，最多2分"  @input="checkJinMenKao"></el-input>
        </el-form-item>
        <el-form-item label="作业得分" label-width="90px" v-if="selectIndex != 0">
          <el-input type="number" min="0.0" max="2.5" step="0.1" v-model="form.TaskScore" auto-complete="off" placeholder="可输入1位小数，最多2.5分"  @input="checkZuoYe"></el-input>
        </el-form-item>
        <el-form-item label="练课得分" label-width="90px">
          <el-input type="number" min="0.0" max="10" step="0.1" v-model="form.LessonScore" auto-complete="off" placeholder="可输入1位小数，最多10分"  @input="checkLianKe"></el-input>
        </el-form-item>
        <el-form-item label="练课等级" label-width="90px">
          <el-select v-model="form.LessonLevel" placeholder="请选择" @change="check">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D" value="D" v-if="selectIndex == 0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="submitScore" :disabled="isSure">确 定</el-button>
        <el-button class="export" @click="giveupSubmit">取 消</el-button>
      </div>
    </el-dialog>
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
    <!-- 查看原因 -->
    <el-dialog title="查看原因" :visible.sync="dialogFormVisible2">
      <p class="reason-item"> <span v-if="student.TrainStatesName=='已淘汰'">淘汰原因:</span> <span v-if="student.TrainStatesName=='转到下期'">转到下期原因:</span> {{reasonResult.TrainTypeReason}}</p>
      <p class="reason-item"> <span>操作时间:</span> {{reasonResult.TrainTypeTime}}</p>
      <p class="reason-item"> <span>操作人:</span> {{reasonResult.OpertionName}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button class="export" @click="dialogFormVisible2 = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 岗后培训记录 -->
    <el-dialog title="填写培训记录" :visible.sync="dialogFormVisible3" class="after-score">
      <el-form :model="form">
        <el-form-item label="出勤情况" label-width="100px">
          <el-radio-group v-model="formAfter.Sign" @change="checkSign">
            <el-radio label="1">参加</el-radio>
            <el-radio label="-1">缺勤</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="进门考得分" label-width="100px">
          <el-input type="number" v-model="formAfter.JinmenkaoScore" auto-complete="off" placeholder="请填写100以内的整数"   @input="checkJinmenkao"></el-input> 
          <el-checkbox label="-1" v-model="formAfter.JinmenkaoSign"  @change="checkJinmenkao" true-label="true">缺勤</el-checkbox>
        </el-form-item>
        <el-form-item label="放飞自我" label-width="100px">
          <el-select v-model="formAfter.SelfLevel" placeholder="请选择"  @change="checkSelf">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
          <el-checkbox v-model="formAfter.SelfSign"  @change="checkSelf" true-label="true">缺勤</el-checkbox>
        </el-form-item>
        <el-form-item label="放飞自我评价" label-width="100px" v-if="!formAfter.SelfSign">
          <el-input type="textarea" placeholder="最多输入100个字符" :maxlength="100" v-model="formAfter.SelfComment" @input="checkSelftComment"></el-input>
        </el-form-item>
        <el-form-item label="技能课" label-width="100px" v-if="(selectIndex!=5&&selectIndex!=6)">
          <el-input type="number" v-model="formAfter.JinengScore" auto-complete="off" placeholder="请填写100以内的整数"  @input="checkJineng"></el-input>
          <el-checkbox label="-1" v-model="formAfter.JinengSign" @change="checkJineng" true-label="true">缺勤</el-checkbox>
        </el-form-item>
        <el-form-item label="技能课" label-width="100px" v-if="!(selectIndex!=5&&selectIndex!=6)">
         <el-select v-model="formAfter.JinengLevel" placeholder="请选择"  @change="checkJineng">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
          <el-checkbox label="-1" v-model="formAfter.JinengSign"  @change="checkJineng" true-label="true">缺勤</el-checkbox>
        </el-form-item>
        <el-form-item label="专业课落实" label-width="100px" v-if="selectIndex!=6">
         <el-select v-model="formAfter.ZhuanyekeLevel" placeholder="请选择"  @change="checkZhuanyeke">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
          <el-checkbox label="-1" v-model="formAfter.ZhuanyekeSign"  @change="checkZhuanyeke" true-label="true">缺勤</el-checkbox>
        </el-form-item>
        <el-form-item label="备课第一讲" label-width="100px" v-if="selectIndex!=6">
         <el-select v-model="formAfter.PrelessonLevel" placeholder="请选择"  @change="checkPrelesson">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
          </el-select>
          <el-checkbox label="-1" v-model="formAfter.PrelessonSign"  @change="checkPrelesson" true-label="true">缺勤</el-checkbox>
        </el-form-item>
        <el-form-item label="作业" label-width="100px" v-if="selectIndex!=6">
          <el-input type="number" v-model="formAfter.taskScore" auto-complete="off" placeholder="请填写100以内的整数"  @input="checkTask"></el-input>
          <el-checkbox label="-1" v-model="formAfter.taskSign"  @change="checkTask" true-label="true">缺勤</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="search-btn" @click="submitWorkAfter" :disabled="issureAfter">确 定</el-button>
        <el-button class="export" @click="giveupSubmit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import qs from 'qs';
  import Request from '../assets/request'
  export default {
    name: 'PreJobRecordDetail',
    inject:['reload'],
    data() {
      return {
        dialogFormVisible: false,
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        ajaxOver: true,
        isSure: true, // 提交分数的按钮是否可点击
        issureAfter: true,
        isSubmitReason: true, // 提交淘汰和转到下期的按钮是否可点击
        selectIndex:0,
        dialogTitle:'淘汰学员',
        textarea:'',
        student:{},
        WorkedScoreList:[],// 岗后学员评价列表
        form:{SignScore:null,ExamScore:null,TaskScore:null,LessonScore: null,LessonLevel:'',allLevel:null},
        tableData: [
          {ExamScore:null,LessonLevel:'',LessonScore:null,SignScore:null,StudentCode:"",TaskScore:null,TrainCode:"",TrainDay:1},
          {ExamScore:null,LessonLevel:'',LessonScore:null,SignScore:null,StudentCode:"",TaskScore:null,TrainCode:"",TrainDay:2},
          {ExamScore:null,LessonLevel:'',LessonScore:null,SignScore:null,StudentCode:"",TaskScore:null,TrainCode:"",TrainDay:3},
          {ExamScore:null,LessonLevel:'',LessonScore:null,SignScore:null,StudentCode:"",TaskScore:null,TrainCode:"",TrainDay:4},
        ],
        formAfter:{
          "Sign": null,"JmkExam": null, "OwnLevel": null,"OwnComment": null, "Skill": null, "Major": null,"PrepareLesson": null, "Task": null,
          JinmenkaoSign: false

        },
        tableDataAfter: [
          {"TrainCode": null,"StudentCode": null,"Sign": null,"JmkExam": null, "OwnLevel": null,"OwnComment": null, "Skill": null, "Major": null,"PrepareLesson": null, "Task": null, TrainDay:1},
          {"TrainCode": null,"StudentCode": null,"Sign": null,"JmkExam": null, "OwnLevel": null,"OwnComment": null, "Skill": null, "Major": null,"PrepareLesson": null, "Task": null, TrainDay:2},
          {"TrainCode": null,"StudentCode": null,"Sign": null,"JmkExam": null, "OwnLevel": null,"OwnComment": null, "Skill": null, "Major": null,"PrepareLesson": null, "Task": null, TrainDay:3},
          {"TrainCode": null,"StudentCode": null,"Sign": null,"JmkExam": null, "OwnLevel": null,"OwnComment": null, "Skill": null, "Major": null,"PrepareLesson": null, "Task": null, TrainDay:4},
          {"TrainCode": null,"StudentCode": null,"Sign": null,"JmkExam": null, "OwnLevel": null,"OwnComment": null, "Skill": null, "Major": null,"PrepareLesson": null, "Task": null, TrainDay:5},
          {"TrainCode": null,"StudentCode": null,"Sign": null,"JmkExam": null, "OwnLevel": null,"OwnComment": null, "Skill": null, "Major": null,"PrepareLesson": null, "Task": null, TrainDay:6},
          {"TrainCode": null,"StudentCode": null,"Sign": null,"JmkExam": null, "OwnLevel": null,"OwnComment": null, "Skill": null, "Major": null,"PrepareLesson": null, "Task": null, TrainDay:7}
        ],
        reasonResult:{
          TrainTypeReason: null,
          TrainTypeTime: null,
          OpertionName: null
        }
      }
    },
    created(){
      this.AjaxAsRouter();
    },
    methods:{
      AjaxAsRouter(){
        if(this.$route.path == '/recorddetailperson/prejobrecorddetailperson'){ // 岗前培训
          this.getStudentInfo('api/PreWork/GetPreWorkStudentInfo');
        }else if(this.$route.path == '/recorddetailperson/postjobrecorddetailperson'){ // 岗后培训
          this.getStudentInfo('api/WorkAfter/GetWorkedStudentInfo');
       
        }
      },
      showEdit(index){
        console.log(index)
        this.selectIndex = index;
        if(this.$route.path == '/recorddetailperson/prejobrecorddetailperson'){ // 岗前培训
          this.dialogFormVisible = true;
        }else if(this.$route.path == '/recorddetailperson/postjobrecorddetailperson'){ // 岗后培训
          this.dialogFormVisible3 = true;
        }
      },
      showDialog(e){
        if(e.currentTarget.dataset.text == '淘汰'){
          this.dialogTitle = '淘汰学员'
        }else if(e.currentTarget.dataset.text == '转到下期'){
          this.dialogTitle = '转到下期'
        }
        this.dialogFormVisible1 = true
      },
      checkTextarea(){ 
        this.textarea = this.textarea.replace(/(^\s*)|(\s*$)/g, "")
        if(this.textarea.length){
          this.isSubmitReason = false
        }else{
          this.isSubmitReason = true
        }
      },
      sure(){
        this.dialogFormVisible1 = false;
        if(this.$route.path == '/recorddetailperson/prejobrecorddetailperson'){ // 岗前培训记录
          if(this.dialogTitle == '淘汰学员'){
            this.submitReason(2,'api/PreWork/WeedOut')
            this.$set(this.student,'TrainStatesName','已淘汰')
          }else if(this.dialogTitle == '转到下期'){
            this.submitReason(4,'api/PreWork/WeedOut')
            this.$set(this.student,'TrainStatesName','转到下期')
          }
        }else if(this.$route.path == '/recorddetailperson/postjobrecorddetailperson'){ // 岗后培训记录
          if(this.dialogTitle == '淘汰学员'){
            this.submitReason(2,'api/WorkAfter/WeedOut')
            this.$set(this.student,'TrainStatesName','已淘汰')
          }else if(this.dialogTitle == '转到下期'){
            this.submitReason(4,'api/WorkAfter/WeedOut')
            this.$set(this.student,'TrainStatesName','转到下期')
          }
        }
      },
      showReason(){
        this.dialogFormVisible2 = true;
      },
      //提交淘汰/转到下期原因
      submitReason(TrainStates,url){
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
          api: url,
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
      //获取学员信息
      getStudentInfo(url){
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
          studentcode:this.trainStudent.StudentCode
        }
        let option = {
          type:'get',
          api: url,
          query: query,
        }
        Request(option, function(res){
          console.log(res)
          if(res.data.ResultType == 0){
              if(that.$route.path == '/recorddetailperson/prejobrecorddetailperson'){ // 岗前培训
                  that.student = res.data.AppendData.PreWorkStu;
                  console.log(that.student)
                  let scores = res.data.AppendData.stuScoreList;
                  console.log(scores)
                  that.$set(that.reasonResult,'TrainTypeReason',that.student.TrainTypeReason)
                  that.$set(that.reasonResult,'TrainTypeTime',that.student.TrainTypeTime?that.student.TrainTypeTime.substr(0,that.student.TrainTypeTime.indexOf('T')):null)
                  that.$set(that.reasonResult,'OpertionName',that.student.OpertionName)
                  for(var i = 0; i < that.tableData.length; i++){
                    for(var k = 0; k < scores.length; k++){
                      if(scores[k].TrainDay == that.tableData[i].TrainDay){
                        that.$set(that.tableData[i],'ExamScore',scores[k]['ExamScore']==null?'--':scores[k]['ExamScore'])
                        that.$set(that.tableData[i],'LessonLevel',scores[k]['LessonLevel']==null?'--':scores[k]['LessonLevel'])
                        that.$set(that.tableData[i],'LessonScore',scores[k]['LessonScore']==null?'--':scores[k]['LessonScore'])
                        that.$set(that.tableData[i],'SignScore',scores[k]['SignScore']==null?'--':scores[k]['SignScore'])
                        that.$set(that.tableData[i],'TaskScore',scores[k]['TaskScore']==null?'--':scores[k]['TaskScore'])
                      }


                    }
                  }
                  //如果四天都录入分数了, 总分小于30 置为 待组长确认  大于30 置为培训通过
                  let totalScore = 0;
                  if(scores.length == 4){
                    for(let i = 0; i < scores.length; i++){
                      for(var k in scores[i]){
                        if(k=='ExamScore' || k=='LessonScore' || k=='SignScore' ||k=='TaskScore'){
                          totalScore += scores[i][k]
                        }
                      }
                    }
                    if(totalScore >= 30 && scores[0].LessonLevel !='D' ){
                      that.$set(that.student,'TrainStatesName','培训通过')
                    }else{
                      that.$set(that.student,'TrainStatesName','待组长确认')
                    }
                  }
              }else if(that.$route.path == '/recorddetailperson/postjobrecorddetailperson'){ // 岗后培训
                 that.student = res.data.AppendData.WorkedStuInfo;
                 let scores = res.data.AppendData.WorkedScoreList;
                 that.WorkedScoreList= res.data.AppendData.WorkedScoreList;
                 for(var i = 0; i < that.tableDataAfter.length; i++){
                    for(var k = 0; k < scores.length; k++){
                      if(scores[k].TrainDay == that.tableDataAfter[i].TrainDay){
                        that.$set(that.tableDataAfter[i],'Sign',scores[k]['Sign']==null?'--':(scores[k]['Sign']==-1?'缺勤':scores[k]['Sign']))
                        that.$set(that.tableDataAfter[i],'JmkExam',scores[k]['JmkExam']==null?'--':(scores[k]['JmkExam']==-1?'缺勤':scores[k]['JmkExam']))
                        that.$set(that.tableDataAfter[i],'OwnLevel',scores[k]['OwnLevel']==null?'--':(scores[k]['OwnLevel']==-1?'缺勤':scores[k]['OwnLevel']))
                        that.$set(that.tableDataAfter[i],'OwnComment',scores[k]['OwnComment']==null?'--':scores[k]['OwnComment'])
                        that.$set(that.tableDataAfter[i],'Skill',scores[k]['Skill']==null?'--':(scores[k]['Skill']==-1?'缺勤':scores[k]['Skill']))
                        that.$set(that.tableDataAfter[i],'Major',scores[k]['Major']==null?'--':(scores[k]['Major']==-1?'缺勤':scores[k]['Major']))
                        that.$set(that.tableDataAfter[i],'PrepareLesson',scores[k]['PrepareLesson']==null?'--':(scores[k]['PrepareLesson']==-1?'缺勤':scores[k]['PrepareLesson']))
                        that.$set(that.tableDataAfter[i],'Task',scores[k]['Task']==null?'--':(scores[k]['Task']==-1?'缺勤':scores[k]['Task']))
                      }
                    }
                  }
                  console.log(that.tableDataAfter)
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
      },
      //岗前 校验填写的分数
      checkJinMenKao(){
        if(this.form.ExamScore &&(this.form.ExamScore < 0 || this.form.ExamScore > 2)) {
          this.$message.error('进门考得分必须在0-2之间');
          this.check()
          return;
        }
        this.check()
      },
      //岗前 验证作业
      checkZuoYe(){
        if(this.form.TaskScore&&(this.form.TaskScore < 0 || this.form.TaskScore > 2.5)) {
          this.$message.error('作业得分必须在0-2.5之间')
          this.check()
          return;
        }
        this.check()
      },
      //岗前 验证练课
      checkLianKe(){
        if(this.form.LessonScore&&(this.form.LessonScore < 0 || this.form.LessonScore > 10)) {
          this.$message.error('练课得分必须在0-10之间')
          this.check()
          return;
        }
        this.check()
      },
      check(){
        let ExamScoreFalg = this.form.ExamScore >0 && this.form.ExamScore <=2;
        let TaskScoreFalg = this.form.TaskScore >0 && this.form.TaskScore <= 2.5;
        let LessonScoreFalg = this.form.LessonScore > 0 && this.form.LessonScore <=10
        if(this.selectIndex == 0){
          if( LessonScoreFalg && this.form.SignScore && this.form.LessonLevel){
            this.isSure = false;
          }else{
            this.isSure = true;
          }
        }else{
          if( ExamScoreFalg && TaskScoreFalg && LessonScoreFalg && this.form.SignScore && this.form.LessonLevel){
            this.isSure = false;
          }else{
            this.isSure = true;
          }
        }
      },
      // 岗后
      checkAfter(){

        let JmkExamFalg = (this.formAfter.JmkExam >0 && this.formAfter.JmkExam <=100 )|| this.formAfter.JmkExam == -1;
        let TaskFalg = (this.formAfter.Task > 0 && this.formAfter.Task <= 100) || this.formAfter.Task == -1
        let SkillFalg;
        if(this.selectIndex !=5 && this.selectIndex !=6){
           SkillFalg = (this.formAfter.Skill >0 && this.formAfter.Skill <= 100|| this.formAfter.Skill == -1);
        }else{
           SkillFalg = this.formAfter.Skill!= null || this.formAfter.Skill!= '';
        }

        var after = this.formAfter;
  
        
        // 1-6 天
        if(this.selectIndex != 6){
          if(after.Sign&&JmkExamFalg&&after.OwnLevel&&SkillFalg&&after.Major&&after.PrepareLesson&&TaskFalg){
            this.issureAfter = false
          }else{
            this.issureAfter = true
          }
        }else{
          if(after.Sign&&JmkExamFalg&&after.OwnLevel&&SkillFalg){
            this.issureAfter = false
          }else{
            this.issureAfter = true
          }
        }
      },
      //岗后 验证考勤
      checkSign(e){  
        this.formAfter.Sign = e
        if(e == -1){
          this.$set(this.formAfter,'JinmenkaoSign',true)
          this.$set(this.formAfter,'JinmenkaoScore',null)
          this.$set(this.formAfter,'SelfSign',true)
          this.$set(this.formAfter,'SelfLevel',null)
          this.$set(this.formAfter,'JinengSign',true)
          this.$set(this.formAfter,'JinengLevel',null)
          this.$set(this.formAfter,'JinengScore',null)
          this.$set(this.formAfter,'ZhuanyekeSign',true)
          this.$set(this.formAfter,'ZhuanyekeLevel',null)
          this.$set(this.formAfter,'PrelessonSign',true)
          this.$set(this.formAfter,'PrelessonLevel',null)
          this.$set(this.formAfter,'taskSign',true)
          this.$set(this.formAfter,'taskScore',null)
          this.$set(this.formAfter,'JmkExam',-1)
          this.$set(this.formAfter,'OwnLevel',-1)
          this.$set(this.formAfter,'Skill',-1)
          this.$set(this.formAfter,'Major',-1)
          this.$set(this.formAfter,'PrepareLesson',-1)
          this.$set(this.formAfter,'Task',-1)
        }else{
          this.$set(this.formAfter,'JinmenkaoSign',false)
          this.$set(this.formAfter,'SelfSign',false)
          this.$set(this.formAfter,'JinengSign',false)
          this.$set(this.formAfter,'ZhuanyekeSign',false)
          this.$set(this.formAfter,'PrelessonSign',false)
          this.$set(this.formAfter,'taskSign',false)
        }
        console.log(this.formAfter.Sign)
        this.checkAfter()
      },
      //岗后 验证进门考
      checkJinmenkao(e){
        this.$set(this.formAfter,'JmkExam',e)
        // this.form.JmkExam = e
        if(this.formAfter.JmkExam &&(this.formAfter.JmkExam < 0 || this.formAfter.JmkExam > 100)) {
          this.$message.error('进门考得分必须在0-100之间');
          this.checkAfter()
          return;
        }
        if(e == 'true'){
          this.$set(this.formAfter,'JinmenkaoSign',true)
          this.$set(this.formAfter,'JinmenkaoScore',null)
          this.$set(this.formAfter,'JmkExam',-1)
        }else {
          this.$set(this.formAfter,'JinmenkaoSign',false)
        }
        

        this.checkAfter()
      },
      //岗后 验证放飞自我评级
      checkSelf(e){
        // this.form.OwnLevel = e
        this.$set(this.formAfter,'OwnLevel',e)
        if(e == 'true'){
          this.$set(this.formAfter,'SelfSign',true)
          this.$set(this.formAfter,'SelfLevel',null)
          this.$set(this.formAfter,'OwnLevel',-1)
        }else{
          this.$set(this.formAfter,'SelfSign',false)
        }
          console.log(this.formAfter.SelfSign)

         this.checkAfter()
      },
      //岗后 验证放飞自我评价
      checkSelftComment(e){
        // this.form.OwnComment = e
         this.$set(this.formAfter,'OwnComment',e)
         this.checkAfter()
      },
      //岗后 验证技能课
      checkJineng(e){
        // this.form.Skill = e
        this.$set(this.formAfter,'Skill',e)
        if(this.selectIndex != 5 && this.selectIndex != 6){
          if(this.formAfter.Skill &&(this.formAfter.Skill < 0 || this.formAfter.Skill > 100)) {
            this.$message.error('作业得分必须在0-100之间');
            this.checkAfter()
            return;
          }
        }
        if(e == 'true'){
          this.$set(this.formAfter,'JinengSign',true)
          this.$set(this.formAfter,'JinengScore',null)
          this.$set(this.formAfter,'Skill',-1)
        }else{
          this.$set(this.formAfter,'JinengSign',false)
        }
        
        this.checkAfter()
      },
      //岗后 验证专业课
      checkZhuanyeke(e){
        // this.form.Major = e
        this.$set(this.formAfter,'Major',e)
        if(e == 'true'){
          this.$set(this.formAfter,'ZhuanyekeSign',true)
          this.$set(this.formAfter,'ZhuanyekeLevel',null)
          this.$set(this.formAfter,'Major',-1)
        }else{
          this.$set(this.formAfter,'ZhuanyekeSign',false)
        }
        this.checkAfter()
      },
      //岗后 验证第一讲备课
      checkPrelesson(e){
        // this.form.PrepareLesson = e
        this.$set(this.formAfter,'PrepareLesson',e)
        if(e == 'true'){
          this.$set(this.formAfter,'PrelessonSign',true)
          this.$set(this.formAfter,'PrelessonLevel',null)
          this.$set(this.formAfter,'PrepareLesson',-1)
        }else{
           this.$set(this.formAfter,'PrelessonSign',false)
          }
         this.checkAfter()
      },
      //岗后 验证作业
      checkTask(e){
        // this.form.Task = e
         this.$set(this.formAfter,'Task',e)
         if(this.formAfter.Task &&(this.formAfter.Task < 0 || this.formAfter.Task > 100)) {
          this.$message.error('作业得分必须在0-100之间');
          this.checkAfter()
          return;
        }
         if(e == 'true'){
          this.$set(this.formAfter,'taskSign',true)
          this.$set(this.formAfter,'taskScore',null)
          this.$set(this.formAfter,'Task',-1)
        }else{
          this.$set(this.formAfter,'taskSign',false)
        }
         this.checkAfter()
      },
      // 提交岗后学生评价
      submitWorkAfter(){
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
        console.log(this.formAfter);
        // return;
        let data = {
            "TrainCode": this.student.TrainCode,
            "StudentCode": this.student.StudentCode,
            "TrainDay": this.selectIndex+1,  // 填写第几天
            "Sign": this.formAfter.Sign == -1? false: true,    // 是否缺勤
            "JmkExam": this.formAfter.JmkExam,    // 进门考分数
            "OwnLevel":this.formAfter.OwnLevel, // 放飞自我评级
            "OwnComment": this.formAfter.OwnComment, // 放飞自我评价
            "Skill": this.formAfter.Skill, // 技能课
            "Major": this.formAfter.Major, // 专业课落实
            "PrepareLesson": this.formAfter.PrepareLesson,  // 备课第一讲
            "Task": this.formAfter.Task,  // 作业
            "CreateTime": null,
            "OperationCode": null
        }
        let option = {
          type:'post',
          api: 'api/WorkAfter/SaveWorkedScore',
          query: query,
          data: qs.stringify(data)
        }

        Request(option, function(res){
          that.dialogFormVisible3 = false;

          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })

            that.reload();

        
            // that.$set(that.tableData[that.selectIndex],'ExamScore', that.form.ExamScore == null? '--':that.form.ExamScore)
            // that.$set(that.tableData[that.selectIndex],'LessonLevel', that.form.LessonLevel == null? '--':that.form.LessonLevel)
            // that.$set(that.tableData[that.selectIndex],'LessonScore', that.form.LessonScore == null? '--':that.form.LessonScore)
            // that.$set(that.tableData[that.selectIndex],'SignScore', that.form.SignScore == null? '--':that.form.SignScore)
            // that.$set(that.tableData[that.selectIndex],'TaskScore', that.form.TaskScore == null? '--':that.form.TaskScore)

           

           
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
      // 提交岗前学生分数
      submitScore(){
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
            "TrainDay": this.selectIndex+1,
            "SignScore": this.form.SignScore,
            "ExamScore": this.form.ExamScore,
            "TaskScore": this.form.TaskScore,
            "LessonScore": this.form.LessonScore,
            "LessonLevel": this.form.LessonLevel,
            "CreateTime": null,
            "OperationCode": null
        }

        let option = {
          type:'post',
          api: 'api/PreWork/SavePreWorkScore',
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



            // 如果为D就置为 待组长确认状态
            if(that.form.LessonLevel == 'D'){
              that.$set(that.student,'TrainStatesName', '待组长确认')
              that.$set(that.student,'TrainStates', 5)
            }

            that.$set(that.tableData[that.selectIndex],'ExamScore', that.form.ExamScore == null? '--':that.form.ExamScore)
            that.$set(that.tableData[that.selectIndex],'LessonLevel', that.form.LessonLevel == null? '--':that.form.LessonLevel)
            that.$set(that.tableData[that.selectIndex],'LessonScore', that.form.LessonScore == null? '--':that.form.LessonScore)
            that.$set(that.tableData[that.selectIndex],'SignScore', that.form.SignScore == null? '--':that.form.SignScore)
            that.$set(that.tableData[that.selectIndex],'TaskScore', that.form.TaskScore == null? '--':that.form.TaskScore)

            // 如果当前是最后一次添加, 计算总分数, 小于30分设为 待组长确认, 大于等于30分 则为培训通过
            function falg(){
              for(let i = 0; i < that.tableData.length; i++){
                for(var k in that.tableData[i]){
                  if(that.tableData[i].LessonLevel == '') return false;
                }
              }
              return true;
            }
            if(falg()){
              var totalScore = 0;
              for(let i = 0; i <  that.tableData.length; i++){
                for(var k in  that.tableData[i]){
                  if(k =='ExamScore' || k =='LessonScore' || k =='SignScore' ||k =='TaskScore'){
                    if(that.tableData[i][k] == '--'){
                      that.tableData[i][k] = 0;
                    }
                    totalScore +=  Number(that.tableData[i][k])
                  }
                }
              }
              if(totalScore >= 30){
                that.$set(that.student,'TrainStatesName','培训通过')
              }else{
                that.$set(that.student,'TrainStatesName','待组长确认')
              }
            }

            that.form = {SignScore:null,ExamScore:null,TaskScore:null,LessonScore: null,LessonLevel:''};
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
      //岗后 保存综合评价
      saveLevel(){
        let that = this;
        const loading = this.$loading({
          lock: true,
          text: '保存中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let date = new Date();
        let query = {
          traintype: 3,
          timestamp:date.getTime(),
          appid:this.appid,
          token: this.token
        }
        let data = {
            "TrainCode": this.student.TrainCode,
            "StudentCode": this.student.StudentCode,
            "IsSign": null,
            "MajorLevel": null,
            "SkillLevel": null,
            "TrainLevel": this.form.allLevel,
            "Comment": null
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
      },
      //放弃提交
      giveupSubmit(){
        this.form ={SignScore:null,ExamScore:null,TaskScore:null,LessonScore: null,LessonLevel:''};
        this.dialogFormVisible = false;
        this.dialogFormVisible3 = false;
      }
      
    },
    computed:{
      gqtaotai:function(){
        let allCodes = JSON.stringify(this.$storage.getStorage('allCodes'));
        console.log(allCodes)
        return allCodes.indexOf('gqtaotai') != -1? true: false;
      },
      ghtaotai:function(){
        let allCodes = this.$storage.getStorage('allCodes');
        return JSON.stringify(allCodes).indexOf('ghtaotai') != -1? true: false;
      },
      gangqianjilutianxie:function(){
        let allCodes = this.$storage.getStorage('allCodes');
        return JSON.stringify(allCodes).indexOf('gangqianjilutianxie') != -1? true: false;
      },
      ganghoujilutianxie:function(){
        let allCodes = this.$storage.getStorage('allCodes');
        return JSON.stringify(allCodes).indexOf('ganghoujilutianxie') != -1? true: false;
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
  
  .after-score{
    .el-input{
      width: 60%;
      margin-right: 10px;
    }
    .el-select{
      width: 60%;
      margin-right: 10px;
      .el-input{
        width: 100%;
      }
    }
  }
  .el-checkbox{
    width: 18px;
    height: 18px;
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
    .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
      
  }
</style>