<template>
  <div class="newbefore">
    <p class="title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-if="($route.path == '/new/newprejob'||$route.path == '/new/newpostjob')"><i class="icon-left-arrow"></i>新建<span v-if="($route.path == '/new/newprejob')">岗前</span><span v-if="($route.path == '/new/newpostjob')">岗后</span>培训</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.path == '/new/newanswer'"><i class="icon-left-arrow"></i>新建答辩</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.path == '/new/newexam'"><i class="icon-left-arrow"></i>新建复试</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <p class="tip" v-if="($route.path == '/new/newprejob'||$route.path == '/new/newpostjob')">
      <i class="icon-warm"></i>
      <span>请填写培训信息，提交后本次培训学员将收到短信通知。</span>
    </p>
    <p class="title1">
        <span v-if="($route.path == '/new/newprejob'||$route.path == '/new/newpostjob')">培训信息</span>
        <span v-if="$route.path == '/new/newanswer'">答辩信息</span>
        <span v-if="$route.path == '/new/newexam'">复试信息</span>
    </p>
    <div class="form">
      <el-form ref="form" :model="form" label-width="126px">
        <el-form-item :label="($route.path == '/new/newanswer'?'答辩名称':($route.path == '/new/newexam'?'复试名称':'培训名称'))">
          <el-input v-model="form.trainName"  @input="check" :maxlength="30" :placeholder="$route.path == '/new/newanswer'?'请填写答辩名称，最长30个字符':($route.path == '/new/newexam'?'请填写复试名称，最长30个字符':'请填写培训名称，最长30个字符')" class="input-text"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" v-if="$route.path == '/new/newprejob'||$route.path == '/new/newpostjob'" class="time">
            <div class="time-input">
              <el-date-picker  
              type="date" 
              placeholder="开始日期" 
              :editable="false"
              :clearable="true" 
              v-model="form.beginDate" 
              class="date-width"
              :picker-options="pickerOptions0" 
              @input="check">
              </el-date-picker>
            </div>
            <div class="line" > -- </div>
            <div class="time-input">
              <el-date-picker 
              type="date" 
              placeholder="结束日期" 
              :editable="false"
              :clearable="true" 
              v-model="form.endDate" 
              class="date-width"
              :picker-options="pickerOptions1" 
              @input="check">
              </el-date-picker>
            </div>
            <div class="day-time">
              <el-time-picker placeholder="每天开始培训的时间" :clearable="false" v-model="form.dayTime"  @input="check"></el-time-picker>
            </div>
    
        </el-form-item>
        <el-form-item label="答辩时间" v-if="$route.path == '/new/newanswer'">
            <el-date-picker 
            type="datetime" 
            :editable="false" 
            placeholder="答辩时间" 
            :clearable="true" 
            v-model="form.beginDate" 
            class="date-width2"
            :picker-options="pickerOptions0" 
            @input="check">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="复试时间" v-if="$route.path == '/new/newexam'">
            <el-date-picker 
            type="datetime" 
            :editable="false" 
            placeholder="复试时间" 
            :clearable="true" 
            v-model="form.beginDate" 
            class="date-width2"
            :picker-options="pickerOptions0" 
            @input="check">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item :label="($route.path == '/new/newanswer'?'答辩地点':($route.path == '/new/newexam'?'复试地点':'培训地点'))" v-if="$route.path != '/new/newanswer'">
            <el-input v-model="form.address" @input="check" :maxlength="50" :placeholder="$route.path == '/new/newanswer'?'请填写答辩地点，最长50个字符':'请填写培训地点，最长50个字符'" class="input-text"></el-input>
        </el-form-item>
        <el-form-item :label="($route.path == '/new/newanswer'?'答辩学员':($route.path == '/new/newexam'?'复试学员':'培训学员'))">
          <p class="select-num">待培训: {{dataTotalNum}}人  <span>已选择: {{selectNum}}人</span></p>
        </el-form-item>
        <el-form-item label="" label-width="56px" v-if="selectData.length">
          <div class="names" style="border: 1px solid #ccc">
          <el-tag
            v-for="tag in selectData"
            :key="tag.Code"
            closable
            type="success"
            @close="closeTag(tag)">
            {{tag.Name}}
          </el-tag>
          <el-button type="danger" class="clear"  @click="clear">全部移除</el-button>
          </div>
        </el-form-item>
        <el-form-item label=""  label-width="56px">
          <el-form>
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
            <el-form-item label="姓名" label-width="40px">
              <el-input v-model="form.name" placeholder="审批人" class="select-width"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button class="search-btn" @click="searchStudent">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-form-item>
        
        
        <el-form-item label="" label-width="27px">
          <div class="table">
            <el-table
              :data="tableData"
              :row-key="getRowKeys"
              @select="selectionChange"
              @select-all="selectAll"
              ref="multipleTable">
              <el-table-column
                type="selection"
                width="55"
                reserve-selection>
              </el-table-column>
              <el-table-column
                prop="Name"
                label="姓名">
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
                prop="InterviewDate"
                label="面试时间">
              </el-table-column>
              <el-table-column
                prop="FromTypeName"
                label="来源">
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="" label-width="0" >
          <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
        </el-form-item>
        <el-form-item label="" label-width="0" >
          <p class="title1" v-if="$route.path == '/new/newexam'">
            <span>实习任务</span>
          </p>
        </el-form-item>
        <p class="tip" v-if="$route.path == '/new/newexam'"><i class="icon-warm"></i>请设置通过复试后需要完成的实习任务信息</p>
        <el-form-item class="exam" v-if="$route.path == '/new/newexam'" label-width="46px">
          <p class="title2"><i class="el-icon-star-on"></i><span>听课任务</span></p>
          <p>听课数量:<el-input type="number" v-model="form.lessonNum"  @input="check"></el-input>截止时间:
            <el-date-picker
              v-model="form.lessonNumTime"
              type="datetime"
              placeholder="选择日期时间"
              @change="check">
            </el-date-picker>
          </p>
          <p class="title2"> <i class="el-icon-star-on"></i><span>实习期作业</span></p>
          <p>截止时间:
            <el-date-picker
              v-model="form.lessonEndTime"
              type="datetime"
              placeholder="选择截止时间"
              @change="check">
            </el-date-picker>
          </p>
        </el-form-item>
        <el-form-item label-width="46px" >
          <el-button type="primary" class="search-btn" @click="onSubmit" :disabled="disabledBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span class="msg"><i class="icon-yes" v-if="msg == '创建培训成功'"></i><i class="icon-warm" v-if="msg != '创建培训成功'"></i>{{msg}}</span>
      <span slot="footer" class="dialog-footer" v-if="msg != '创建培训成功'">
        <el-button class="search-btn" @click="submit">确 定</el-button>
        <el-button class="export" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog> 

  </div>
