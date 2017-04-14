/*--app.js为项目的入口文件--*/

//使用严格模式
'use strict'

//引入koa模块
const koa=require('koa');
//引入signature中间件
const reqverify=require('./wechat/reqverify');

//设置一个对象用来存储一些配置信息
const config={
  wechat:{
    appId:'wxbf37d744e196cf9b',
    appSecret:'fcc5ec54936416d17fb06aba1e3d0d00',
    token:'lichaohui'
  }
}

//实例化一个koa对象
const app=new koa();
//使用generator中间件
app.use(reqverify(config.wechat));

//监听80端口
app.listen(80);
console.log('server is running in port:80');