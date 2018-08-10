function Format(data,long){
  var year = data.getFullYear();
  var month = getTwo(data.getMonth()+1);
  var date = getTwo(data.getDate());
  var hour = getTwo(data.getHours());
  var min = getTwo(data.getMinutes());
  var sec = getTwo(data.getSeconds());

  
  function getTwo(num){
    return num < 10? '0'+num : num
  }


  if(long){
    return year+'-'+month+'-'+date+' '+hour+':'+min+':'+sec
  }else{
    return year+'-'+month+'-'+date
  }
  
}
 export default Format