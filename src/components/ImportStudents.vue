<template>
  <div class="import">
    <p class="title">
      <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item><i class="icon-left-arrow"></i>导入学员</el-breadcrumb-item>
        
      </el-breadcrumb>
    </p>
    <div class="search">
      <el-form ref="form" :model="form" label-width="70px" >
        <el-form-item label="导入时间">
          <div class="time-input">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.beginDate" :picker-options="pickerOptions0" class="date-width" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
          <div class="line" >--</div>
          <div class="time-input">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.endDate" :picker-options="pickerOptions1" class="date-width" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="" label-width="20px">
          <el-button class="search-btn" @click="searchImportData">搜索</el-button>
          <el-button class="export" @click="exportInfos">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <p class="import-excel"><el-button type="primary" @click="importExcel" class="search-btn">导入学员</el-button></p>
    <div class="table">
      <el-table
          :data="tableData">
          <el-table-column
            prop="ImportDate"
            label="导入时间">
          </el-table-column>
          <el-table-column
            prop="ImportCount"
            label="导入人数">
          </el-table-column>
          <el-table-column
            prop="SignedCount"
            label="直接签约(人)">
          </el-table-column>
          <el-table-column
            prop="JoinTrainCount"
            label="参加培训(人)">
          </el-table-column>
          <el-table-column
            prop="VIPCount"
            label="VIP1对1(人)">
          </el-table-column>
          <el-table-column
            prop="TowInterViewCount"
            label="参加二面(人)">
          </el-table-column>
          <el-table-column
            prop="RefusedCount"
            label="婉拒(人)">
          </el-table-column>
        </el-table>
    </div>

    <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNum}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>

  <!-- 上传文件 -->
  <el-dialog
    title="导入学员"
    :visible.sync="showDialog"
    width="30%">
    <!-- <el-upload
      class="upload-demo"
      ref="upload"
      :show-file-list="showFileList"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-change="uploadFile"
      :on-remove="handleRemove"
      :auto-upload="false"
      :limit="limit"
      :on-exceed="handExceed"
      :file-list="fileList"
      >
      <span>导入学员:</span>
      <el-button  size="small" class="search-btn">选取文件</el-button>
      <span style="margin-left:30px;color:red; text-decoration: underline" @click="download">下载导入学员模板</span>
      <div slot="tip" class="el-upload__tip">支持导入10 M 以内的 Excel 文件</div>
    </el-upload> -->
    <div>
      <el-upload
      class="upload-demo"
      ref="upload"
      :show-file-list="showFileList"
      action=""
      :on-preview="handlePreview"
      :on-change="uploadFile"
      :on-remove="handleRemove"
      :auto-upload="false"
      :limit="limit"
      :on-exceed="handExceed"
      :file-list="fileList"
      >
      <span>导入学员:</span>
      <el-button  size="small" class="search-btn">选取文件</el-button>
    </el-upload> 
      <span style="margin-left:30px;color:red; cursor:pointer;text-decoration: underline" @click="download">下载导入学员模板</span>
      <div slot="tip" class="el-upload__tip">支持导入10 M 以内的 Excel 文件</div>
    </div>
      <ul class="list">
        <li v-for="(list,index) in fileList">
          <i class="el-icon-document"></i>
          <span style="padding-left: 10px;">{{list.name}}</span>
          <span style="padding-left: 50px;color:blue;cursor:pointer;" @click="fileListDelete" :data-index="index">删除</span>
        </li>
      </ul>
      <p class="upload-tip" v-if="isFull&&isShowTip">表格中存在空白项, 请填写完整！</p>
      <!-- <p class="upload-tip" v-if="isRepeat&&isShowTip">表格中存在重复学员，请检查！</p> -->
      <p class="upload-tip" v-if="(!isFull&&isShowTip)">可导入{{result.length}}名学员</p>
    <span slot="footer" class="dialog-footer">
      <el-button class="search-btn" @click="submit" :disabled="isDisabled">确 定</el-button>
      <el-button class="export" @click="giveup">取 消</el-button>
    </span>
  </el-dialog>

  <!-- 系统重复学员 -->
  <el-dialog
    title="系统中存在重复学员"
    :visible.sync="showRepeatDialog"
    width="30%">
      <ul class="repeat">
        <li v-for="repeat in repeatData"> 姓名: {{repeat.Name}}, 电话: {{repeat.Phone}}</li>
      </ul>
    <span slot="footer" class="dialog-footer">
      <el-button class="export" @click="close">关闭</el-button>
    </span>
  </el-dialog>
  <!-- {{username}}{{token}} -->
  </div>
