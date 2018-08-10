//判断学期区间值
export default function flagSemester(){
  var nowYear = new Date().getFullYear();
  var nowTime = new Date().getTime();
  var time0 = new Date(nowYear - 1 + "/9/1 00:00:00");//上一年秋开始   1
  var time1 = new Date(nowYear + "/1/10 00:00:00"); // 寒开始  2
  var time2 = new Date(nowYear + "/3/1 00:00:00"); // 春开始  3
  var time3 = new Date(nowYear + "/7/10 00:00:00"); // 暑开始    4
  var time4 = new Date(nowYear + "/9/1 00:00:00"); // 秋开始   1

  if(nowTime >= time1 && nowTime < time2){
    return 2;
  }else if(nowTime >= time2 && nowTime < time3){
    return 3;
  }else if(nowTime >= time3 && nowTime < time4){
    return 4;
  }else if(nowTime >= time0 && nowTime < time1){
    return 1;
  }
}