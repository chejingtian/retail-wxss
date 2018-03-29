function add0(m) { return m < 10 ? '0' + m : m };  

function formatTime(date) {
  var time = new Date(date);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s); 
}

function getTime(time) {
  var date = new Date();
  date.setTime(time);
  return ((date.getMonth() + 1) + "月" + date.getDate() + "日 " + add0(date.getHours()) + ":" + add0(date.getMinutes()));
} 

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function preProcess(res) {
  return res.data && res.data.dataMap;
}
module.exports = {
  formatTime: formatTime,
  preProcess: preProcess,
  getTime:getTime
}
