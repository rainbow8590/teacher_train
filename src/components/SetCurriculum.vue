<template>
  <div class="curriculum">
    <p class="title">
      <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item><i class="icon-left-arrow"></i>配置约课课程</el-breadcrumb-item>
      </el-breadcrumb>
    </p>
    <p class="title1">最近7天可约课程</p>
    <div class="tip"><i class="icon-warm"></i>请确保最近可约课节大于应约课节</div>
    <div class="search">
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
        <el-form-item label="" label-width="20px">
          <el-button  class="search-btn" @click="searchWeedDate">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData">
        <el-table-column
          prop="XueBuName"
          label="学部">
        </el-table-column>
        <el-table-column
          prop="XueKeName"
          label="学科">
        </el-table-column>
        <el-table-column
          prop="TeacherCount"
          label="需约课老师(人)">
        </el-table-column>
        <el-table-column
          prop="YingCount"
          label="应约课节">
        </el-table-column>
        <el-table-column
          prop="KeCount"
          label="可约课节">
          <template slot-scope="scope"><div style="color:red;text-decoration:underline;cursor:pointer" @click="goDetail(scope.$index, scope.row)">{{scope.row.KeCount}}</div></template>
        </el-table-column>
        <el-table-column
          prop="QueCount"
          label="缺口(节)" >
          <template slot-scope="scope"><span style="color:red">{{scope.row.QueCount}}</span></template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" class="search-btn" style="cursor:pointer;" @click="showLessonDialog(scope.$index, scope.row)">添加课程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
    <!-- <el-dialog></el-dialog> -->
     <el-dialog title="添加课程" :visible.sync="dialogVisible" :before-close="beforeCloseDialog">
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
         <!--  <el-table 
             ref="multipleTable"
             :data="LessonData"
             :row-key="getRowKeys"
             @select="selectionChange"
             @select-all="selectAll">
           <el-table-column type="selection" width="55" reserve-selection></el-table-column>
           <el-table-column property="ClassName" label="课程名称" width="200"></el-table-column>
           <el-table-column property="PrintTeachers" label="老师" width="100"></el-table-column>
           <el-table-column property="CurrentCount" label="报名人数" width="100"></el-table-column>
           <el-table-column property="sPrintAddress" label="校区" width="100"></el-table-column>
           <el-table-column property="PrintTime" label="上课时间"></el-table-column>
         </el-table> -->
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
        <el-button class="export" @click="dialogVisible = false;radioIndex=null">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import qs from 'qs';
  import Request from '../assets/request'
  import FlagSemester from '../assets/flagSemester'
  // import FormatTime from '../assets/FormatTime'
  // import ExportData from '../assets/exportData'
  export default {
    name: 'SetCurriculum',
    inject:['reload'],
    data() {
      return {
        dialogVisible:false,
        form:{
          selectXueBu: null,
          selectXueKe: null,
        },
        selectXueBu:-1,
        selectXueKe:-1,
        XueKe: this.$storage.getStorage('XueKe'),
        XueBu: this.$storage.getStorage('XueBu'),
        tableData:[],
        pageNum: 1,
        dataTotalNum: 0,
        pageTotal: 0,
        table_pageNum: 1,
        table_dataTotalNum: 0,
        table_pageTotal: 0,
        LessonData:[],
        selectData:[], // 选择的班级
        nowpageSelect:[],//当前页选择的班级
        disabledBtn: true,

        radioIndex: null,
        radioText: null,
        nowYear: new Date().getFullYear()+'',
        nextYear: new Date().getFullYear()+1+'',

        TeacherName:null,
        ClassYear: '2018',
        Semester: FlagSemester(),
        SemesterName:FlagSemester()==1?'秋季':(FlagSemester()==2?'寒假':(FlagSemester()==3?'春季':'暑假')),

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
   
      if(to.fullPath == '/setcurriculumlessons'){
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
      this.GetWeedDate(this.pageNum)
    },
    methods:{
      init(){
        let routerFrom = window.VueObj.RouterFrom
        // this.XueBu = this.$storage.getStorage('XueBu');
        // this.XueKe = this.$storage.getStorage('XueKe');
        // pageNum 要记录刷新时的pageNum 和初始化是的pageNum
        if( routerFrom == '/' || routerFrom == '/setcurriculumlessons'){
          this.pageNum = this.$storage.getStorage('pageNum')?this.$storage.getStorage('pageNum'):1
        } else{
          this.pageNum = 1
        }

      },
      goDetail(index,row){
        this.$store.commit('$_setStorage',{key:'YingInfo',value:this.tableData[index]})
        this.$router.push('/setcurriculumlessons');
      },
      // 添加课程 显示弹窗
      showLessonDialog(index){
        this.table_pageNum = 1;
        this.tipClassIndex = index;
        this.getClassInfo(this.table_pageNum)
      },
      // 获取最近7天可约班级
      GetWeedDate(pageNum){
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
          xuebu: this.selectXueBu,
          xueke: this.selectXueKe,
          pagesize:this.pageSize,
          pageindex:pageNum
        }
        let option = {
          type:'get',
          api: 'api/Task/GetWeedDate',
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
        this.GetWeedDate(this.pageNum)
      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.GetWeedDate(this.pageNum)
      },
      //搜索岗前培训记录
      searchWeedDate(){
        this.pageNum = 1;
   
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
        this.GetWeedDate(this.pageNum)
      },

      // 获取弹窗可约班级
      getClassInfo(pageIndex){
        if(this.ajaxOver == false) return;
        this.ajaxOver = false
        this.dialogVisible = true;
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
          pageindex: pageIndex,
          xuebu:this.tableData[this.tipClassIndex].XueBu,
          xueke:this.tableData[this.tipClassIndex].XueKe
        }
        let option = {
          type:'get',
          api: 'api/Task/GetClassInfo',
          query: query
        }
        Request(option, function(res){
          that.nowpageSelect = [];
          if(res.data.ResultType == 0){
            that.LessonData = res.data.AppendData.DataList;

            // 计算页码
            that.table_pageNum = that.LessonData.length==0? 0:res.data.AppendData.PageIndex;
            that.table_dataTotalNum = res.data.AppendData.TotalCount;
            that.table_pageTotal = Math.ceil(that.table_dataTotalNum / that.pageSize);

             // that.toggleSelection([that.LessonData[0],that.LessonData[1]])
            // console.log(that.LessonData)
            // console.log(that.selectData)
            //看看有没有选中的项 有的话就默认显示
            /*if(that.selectData.length){
              for(var j = 0; j < that.selectData.length; j++){
                for(var k = 0; k < that.LessonData.length; k++){
                  if( that.LessonData[k].ClassCode == that.selectData[j].ClassCode){
                    that.nowpageSelect.push(that.LessonData[k])
                  }
                }
              }*/
              // console.log(that.nowpageSelect.length)
              // 如果是全选 就将所有选中的都清除, 然后再勾选
             /* if(!(pageIndex == that.table_pageTotal && that.nowpageSelect.length == that.table_dataTotalNum % that.pageSize)){
                console.log()
                that.$refs.multipleTable.clearSelection();
              }
              console.log(that.nowpageSelect)
              that.toggleSelection(that.nowpageSelect)*/
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
         
        })
      },
       // 弹窗 上一页
      tablePrevPage(){
        //去重
        /*if(this.selectData.length){
          this.selectData = this.noRepeatArr(this.selectData,['ClassCode'])
        }
        this.nowSelect = 0; // 翻页将当前页面已经选的置为0*/
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
        /*//去重
        if(this.selectData.length){
          this.selectData = this.noRepeatArr(this.selectData,['ClassCode'])
        }
        this.nowSelect = 0; // 翻页将当前页面已经选的置为0*/
        this.radioIndex = null;
        this.table_pageNum++;
        this.disabledBtn = true;
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
          this.ClassYear = new Date().getFullYear()+''
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
      beforeCloseDialog(done){
        this.radioIndex = null;
        done();
      },
      // 添加班级
      addLesson(){
        this.dialogVisible = false;
        let that = this;
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        var select= this.LessonData[this.radioIndex];
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
            //that.dialogVisible = true;
            
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


      /*// 选择逻辑
      selectionChange(a,b){
        if(this.selectData.length){
          this.selectData = this.noRepeatArr(this.selectData,['ClassCode'])
        }
        var isIn = a.indexOf(b)
        if(isIn == -1){
          this.selectNum--;
          this.nowSelect--;
          // console.log(this.oldSelect)

          // if(this.oldSelect.indexOf(b) != -1){
            this.selectData.forEach((item,index)=>{
              if(b.ClassCode == item.ClassCode){
                this.selectData.splice(index, 1);
              }
            })
          
            this.selectData = this.noRepeatArr(this.selectData,['ClassCode'])

        }else{
          this.selectNum++;
          this.nowSelect++;
          // this.oldSelect = this.newSelect;
          this.selectData.push(b)
          this.selectData = this.noRepeatArr(this.selectData,['ClassCode'])

        }
        this.check();
      },
      // 全选
      selectAll(e){

        // 去重
        if(this.selectData.length){
          this.selectData = this.noRepeatArr(this.selectData,['ClassCode'])
        }
        if(e.length){ // 勾选状态
         

          //this.nowSelect = this.tableData.length; //将本页选中的数量置为当前页的学生数量
          this.selectData = this.selectData.concat(this.LessonData)
          // console.log(this.selectData)
          this.selectData = this.noRepeatArr(this.selectData,['ClassCode'])
          // console.log(this.selectData)

        }else{ // 取消勾选状态

          //this.selectNum -= this.tableData.length;
          //this.nowSelect = 0; //将本页选中的数量置为0
          //删除selectData中的tableData
          for(let i = 0; i < this.selectData.length; i++){
            for(let k = 0; k < this.LessonData.length; k++){
              if(this.LessonData[k].ClassCode == this.selectData[i].ClassCode){
                 this.selectData.splice(i,1);
              }
            }
          }
        }
        this.check();

      },
      check(){
        if(this.selectData.length){
            this.disabledBtn = false;
          }else{
            this.disabledBtn = true;
          }
      },
      // 设置row-key
      getRowKeys(row) {
        return row.ClassCode;
      },
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
        console.log(rows.length)
            console.log(this.$refs.multipleTable)
        if (rows) {
          rows.forEach(row => {
            console.log(row)
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        }
      },*/
    },
    computed:{
       ...mapState(['token'])
    },
    beforeDestroy(){
      // 离开这个组件的时候 将pageNum 改为1
      // this.$storage.setStorage('pageNum',1)
    },
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .curriculum{
    width: 100%;
    .search{
      padding-left: 27px;

    }
    .el-form-item{
      display: inline-block;
      margin-right: 10px;
      width: 140px;
    }
    .table-first{
      text-align:left;
      display:flex;
      align-items:center;
    }
  }
</style>