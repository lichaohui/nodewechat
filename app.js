/*--app.js为项目的入口文件--*/

//使用严格模式
'use strict'

/*
 * 引入koa模块
 * 引入koa路由模块
 * 引入ejs
 * 引入heredoc
 * 引入reqverify中间件
 * 引入acctoken中间件
 * 引入config项目配置文件
 * 引入replyhandler模块
 */
const[koa,route,ejs,heredoc,reqverify,acctoken,config,reply]=[require('koa'),require('koa-router'),require('ejs'),require('heredoc'),require('./wechat/reqverify'),require('./wechat/acctoken'),require('./config'),require('./wechat/replyhandler')];

/*
 * 实例化一个koa对象
 * 实例化route对象
 */
const[app,router]=[new koa(),new route()];

let movie=heredoc(function(){/*
  <!doctype html>
  <html>
    <head>
      <title>movie</title>
      <meta charset='utf-8'>
      <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimun-scale=1.0">
    </head>
    <body>
      <button>点击标题开始录音翻译</button>
      <h2 id='title'></h2>
      <div id='poster'></div>
      <script src='/bower_components/zepto/zepto.js'></script>
      <script src='http://res.wx.qq.com/open/js/jweixin-1.0.0.js'></script>
    </body>
  </html>
*/})
router.get('/movie',function(ctx){
  ctx.body=ejs.render(movie,{});
})

//在中间件里使用路由规则
app.use(router.routes());

//使用acctoken中检验验证access_token
app.use(acctoken(config.wechat));
//使用reqverify中间件验证请求
app.use(reqverify(config.wechat,reply.reply));

//监听80端口
app.listen(80);
console.log('server is running in port:80');