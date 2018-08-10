import Vue from 'vue'
import Router from 'vue-router'
/*//登录
import Login from '@/components/Login'
import Main from '@/components/Main'
// 面试
import ImportStudents from '@/components/ImportStudents'
import InterviewRecord from '@/components/InterviewRecord'
// 岗前岗后
import NewPreJob from '@/components/NewPreJob'
import PreJobRecord from '@/components/PreJobRecord'
import PreJobRecordDetail from '@/components/PreJobRecordDetail'
import PreJobRecordDetailPerson from '@/components/PreJobRecordDetailPerson'
// 权限
import Role from '@/components/Role'
import RoleEdit from '@/components/RoleEdit'
import Account from '@/components/Account'
// 转正答辩
import AnswerGroup from '@/components/AnswerGroup' //新建分组
import AnswerGroupDetail from '@/components/AnswerGroupDetail' //查看分组
import AnswerRecord from '@/components/AnswerRecord' //答辩记录
import AnswerRecordDetail from '@/components/AnswerRecordDetail' //答辩记录详情
import AnswerRecordDetailPerson from '@/components/AnswerRecordDetailPerson' //答辩记录个人详情
//实习任务
import SetCurriculum from '@/components/SetCurriculum'  //配置约课课程
import SetCurriculumLessons from '@/components/SetCurriculumLessons'  //配置约课课程  --  选课
import TaskExamine from '@/components/TaskExamine'  //实习任务审核
import TaskExamineDetail from '@/components/TaskExamineDetail'  //实习任务审核详情
import TaskProgress from '@/components/TaskProgress'  //实习任务进度
import TaskProgressDetail from '@/components/TaskProgressDetail'  //实习任务进度详情*/

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      // component: Login
      component: (resolve)=>require(['@/components/Login'],resolve),
    },
    {
      path: '/main',
      name: 'Main',
      redirect: '/importstudents',
      // component: Main,
      component: (resolve)=>require(['@/components/Main'],resolve),
      meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          },
      children:[
        {
          path: '/importstudents', // 面试--导入学员
          name: 'ImportStudents',
          component:(resolve)=>require(['@/components/ImportStudents'],resolve),
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: '/interviewrecord', // 面试--面试记录
          name: 'InterviewRecord',
          component: (resolve)=>require(['@/components/InterviewRecord'],resolve),
          meta: {
            requireAuth: true, 
          },
        },
        {
          path: '/new/:newtarget',  //  新建岗前培训   新建岗后培训  新建答辩  新建复试
          name: 'NewPreJob',
          component: (resolve)=>require(['@/components/NewPreJob'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/record/:newtarget',  // 岗前培训记录 岗后培训记录
          name: 'PreJobRecord',
          component: (resolve)=>require(['@/components/PreJobRecord'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/recorddetail/:newtarget', //岗前每期学员培训详情 岗后每期学员培训详情
          name: 'PreJobRecordDetail',
          component: (resolve)=>require(['@/components/PreJobRecordDetail'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/recorddetailperson/:newtarget', //岗前学员培训详情 岗后学员培训详情
          name: 'PreJobRecordDetailPerson',
          component: (resolve)=>require(['@/components/PreJobRecordDetailPerson'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        /*{
          path: '/newpostjob',// 新建岗后培训
          name: 'NewPostJob',
          // component: NewPreJob,
          component: (resolve)=>require(['@/components/NewPreJob'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/postjobrecord',// 岗后培训记录
          name: 'PostJobRecord',
          // component: PreJobRecord,
          component: (resolve)=>require(['@/components/PreJobRecord'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/postjobrecorddetail', //岗后每期学员培训详情
          name: 'PostJobRecordDetail',
          // component: PreJobRecordDetail,
          component: (resolve)=>require(['@/components/PreJobRecordDetail'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/postjobrecorddetailperson',  //岗后学员培训详情
          name: 'PostJobRecordDetailPerson',
          // component: PreJobRecordDetailPerson,
          component: (resolve)=>require(['@/components/PreJobRecordDetailPerson'],resolve),
          meta: {
            requireAuth: true,  
          },
        },*/
        {
          path: '/account', // 账号管理
          name: 'Account',
          component: (resolve)=>require(['@/components/Account'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/role', // 角色管理
          name: 'Role',
          component: (resolve)=>require(['@/components/Role'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/roleedit/:target', //角色修改
          name: 'RoleEdit',
          component: (resolve)=>require(['@/components/RoleEdit'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        {
          path: '/group/:newtarget', //答辩分组 复试分组
          name: 'AnswerGroup',
          component: (resolve)=>require(['@/components/AnswerGroup'],resolve),
          meta: {
            requireAuth: true,  
          },
        },
        /*{
          path: '/newanswer', //新建答辩
          name: 'NewAnswer', 
          // component: NewPreJob,
          component: (resolve)=>require(['@/components/NewPreJob'],resolve),
          meta: {
            requireAuth: true,
          },
        },*/
        {
          path: '/groupdetail/:newtarget', //答辩分组详情 复试分组详情
          name: 'AnswerGroupDetail', 
          component: (resolve)=>require(['@/components/AnswerGroupDetail'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/arecord/:newtarget', //答辩记录 复试记录
          name: 'AnswerRecord', 
          component: (resolve)=>require(['@/components/AnswerRecord'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/arecorddetail/:newtarget', //答辩记录详情 复试记录详情
          name: 'AnswerRecordDetail', 
          component: (resolve)=>require(['@/components/AnswerRecordDetail'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/arecorddetailperson/:newtarget', //答辩记录个人详情 复试记录个人详情
          name: 'AnswerRecordDetailPerson', 
          component: (resolve)=>require(['@/components/AnswerRecordDetailPerson'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        /*{
          path: '/examgroup', //复试分组
          name: 'ExamGroup',
          // component: AnswerGroup,
          component: (resolve)=>require(['@/components/AnswerGroup'],resolve),
          meta: {
            requireAuth: true,  
          },
        },*/
        /*{
          path: '/newexam', //新建复试
          name: 'NewExam', 
          // component: NewPreJob,
          component: (resolve)=>require(['@/components/NewPreJob'],resolve),
          meta: {
            requireAuth: true,
          },
        },*/
        /*{
          path: '/examgroupdetail', //复试分组详情
          name: 'ExamGroupDetail', 
          // component: AnswerGroupDetail,
          component: (resolve)=>require(['@/components/AnswerGroupDetail'],resolve),
          meta: {
            requireAuth: true,
          },
        },*/
        /*{
          path: '/examrecord', //复试记录
          name: 'ExamRecord', 
          // component: AnswerRecord,
          component: (resolve)=>require(['@/components/AnswerRecord'],resolve),
          meta: {
            requireAuth: true,
          },
        },*/
        /*{
          path: '/examrecorddetail', //复试记录详情
          name: 'ExamRecordDetail', 
          // component: AnswerRecordDetail,
          component: (resolve)=>require(['@/components/AnswerRecordDetail'],resolve),
          meta: {
            requireAuth: true,
          },
        },*/
        /*{
          path: '/examrecorddetailperson', //复试记录个人详情
          name: 'ExamRecordDetailPerson', 
          // component: AnswerRecordDetailPerson,
          component: (resolve)=>require(['@/components/AnswerRecordDetailPerson'],resolve),
          meta: {
            requireAuth: true,
          },
        },*/
        {
          path: '/setcurriculum', //配置约课课程
          name: 'SetCurriculum', 
          component: (resolve)=>require(['@/components/SetCurriculum'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/setcurriculumlessons', //配置约课课程--选课
          name: 'SetCurriculumLessons', 
          component: (resolve)=>require(['@/components/SetCurriculumLessons'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/taskexamine', //实习任务审核
          name: 'TaskExamine', 
          component: (resolve)=>require(['@/components/TaskExamine'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/taskexaminedetail', //实习任务审核详情
          name: 'TaskExamineDetail', 
          component: (resolve)=>require(['@/components/TaskExamineDetail'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/taskprogress', //实习任务进度
          name: 'TaskProgress', 
          component: (resolve)=>require(['@/components/TaskProgress'],resolve),
          meta: {
            requireAuth: true,
          },
        },
        {
          path: '/taskprogressdetail', //实习任务进度详情
          name: 'TaskProgressDetail', 
          component: (resolve)=>require(['@/components/TaskProgressDetail'],resolve),
          meta: {
            requireAuth: true,
          },
        }
      ]
    }
  ]
})
