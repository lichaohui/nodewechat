/*--app.js为项目的入口文件--*/

//使用严格模式
'use strict'

/*
 * 引入koa模块
 * 引入koa路由模块
 * 引入ejs
 * 引入heredoc
 * 引入crypto加密模块
 * 引入reqverify中间件
 * 引入acctoken中间件
 * 引入ticket模块
 * 引入config项目配置文件
 * 引入replyhandler模块
 */
const[
  koa,
  route,
  ejs,
  heredoc,
  crypto,
  reqverify,
  acctoken,
  ticket,
  config,
  reply
]=[
  require('koa'),
  require('koa-router'),
  require('ejs'),
  require('heredoc'),
  require('crypto'),
  require('./wechat/reqverify'),
  require('./wechat/acctoken'),
  require('./wechat/ticket'),
  require('./config'),
  require('./wechat/replyhandler')
];

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
      <script>
      wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: true,
        // 必填，公众号的唯一标识
        appId: '<%- config.wechat.appId %>', 
        // 必填，生成签名的时间戳
        timestamp: <%- signobj.timestamp %>, 
        // 必填，生成签名的随机串
        nonceStr: '<%- signobj.nonce %>',
        // 必填，签名，见附录1
        signature: '<%- signobj.signature %>',
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: [
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'translateVoice'
        ] 
      });
      </script>
    </body>
  </html>
*/})

/*
 * 调用js sdk接口的签名验证
 * 参数ticket是公众号用于调用微信JS接口的临时票据
 * 参数url是请求地址
 */
function sign(ticket,url){
  /*
   * 声明一个随机数
   * 声明一个时间戳
   */
  let [nonce,timestamp]=[Math.random().toString(36).substr(2,15),parseInt(new Date().getTime()/1000,10)+''];
  
  //将ticket,url,nonce和timestamp四个参数放入到一个数组中
  let arr=[ticket,url,nonce,timestamp];
  //对arr数组进行排序然后拼接成字符串
  let str=arr.sort().join('&');
  //crypto模块创建sha1加密
  let shasum=crypto.createHash('sha1');
  shasum.update();
  let signture=shasum.digest('hex');
  //返回票据对象
  return {
    nonce:nonce,
    timestamp:timestamp,
    signature:signature
  }
}

router.get('/movie',function(ctx){
  //先获取access_token(读取access_token.json文件)
  let access_token=files.readFileAsync('/data/access_token.json');
  console.log(access_token);
  //实例化ticket对象
  let ticketer=new ticket(config.wechat);
  //通过ticket对象的getTicket方法传入access_token参数获取ticket
  let ticket=ticketer.getTicket(access_token);
  //通过sign方法传入ticket和this.href参数获取签名
  let signobj=sign(ticket,this.href);
  //渲染模板并传入signobj为模板变量
  ctx.body=ejs.render(movie,signobj);
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