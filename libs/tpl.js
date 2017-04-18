/*--该扩展用来处理模板文件并生成回复消息--*/

//严格模式
'use strict'

//引入template模块
const template=require('../wechat/template');

//暴露出一个create方法用来生成回复消息
exports.create=function(bodier,con){
  //声明一个空对象变量info用来承载回复的消息
  let info={};
  //封装回复内容
  info.bodier=bodier;
  info.createTime=new Date().getTime();
  info.msgType=bodier.type;
  info.toUserName=con.fromUserName;
  info.fromUserName=con.toUserName;
  //通过template模块进行编译后返回
  return template.compiled(info);
}