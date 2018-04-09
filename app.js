const fs = require('fs');
// const request = require('superagent');
const request = require('request');
const cheerio = require('cheerio');
const asyncQuene = require("async").queue;
require('superagent-charset')(request);

//获取数据源
const getFundCodeUrlArr = () => {
  let fundCodeUrlArr = [];

  const fundBuffer = fs.readFileSync('./src/datasource/fundcode.html', 'utf-8');
  fundCodeUrlArr = fundBuffer.match(/\d{6}/g);

  fundCodeUrlArr = fundCodeUrlArr.map((item) => {
    return 'http://fundgz.1234567.com.cn/js/{1}.js'.replace(/\{1\}/, item);
  });

  return fundCodeUrlArr;
}

//请求方法
const httpGet = async (options) => {
  return new Promise((resolve, reject) => {
    request.get(options, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.body);
      }
    })
  })
}

const getFundJsonpList = async (fundCodeUrlArr) => {
  return new Promise((resolve, reject) => {
    console.log('Start get fundData .....');
    let fundData = [];
    let q = asyncQuene(async (url, taskDone) => {
      try {
        let data = await httpGet(url);
        console.log(`spide ${url} success`);
        fundData.push(data);
      } catch (err) {
        console.log(`Error : download ${url} err : ${err}`);
      } finally {
        taskDone(); // 一次任务结束
      }
    }, 10); //html下载并发数设为10

    /**
     * 监听：当所有任务都执行完以后，将调用该函数
     */
    q.drain = function () {
      console.log('Get fundData list complete');
      resolve(fundData); //返回所有基金
    }

    q.push(fundCodeUrlArr);
  });
}

const spiderRun =  async () => {
  let fundCodeUrlArr = await getFundCodeUrlArr(); //获取基金代码
  let fundJsonpList = await getFundJsonList(fundCodeUrlArr);//根据基金代码获取jsonp数据
  console.log(fundJsonpList);
}

spiderRun();