</template>
<!-- 新建岗前培训   新建岗后培训  新建答辩  新建复试 -->
<script>
  import { mapState } from 'vuex';
  import qs from 'qs';
  // import Vue from 'vue';
  import Request from '../assets/request'
  export default {
    name: 'Main1',
    inject:  ['reload'],
    data() {
      return {
        tags:[{name:'标签'}],
        RouterFrom:'',
        dialogVisible: false,
        disabledBtn: true,

        pageNum: 1,
        dataTotalNum: 0,
        pageTotal:0,

        form:{ 
         trainName:'', // 分组名称
         name: null,     // 搜索姓名
         selectXueKe: null,
         selectXueBu: null,
         beginDate:'',
         endDate:'',
         address:'',
         dayTime:'',
         lessonNum:'', //听课数量
         lessonEndTime:'', //听课截止时间
       },

      name: null,     // 搜索姓名
      selectXueKe: -1,
      selectXueBu: -1,


        // pickerOptions0: {
        //   disabledDate(time) {
        //     //return time.getTime() < Date.now() - 8.64e7;
        //   }
        // }, 
        pickerOptions0: {
          disabledDate: (time) => {
            if(this.form.endDate){
              return time.getTime() < Date.now()- 8.64e7 || time.getTime() > new Date(this.form.endDate).getTime();
            }else{
              return time.getTime() < Date.now() - 8.64e7;
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
             if(this.form.beginDate){
              return  time.getTime() < Date.now()- 8.64e7 || time.getTime() < new Date(this.form.beginDate).getTime();
            }else{
              return time.getTime() > Date.now();
            }
             
          }
        },
        msg:'',
        XueKe: [],
        XueBu: [],
        tableData: [],
        selectData:[], // 选择的学员
        selectNum: 0,  //选择的学员数量
        nowpageSelect:[],// 翻页时当前页被选中的项
        nowpageSelectNot:[],// 勾选时没有选中的项
        nowSelect:0, // 当前页面勾选的数量, 每次翻页都重置为0
        oldSelect:[], // checkbox选择前 当前页选中的学院
        newSelect:[], // checkbox选择后 当前页选中的学院
        allDatas:[], //点过的所有页码的数据
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

    created(vm){
      this.init();
      this.AjaxAsRouter()
    },
    watch:{
      $route(to) {
        this.init()
        this.AjaxAsRouter()
      }
    },
    methods:{
      init(){
        let routerFrom = window.VueObj.RouterFrom
        this.XueBu = this.$storage.getStorage('XueBu');
        this.XueKe = this.$storage.getStorage('XueKe');
       // console.log(window.VueObj.RouterFrom)
        // pageNum 要记录刷新时的pageNum 和初始化是的pageNum
        if( routerFrom == '/' ){
          this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
        }else{
          this.pageNum = 1
        }

      },
      AjaxAsRouter(){
        if(this.$route.path == '/new/newprejob'){ // 新建岗前培训
          this.getStudents(this.pageNum,'api/PreWork/GetCurrentPreWorkStudent');
        }else if(this.$route.path == '/new/newpostjob'){ // 新建岗后培训
          this.getStudents(this.pageNum,'api/WorkAfter/GetCurrentWorkedStudent');
        }else if(this.$route.path == '/new/newexam'){ // 新建复试
          this.getStudents(this.pageNum,'api/PreWorkSecond/GetCurrentSecondStudent');
          // this.getSecondStudents(this.pageNum,)
        }else if(this.$route.path == '/new/newanswer'){ // 新建答辩
          this.getStudents(this.pageNum,'api/Reply/GetCurrentSecondStudent');
        }
      },
      // 关闭一个tag
      closeTag(tag){
          this.selectData = this.noRepeatArr(this.selectData,['Code'])
          // console.log(this.selectData.indexOf(tag))
          this.selectData.splice(this.selectData.indexOf(tag), 1);
          this.selectNum--;
          console.log(this.selectData)
           //看看有没有选中的项 有的话就默认显示
            if(this.selectData.length){
              // console.log(this.allDatas)
              for(var j = 0; j < this.selectData.length; j++){
                for(var k = 0; k < this.allDatas.length; k++){
                  if( this.allDatas[k].Code == this.selectData[j].Code){
                    this.nowpageSelect.push(this.allDatas[k])
                  }
                }
              }
              this.toggleSelection([tag])
            }else{
              this.$refs.multipleTable.clearSelection();
            }

      },
      // 关闭所有tag
      clear(){
        this.selectNum = 0;
        this.selectData = [];
        this.$refs.multipleTable.clearSelection();
      },
      // 搜索
      searchStudent(){
        this.pageNum = 1;
        if(this.form.selectXueKe){
          this.selectXueKe = this.form.selectXueKe
        }else{
          this.form.selectXueKe = -1
        }
        if(this.form.selectXueBu){
          this.selectXueBu = this.form.selectXueBu
        }else{
          this.form.selectXueBu = -1
        }
        if(this.form.name){
          this.name = this.form.name
        }else{
          this.form.name = null
        }
        this.AjaxAsRouter();
      },
      //提交分组提示
      onSubmit() {
        this.dialogVisible = true;
        this.msg = '请检查信息是否准确,提交后本次学员将会收到短信通知！'
      },
      // 设置row-key
      getRowKeys(row) {
        return row.Code;
      },
      // 全选
      selectAll(e){
        // 去重
        if(this.selectData.length){
          this.selectData = this.noRepeatArr(this.selectData,['Code'])
        }
        if(e.length){ // 勾选状态
          if(this.nowpageSelect.length){ // 翻页时已经勾选的数量
            this.selectNum +=  (this.tableData.length - this.nowpageSelect.length);
          }else if(this.nowSelect){ // 在当前页先勾选后 再勾全选
            this.selectNum +=  (this.tableData.length - this.nowSelect);
          }else{ // 直接勾选全选
            this.selectNum +=  this.tableData.length;
          }

          this.nowSelect = this.tableData.length; //将本页选中的数量置为当前页的学生数量
          this.selectData = this.selectData.concat(this.tableData)
          this.selectData = this.noRepeatArr(this.selectData,['Code'])

        }else{ // 取消勾选状态

          this.selectNum -= this.tableData.length;
          this.nowSelect = 0; //将本页选中的数量置为0
          //删除selectData中的tableData
          for(let i = 0; i < this.selectData.length; i++){
            for(let k = 0; k < this.tableData.length; k++){
              if(this.tableData[k].Code == this.selectData[i].Code){
                 this.selectData.splice(i,1);
              }
            }
          }
        }
        this.check();
      },
      // 选择学员
      selectionChange(a,b){
        if(this.selectData.length){
          this.selectData = this.noRepeatArr(this.selectData,['Code'])
        }
        // this.newSelect = a;
        
        var isIn = a.indexOf(b)
        if(isIn == -1){
          this.selectNum--;
          this.nowSelect--;
          // console.log(this.oldSelect)

          // if(this.oldSelect.indexOf(b) != -1){
            this.selectData.forEach((item,index)=>{
              if(b.Code == item.Code){
                this.selectData.splice(index, 1);
              }
            })
          
            this.selectData = this.noRepeatArr(this.selectData,['Code'])

        }else{
          this.selectNum++;
          this.nowSelect++;
          // this.oldSelect = this.newSelect;
          this.selectData.push(b)
          this.selectData = this.noRepeatArr(this.selectData,['Code'])

        }
        this.check();
      },
      // 验证 控制提交按钮是否可用
      check(e){
        var reg = /(^\s*)|(\s*$)/g;
        if(this.$route.path == '/new/newprejob' || this.$route.path == '/new/newpostjob'){ //如果是新建岗前/岗后培训
          if(this.form.trainName.replace(reg,'') && this.form.address.replace(reg,'') && this.form.beginDate && this.form.endDate && this.form.dayTime && this.selectNum){
            this.disabledBtn = false;
          }else{
            this.disabledBtn = true;
          }
        }else if(this.$route.path == '/new/newexam' ){ // 新建复试
          if(this.form.trainName.replace(reg,'') && this.form.address.replace(reg,'') && this.form.beginDate&& this.selectNum&& this.form.lessonNum&& this.form.lessonNumTime&& this.form.lessonEndTime){
            this.disabledBtn = false;
          }else{
            this.disabledBtn = true;
          }
        }else if(this.$route.path == '/new/newanswer'){
          if(this.form.trainName.replace(reg,'') && this.form.beginDate && this.selectNum){
            this.disabledBtn = false;
          }else{
            this.disabledBtn = true;
          }
        }
      },
      
      // 上一页
      prevPage(){
        // this.selectData = this.selectData.concat(this.oldSelect)
        //去重
        if(this.selectData.length){
          this.selectData = this.noRepeatArr(this.selectData,['Code'])
        }
        
        // this.newSelect = [];
        // this.oldSelect = [];
        this.nowSelect = 0; // 翻页将当前页面已经选的置为0
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
        // this.selectData = this.selectData.concat(this.oldSelect)
        //去重
        if(this.selectData.length){
          this.selectData = this.noRepeatArr(this.selectData,['Code'])
        }
        // this.newSelect = [];
        // this.oldSelect = [];
        this.nowSelect = 0; // 翻页将当前页面已经选的置为0

        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.AjaxAsRouter()
      },
      submit(){
        if(this.$route.path == '/new/newprejob'){ // 新建岗前培训
          this.submitFun('api/PreWork/CreateTrainInfo');
        }else if(this.$route.path == '/new/newpostjob'){ // 新建岗后培训
          this.submitFun('api/WorkAfter/CreateTrainInfo');
        }else if(this.$route.path == '/new/newexam'){ // 新建复试
          this.submitFun('api/PreWorkSecond/CreateTrainInfo');
        }else if(this.$route.path == '/new/newanswer'){ // 新建答辩
          this.submitFun('api/Reply/CreateTrainInfo');
        }
      },
      //提交岗前培训分组
      submitFun(url){
        //去重后提交;
        this.selectData = this.noRepeatArr(this.selectData,['Code'])

        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        var codes = [];
        for(let i = 0; i < this.selectData.length; i++){
          codes.push(this.selectData[i].Code)
        }
        let data = {};
        if(this.$route.path == '/new/newprejob' || this.$route.path == '/new/newpostjob' ||this.$route.path == '/new/newanswer'){
          data = {
            TrainName: this.form.trainName,
            BeginDate: this.form.beginDate,
            FuTime: this.form.beginDate,
            EndDate: this.form.endDate,
            EveryDayTime: this.form.dayTime,
            TrainArea: this.form.address,
            StudentCodes: codes
          }
        }else if(this.$route.path == '/new/newexam'){
          data = {
            PraticeTask: {
                ListenLesson: this.form.lessonNum,
                ListenTime: this.form.lessonNumTime,
                TaskEndTime: this.form.lessonEndTime
              },
            CreateTrainWork: {
              TrainName: this.form.trainName,
              BeginDate: this.form.beginDate,
              FuTime: this.form.beginDate,
              EndDate: null,
              EveryDayTime: null,
              TrainArea: this.form.address,
              StudentCodes: codes
            }
          }
        }
        

        let option = {
          type:'post',
          api: url,
          query: query,
          data: qs.stringify(data)
        }
        Request(option, function(res){
          console.log(res)
          if(res.data.ResultType == 0){
            that.dialogVisible = true;
            if(that.$route.path == '/new/newanswer'){
              that.msg = '创建答辩成功';
            }else if(that.$route.path == '/new/newexam'){
              that.msg = '创建复试成功';
            }else{
              that.msg = '创建培训成功';
            }
            setTimeout(()=>{
              that.dialogVisible = false;
              that.reload();
            },1000)
          }else{
            that.$message.error(res.data.Message)
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }
          }
        })
      },

      /*==    新建岗前培训    ====================================================================================*/
      // 获取/ 搜索 参加培训的学员
      getStudents(pageIndex,url){        
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
          xueke:this.selectXueKe,
          name:this.form.name
        }
        let option = {
          type:'get',
          api: url,
          query: query,
        }
        Request(option, function(res){

          if(res.data.ResultType == 0){
            that.nowpageSelect = [];
            that.tableData = res.data.AppendData.DataList;
            that.allDatas = that.allDatas.concat(that.tableData)
            for(var i = 0 ;i < that.tableData.length; i++){
              // 修改面试时间
              for(var k in that.tableData[i]){
                if(k == 'InterviewDate'){
                  that.tableData[i][k] = that.tableData[i][k].substr(0,that.tableData[i][k].indexOf('T'))
                }
              }
            }
            // 页码
            that.pageNum = that.tableData.length==0? 0:res.data.AppendData.PageIndex;
            that.dataTotalNum = res.data.AppendData.TotalCount;
            that.pageTotal = Math.ceil(that.dataTotalNum / that.pageSize);

            //看看有没有选中的项 有的话就默认显示
            if(that.selectData.length){
              for(var j = 0; j < that.selectData.length; j++){
                for(var k = 0; k < that.tableData.length; k++){
                  if( that.tableData[k].Code == that.selectData[j].Code){
                    that.nowpageSelect.push(that.tableData[k])
                  }
                }
              }
              // 如果是全选 就将所有选中的都清除, 然后再勾选
              if(!(pageIndex == that.pageTotal && that.nowpageSelect.length == that.dataTotalNum % that.pageSize)){
                that.$refs.multipleTable.clearSelection();
              }
              that.toggleSelection(that.nowpageSelect)
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


      /*=====================================================================================================*/

      /*==    新建复试    ====================================================================================*/

      // 获取/ 搜索 复试的学员
      getSecondStudents(pageIndex){
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
          xueke:this.selectXueKe,
          name:this.form.name
        }
        let option = {
          type:'get',
          api: 'api/PreWorkSecond/GetCurrentSecondStudent',
          query: query,
        }
        Request(option, function(res){
          console.log(res)
          if(res.data.ResultType == 0){
            that.nowpageSelect = [];
            that.tableData = res.data.AppendData.DataList;
            that.allDatas = that.allDatas.concat(that.tableData)
            for(var i = 0 ;i < that.tableData.length; i++){
              // 修改面试时间
              for(var k in that.tableData[i]){
                if(k == 'InterviewDate'){
                  that.tableData[i][k] = that.tableData[i][k].substr(0,that.tableData[i][k].indexOf('T'))
                }
              }
            }
            // 页码
            that.pageNum = res.data.AppendData.PageIndex;
            that.dataTotalNum = res.data.AppendData.TotalCount;
            that.pageTotal = Math.ceil(that.dataTotalNum / that.pageSize);

            //看看有没有选中的项 有的话就默认显示
            if(that.selectData.length){
              for(var j = 0; j < that.selectData.length; j++){
                for(var k = 0; k < that.tableData.length; k++){
                  if( that.tableData[k].Code == that.selectData[j].Code){
                    that.nowpageSelect.push(that.tableData[k])
                  }
                }
              }
              // 如果是全选 就将所有选中的都清除, 然后再勾选
              if(!(pageIndex == that.pageTotal && that.nowpageSelect.length == that.dataTotalNum % that.pageSize)){
                that.$refs.multipleTable.clearSelection();
              }
              that.toggleSelection(that.nowpageSelect)

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

      /*=====================================================================================================*/


      obj2key(obj, keys){  
          var n = keys.length,  
              key = [];  
          while(n--){  
              key.push(obj[keys[n]]);  
          }  
          return key.join('|');  
      } , 
      //去除数组中重复的对象
      noRepeatArr(array,keys){
        var arr = [];  
        var hash = {};  
        for (var i = 0, j = array.length; i < j; i++) {  
            var k = this.obj2key(array[i], keys);  
            if (!(k in hash)) {  
                hash[k] = true;  
                arr.push(array[i]);  
            }  
        }  
        return arr;  
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        }
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

  .newbefore{
    width: 100%;

    .title2{
      font-size: 14px;
      padding-top: 10px;
      padding-bottom: 10px;
      i{
        color: #33c27c;
        padding-right: 10px;
      }
    }
    .exam .el-input{
      display: inline-block;
      width: 20%;
      margin: 0 20px;
    }
    .form{
      padding-left: 0;
    }
    .el-tag{
      margin-right: 16px;
      margin-bottom: 12px;
    }
    .el-dialog{
      .msg{
        display: block;   
        font-size: 18px;
        text-align: center;
        i{
          display: block;
          font-size: 50px;
          &.icon-yes,&.icon-warm{
            color: #3fe030;
            line-height: 100px;
          }
         
        }
      }
    }
    .names{
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      padding-bottom: 0;
      margin-right: 27px;
    }
    .clear{
      width: auto;
      height: auto;
      line-height: 16px;
      padding: 7px 15px;
    }
    
  }
</style>