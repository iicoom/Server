const later = require('later');

initStatistics();

function initStatistics() {

  const basic = { h: [10], m: [17, 18, 19, 20] }; // 每天的10点17, 18, 19, 20执行statistics
  const composite = [
    basic,
  ];
  const sched = {
    schedules: composite,
  };
  later.date.localTime();
  later.setInterval(statistics, sched);
  console.log('创建每日定时统计任务完成');
}

function statistics() {
  console.log('每日统计开始:', new Date());
}
