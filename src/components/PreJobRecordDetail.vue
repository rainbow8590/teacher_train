<template>
  <div class="prejobrecorddetail">
    <p class="title">
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path:  $route.path == '/recorddetail/prejobrecorddetail'?'/record/prejobrecord':'/record/postjobrecord' }">
      <span v-if="($route.path == '/recorddetail/prejobrecorddetail')"><i class="icon-left-arrow"></i>岗前</span><span v-if="($route.path == '/recorddetail/postjobrecorddetail')"><i class="icon-left-arrow"></i>岗后</span>培训记录
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{trainInfo.TrainName}}</el-breadcrumb-item>
    </el-breadcrumb>
    </p>
    <p class="tip"><i class="icon-warm"></i>本次培训所有学员培训完成后，才能流转到下一环节。</p>
    <div class="search">
      <el-form ref="form" :model="form" >
        <el-form-item label="状态" label-width="40px">
          <el-select v-model="form.selectStatus" placeholder="请选择" class="select-width">
            <el-option
              v-for="item in JobStatus"
              :key="item.value"
              :label="item.value"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" label-width="40px">
          <el-input v-model="form.name" placeholder="姓名" class="select-width"></el-input>
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
        <el-form-item label="" label-width="20px">
          <el-button class="search-btn" @click="searchPreStudents">搜索</el-button>
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
            v-if="$route.path == '/recorddetail/prejobrecorddetail'"
            prop="TotalScore"
            label="总积分" >
          </el-table-column>
          <el-table-column
            v-if="$route.path == '/recorddetail/postjobrecorddetail'"
            prop="Level"
            label="综合评价">
          </el-table-column>
      </el-table>
    </div>
    <p class="page">共 {{dataTotalNum}} 条 <span @click="prevPage" class="pageone"> 上一页 </span>  {{pageNumSon}} / {{pageTotal}}  <span @click="nextPage" class="pageone"> 下一页 </span></p>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  // import Vue from 'vue';
  import Request from '../assets/request'
  import ExportData from '../assets/exportData'
  export default {
    name: 'PreJobRecordDetail',
    data() {
      return {
        form: {
          selectXueKe:null,
          selectXueBu:null,
          trainStatus:null,
          studentName:null
        },
        selectXueKe:-1,
        selectXueBu:-1,
        trainStatus:-1,
        studentName:null,

        XueKe: [],
        XueBu: [],
        JobStatus: this.StudentStatus,
        tableData: [],

        pageNumSon: 1,
        dataTotalNum: 0,
        pageTotal:0,
        ajaxOver:true
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

      if(to.fullPath == '/recorddetailperson/prejobrecorddetailperson' ||to.fullPath == '/recorddetailperson/postjobrecorddetailperson'){
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
      this.AjaxAsRouter();
    },
    methods:{
      init(){
        let routerFrom = window.VueObj.RouterFrom;
        this.XueBu = this.$storage.getStorage('XueBu');
        this.XueKe = this.$storage.getStorage('XueKe');

        // pageNumSon 要记录刷新时的pageNumSon 和初始化是的pageNumSon
        if( routerFrom == '/' || routerFrom == '/recorddetailperson/prejobrecorddetailperson' || routerFrom == '/recorddetailperson/postjobrecorddetailperson' ){
          console.log(this.$storage.getStorage('pageNumSon'))
          this.pageNumSon = this.$storage.getStorage('pageNumSon')?this.$storage.getStorage('pageNumSon'):1
        }else{
          this.pageNumSon = 1
        }
      },
      AjaxAsRouter(){
        console.log(this.pageNumSon)
        if(this.$route.path == '/recorddetail/prejobrecorddetail'){ // 岗前培训记录详情
          this.getPreStudents(this.pageNumSon,'api/PreWork/GetTrainStudent')
        }else if(this.$route.path == '/recorddetail/postjobrecorddetail'){ // 岗后培训记录详情
          this.getPreStudents(this.pageNumSon,'api/WorkAfter/GetWrokedListByCode')
        }
      },
      goDetail(index){
        this.$store.commit('$_setStorage',{key:'trainStudent',value:this.tableData[index]})
        if(this.$route.path == '/recorddetail/prejobrecorddetail'){ // 岗前培训记录详情
          this.$router.push({path:'/recorddetailperson/prejobrecorddetailperson'})
          console.log(this.pageNumSon)
        }else if(this.$route.path == '/recorddetail/postjobrecorddetail'){ // 岗后培训记录详情
          this.$router.push({path:'/recorddetailperson/postjobrecorddetailperson'})
        }
        
      },
   

      // 导出
      exportInfos(){
        let path = this.$route.path;
        if(path == '/recorddetail/postjobrecorddetail'){ // 导出岗后
          this.exportRecord('api/WorkAfter/ExportWorkedListByCode');
        }else if(path == '/recorddetail/prejobrecorddetail'){ // 导出岗前
          this.exportRecord('api/PreWork/ExportTrainStudent');
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
            const tHeader = ['姓名', '学部', '学科', '职位性质', '状态', '总积分']
            const filterVal = ['StudentName', 'XueBuName', 'XueKeName', 'JobsTypeName', 'TrainStatesName', 'TotalScore']
            ExportData(tHeader,filterVal,that.exportTableData,that.trainInfo.TrainName+'培训列表')
            
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
  
      //获取岗前培训学员
      getPreStudents(pageIndex,url){
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
          studentname: this.studentName,
          traincode: this.trainInfo.TrainCode,
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
                if(k == 'BeginDate' || k == 'EndDate'){
                  that.tableData[i][k] = that.tableData[i][k].substr(0,that.tableData[i][k].indexOf('T'))
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
      searchPreStudents(){
        this.pageNumSon = 1;
        if(!this.ajaxOver) return;
        this.ajaxOver = false;
        if(!this.form.selectXueKe && !this.form.selectXueBu && !this.form.trainStatus &&!this.form.studentName){
          this.$message({message:'请设置搜索条件', type:'warming'})
          setTimeout(()=>{
            this.ajaxOver = true;
          },3000)
          return;
        }
        this.ajaxOver = true;

        if(this.form.studentName){
          this.studentName = this.form.studentName;
        }else{
          this.studentName = null;
        }
        if(this.form.trainStatus){
          this.trainStatus = this.form.trainStatus;
        }else{
          this.trainStatus = -1;
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
        this.AjaxAsRouter();
      },
      // 上一页
      prevPage(){
        this.pageNumSon--;
        if(this.pageNumSon<1){
          this.pageNumSon = 1;
          return;
        }
        this.$storage.setStorage('pageNumSon',this.pageNumSon)
        this.AjaxAsRouter();
      },
      //下一页
      nextPage(){
        this.pageNumSon++;
        if(this.pageNumSon>this.pageTotal){
          this.pageNumSon = this.pageTotal
          return;
        }
        this.$storage.setStorage('pageNumSon',this.pageNumSon)
        this.AjaxAsRouter();
      },
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
      //this.$storage.setStorage('pageNumSon',1)
    },
  }
</script>

<style lang="scss" type="text/css">
  @import '../assets/public.css';
  .prejobrecorddetail{
    width: 100%;
  
    .el-form{
      
      .el-form-item {
        display: inline-block;
        padding-right: 20px;
      }
      .el-input{
       
      }
    }
    .table .el-table th.el-table_1_column_1 .cell{
      border-right: 1px solid #ddd;
    }
    
  }
</style>