/*--app.js为项目的入口文件--*/

//使用严格模式
'use strict'

//引入koa模块
const koa=require('koa');
//引入path模块
const path=require('path');
//引入util模块
const util=require('./libs/util');
//引入reqverify中间件
const reqverify=require('./wechat/reqverify');
//引入acctoken中间件
const acctoken=require('./wechat/acctoken');
//设置存储凭据的配置文件
const access_token_file=path.join(__dirname,'./config/access_token.json');

//设置一个对象用来存储一些配置信息
const config={
  wechat:{
    appId:'wxbf37d744e196cf9b',
    appSecret:'fcc5ec54936416d17fb06aba1e3d0d00',
    token:'lichaohui',
    getAccessToken:function(){
      return util.readFileAsync(access_token_file);
    },
    setAccessToken:function(data){
      data=JSON.stringify(data);
      return util.writeFileAsync(access_token_file,data);
    }
  }
}

//实例化一个koa对象
const app=new koa();
//使用acctoken中检验验证access_token
//app.use(acctoken(config.wechat));
//使用reqverify中间件验证请求
app.use(reqverify(config.wechat));

//监听80端口
app.listen(80);
console.log('server is running in port:80');