</template>

<script>
  // import XLSX from 'xlsx'
  // import $ from "jquery"
  import qs from 'qs'
  import { mapState } from 'vuex';
  // import md51 from '../assets/md51'
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  // import FormatTime from '../assets/FormatTime'
  export default {
    name: 'ImportStudents',
    inject:  ['reload'],
    data() {
      return {
        limit:1, //一次只能上传一个文件
        showDialog: false,// 是否显示上传文件的弹窗
        showRepeatDialog: false, // 是否显示重复学员的弹窗
        showFileList: false,
        isShowTip: false, //是否显示表格错误提示
        isRepeat: false, //表格项是否重复
        isFull:false, //表格项是否完整
        isDisabled: true, //按钮是否可用
        pageNum:1,  // 当前页码
        form:{
          beginDate:'',
          endDate:''
        },
        beginDate:'',
        endDate:'',

        beginTime:  new Date().getFullYear()+'-'+new Date().getMonth()+'-'+new Date().getDate()+' 00:00:00',
        endTime:  new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+' 23:59:59',

        fileList:[],
        tableData: [],
        result:[], // 上传文件列表
        repeatData: [], //重复学员列表
        dataTotalNum: 0,
        pageTotal:0,
        ajaxOver: true,
        pickerOptions0: {
          disabledDate: (time) => {
            if(this.form.endDate){
              return time.getTime() > Date.now() || time.getTime() > new Date(this.form.endDate).getTime();
            }else{
              return time.getTime() > Date.now();
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
             if(this.form.beginDate){
              return  time.getTime() > Date.now() || time.getTime() < new Date(this.form.beginDate).getTime()-8.64e7;
            }else{
              return time.getTime() > Date.now();
            }
             
          }
        },
      }
    },
    created(){

      this.beginDate = this.beginTime
      this.endDate = this.endTime
      this.getImportData(this.pageNum);
    },
    methods:{
      importExcel(){
        this.showDialog = true
      },
      handlePreview(file, fileList) {
        console.log(file);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      fileListDelete(e){
        // this.fileList.splice(e.target.dataset.index,1)
        this.fileList = [];
        this.isShowTip = false;
        // this.isRepeat = false;
        this.isFull = false;
        this.isDisabled = true;
      },
      // 取消, 不导入
      giveup(){
        this.showDialog = false; 
        this.fileList = [];
        this.isShowTip = false;
        this.isDisabled = true;
      },
      close(){
        this.showRepeatDialog = false;
        this.isShowTip = false;
        this.repeatData = [];
        this.isDisabled = true;
      },
      uploadFile(file, fileList){

          if(!file) {
            alert('未选择文件')
            return;
          }
          const IMPORTFILE_MAXSIZE = 10*1024;//这里可以自定义控制导入文件大小
          var suffix = file.name.split(".")[1]
          if(suffix != 'xls' && suffix !='xlsx'){
              this.$message('导入的文件格式不正确!请上传xls或xlsx格式的文件');
              return false;
          }
          if(file.size/1024 > IMPORTFILE_MAXSIZE){
              alert('导入的表格文件不能大于10M')
              return false;
          }
          this.fileList.push({name:file.name})
          
          var reader = new FileReader();
          // reader.readAsBinaryString(file.raw)
          reader.readAsArrayBuffer(file.raw)
         
          let that = this;
          reader.onload = function(e){
            console.log(e)
            var data = e.target.result;
            var wb = XLSX.read(data, {
                type: 'buffer'
            });
            console.log(wb)
            var result =  XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            // console.log(result)
            // 删除第一项
            result.shift();
            

            // 判断表头是否和模板一致
            var first= result[0];
            var arr = ['Name','Sex', 'Phone', 'Email','IDCard', 'GraduatedSchool', 'SchoolMajor', 'Education', 'GraduatedYear', 'JobsType','JobSubject','InterviewDate', 'InterviewTime']
            for(var k in first){
              if(isInArray(k,arr) == -1){
                that.$message('无法识别学员名单')
                return;
              }
            }

            // console.log(result)
            // 判断是否有空白/重复的
            // arrRepeat(result)
            arrFull(result)
            
            console.log(result)

            // console.log(result)
            that.result = result;
            // that.isDisabled = false;
            //表格学员是否有重复项  用电话判断
          /*  function arrRepeat(arr){
              var arrStr = JSON.stringify(arr),str;
              for (var i = 0; i < arr.length; i++) {
                if ((arrStr.match(new RegExp(arr[i].name,"g")).length)>1){
                  that.isShowTip = true;
                  that.isDisabled = true;
                  that.isRepeat = true;
                  return;
                }
              }
              that.isDisabled = false;
              that.isShowTip = true;
              that.isRepeat = false;
            }*/
            //表格是否有空白项
            function arrFull(arr){
              var len = 13;
              that.isShowTip = true;
              for (var i = 0; i < arr.length; i++) {
                  if(Object.keys(arr[i]).length < len){
                    that.isFull = true;
                    that.isDisabled = true;
                    return;
                  }
              }
              that.isFull = false;
              that.isDisabled = false;
            }
            
            function isInArray(key, arr){
              return arr.indexOf(key)
            }
          }
      },
      submit(){
        this.showDialog = false;
        if(!this.result.length){
          this.$message({message:'导入的学员人数为0,请检查'})
        }else{
          this.import(this.result)
        }
        
      },
    
      //导入
      import(data){
        let that = this;
        const loading = this.$loading({
          lock: true,
          text: '数据导入中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let query = {
          timestamp:new Date().getTime(),
          appid:this.appid,
          token: this.token
        }
        let option = {
          type:'post',
          api: '/api/Interview/ImportInterview',
          query: query,
          data: qs.stringify({Result:data})
        }
        
        Request(option, function(res){
          that.fileList = [];
          if(res.data.ResultType == 0){
            that.$message({
              message: res.data.Message,
              type: 'success'
            })
            //刷新页面
             that.reload();
            // that.getImportData(1);
            // that.tableData.unshift({
            //   ImportDate:FormatTime(new Date(), false),
            //   ImportCount: data.length,
            //   SignedCount: '--',
            //   JoinTrainCount: '--',
            //   VIPCount: '--',
            //   TowInterViewCount: '--',
            //   RefusedCount:'--'
            // })
          }else{
            if(res.data.Message == '身份验证失败'){
              that.$storage.clearStorage();
              setTimeout(()=>{that.$router.replace('/')},that.backTime)
            }else{
              that.showRepeatDialog = true;
              that.repeatData = res.data.AppendData;
            }
          }
          loading.close();
          
        })
      },
      handExceed(files, fileList){
        this.$message({
          message: '一次只能上传一个文件',
          duration: 2000
        })
      },
      //下载模板
      download(){
        var data= [
        {'Name':'姓名','Sex':'性别', 'Phone':'电话', 'Email':'邮箱','IDCard':'身份证号', 'GraduatedSchool':'毕业学校', 'SchoolMajor':'所学专业', 'Education':'学历', 'GraduatedYear':'毕业年份', 'JobsType':'岗位性质','JobSubject':'应聘科目','InterviewDate':'面试日期', 'InterviewTime':'面试时间'},
        ]
        // const tHeader =['姓名','性别','电话','邮箱','身份证号','毕业学校','所学专业','学历','毕业年份','岗位性质','应聘科目','面试日期','面试时间']
        const tHeader =['Name','Sex', 'Phone', 'Email','IDCard', 'GraduatedSchool', 'SchoolMajor', 'Education', 'GraduatedYear', 'JobsType','JobSubject','InterviewDate', 'InterviewTime']
        const filterVal =['Name','Sex', 'Phone', 'Email','IDCard', 'GraduatedSchool', 'SchoolMajor', 'Education', 'GraduatedYear', 'JobsType','JobSubject','InterviewDate', 'InterviewTime']
        ExportData(tHeader,filterVal,data,'导入模板')
      },
      // 导出
      exportInfos(){
        this.exportRecord('api/Interview/ExportImportDateAnalyze');
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
          begindate:this.beginDate,
          enddate:this.endDate
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
            console.log(that.exportTableData)
            for(var i = 0 ; i < that.exportTableData.length; i++){
              that.exportTableData[i].ImportDate = that.exportTableData[i].ImportDate.substr(0,that.exportTableData[i].ImportDate.indexOf('T'))
            }
            const tHeader = ['导入时间', '导入人数', '直接签约(人)', '参加培训(人)', 'VIP1对1(人)', '参加二面(人)','婉拒(人)']
            const filterVal = ['ImportDate', 'ImportCount', 'SignedCount', 'JoinTrainCount', 'VIPCount', 'TowInterViewCount','RefusedCount']
            ExportData(tHeader,filterVal,that.exportTableData,'导入面试数据')
            
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
      //按时间获取导入的数据
      getImportData(pageIndex){
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
          begindate:this.beginDate,
          enddate:this.endDate
        }
        let option = {
          type:'get',
          api: 'api/Interview/GetImportDateAnalyze',
          query: query,
        }
        Request(option, function(res){
          if(res.data.ResultType == 0){
            that.tableData = res.data.AppendData.DataList;
            for(var i = 0 ; i < that.tableData.length; i++){
              var tab = that.tableData[i];
              for(var k in tab){
                if( k == 'ImportDate'){
                  tab['times'] = new Date(tab[k].replace('T', ' ')).getTime();
                  tab[k] = tab[k].substr(0,tab[k].indexOf('T'))
                }
                tab[k] = tab[k] == 0? ' --': tab[k]
              }
            }
            //计算页码
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
      searchImportData(){
        let that = this;
        // if(!this.ajaxOver) return;

        this.pageNum = 1;
        if(!this.form.beginDate && !this.form.endDate ){
          //不重复请求
          this.$message({
            duration: 2000,
            message: '请选择导入日期',
            onClose: function(){
            }
          });
          return;

          this.beginDate = this.beginTime;
          this.endDate = this.endTime;
        }else if(this.form.beginDate && !this.form.endDate){
          this.beginDate = this.form.beginDate+ ' 00:00:00'
          this.endDate = this.endTime
        }else if(!this.form.beginDate && this.form.endDate){
          this.beginDate = this.beginTime
          this.endDate = this.form.endDate+ ' 23:59:59'
        }else{
          this.beginDate = this.form.beginDate +' 00:00:00'
          this.endDate = this.form.endDate + ' 23:59:59'
        }
        this.getImportData(this.pageNum)
      },
      // 上一页
      prevPage(){
        this.pageNum--;
        if(this.pageNum<1){
          this.pageNum = 1;
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getImportData(this.pageNum)

      },
      //下一页
      nextPage(){
        this.pageNum++;
        if(this.pageNum>this.pageTotal){
          this.pageNum = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNum',this.pageNum)
        this.getImportData(this.pageNum)
      },
    },
    computed:{
      ...mapState(['token'])
      // ...mapState({
      //     username:function(state){
      //       if(!state.username){
      //         let user= JSON.parse(this.$storage.getStorage('username'));
      //         this.$store.state.username = user;
      //       }
      //       return state.username;
      //     },
      //     token: function(state){
      //       let token = JSON.parse(this.$storage.getStorage('token'));
      //       this.$store.state.token = token;
      //       return state.token;
      //     }
      //   })
    },
    beforeDestroy(){
      // 离开这个组件的时候 将pageNum 改为1
      this.$storage.setStorage('pageNum',1)
    },
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .import{
    .upload-demo{
      display: inline-block;
    }
    .el-form{
      overflow: hidden;
      .el-form-item{
        float: left;
        padding-right: 16px;
       
      }
      // .line{
      //   display: inline-block;
      //   padding: 0 10px;
      // }
      // .date-width{
      //   width: 120px;
      // }
    }
    .import-excel{
      padding-left: 46px;
      padding-bottom: 30px;
    }

    .list{
      line-height: 40px;
    }

    .search-btn{
      background: #30c27c;
      border-color: #30c27c;
      width: 104px;
      height: 36px;
      line-height: 36px;
      padding: 0;
      font-weight: bold;
      font-size: 12px;
    }

    .repeat li{
      line-height: 30px;
      border-bottom: 1px solid #dbdbdb;
    }

    .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
 }
</style>