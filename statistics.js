import Utility from './app/util/utils';

const later = require('later');
const xlsx = require('node-xlsx');
const fs = require('fs');
const { sendEmail } = require('./app/util/email');
const userService = require('./app/services/UserService');


initStatistics();

function initStatistics() {

  // const basic = { h: [10], m: [17, 18, 19, 20] }; // 每天的10点17, 18, 19, 20执行statistics
  const basic = { h: [18], m: [19] };

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

  const nowTime = new Date().getTime();   // 获取当前时间
  const endTime = nowTime;   // 获取前一天24点
  const beginTime = nowTime - 1000 * 60 * 60 * 24; // 获取前一天0点
  // 定义下载的文件名（每天统计数据 年月日.xlsx）
  const fileName = `每天统计数据${Utility.formatDate(beginTime, 'YYYY-MM-DD')}.xlsx`;
  const result = {};

  const data = [
    ['日期',
      '当天新注册人数', '新注册并购买人数', '新注册购买金额',
      '累计注册人数'],
  ];
  const item = [Utility.formatDate(beginTime, 'YYYY-MM-DD'),
    result.new_user_count = 5, result.new_buy_user_count = 10, result.new_buy_amount = 10000,
    result.user_count = 200];
  data.push(item);
  const buffer = xlsx.build([
    { name: '每天统计数据', data },
  ]);
  console.log(fs.writeFileSync(`./statistics/${fileName}`, buffer, 'binary'))
  console.log('统计成功');
  const xlsxfile = fs.readFileSync(`./statistics/${fileName}`);
  const attachment = [
    {
      filename: fileName,   // 这里只是给附件取名称
      contents: xlsxfile, // 导入文件
    },
  ];
  // sendEmail(`${Utility.formatDate(beginTime, 'YYYY-MM-DD')}统计`, '', attachment);
}
