/*--app.js为项目的入口文件--*/

'use strict'

/*
 * 引入koa模块
 * 引入koa路由模块
 * 引入ejs
 * 引入heredoc
 * 引入crypto加密模块
 * 引入reqverify中间件
 * 引入acctoken中间件
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
      <meta content="width=device-width,initial-scale=1.0, maximum-scale=1.0,user-scalable=false" name="viewport">
    </head>
    <body>
      <button id='recording'>开始录音</button>
      <h2 id='title'></h2>
      <time class='time'></time>
      <div id='poster'></div>
      <script src='/bower_components/zepto/zepto.js'></script>
      <script src='http://res.wx.qq.com/open/js/jweixin-1.0.0.js'></script>
      <script>
      //微信接口的配置选项
      wx.config({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: true,
        // 必填，公众号的唯一标识
        appId: 'wx2c474296930e81b4', 
        // 必填，生成签名的时间戳
        timestamp: <%- timestamp %>, 
        // 必填，生成签名的随机串
        nonceStr: '<%- nonce %>',
        // 必填，签名，见附录1
        signature: '<%- signature %>',
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: [
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'translateVoice'
        ] 
      });
      
      wx.ready(function(){
        // --------
        // config信息验证后会执行ready方法，
        // 所有接口调用都必须在config接口获得结果之后，
        // config是一个客户端的异步操作，
        // 所以如果需要在页面加载时就调用相关接口，
        // 则须把相关接口放在ready函数中调用来确保正确执行。
        // 对于用户触发时才调用的接口，
        // 则可以直接调用，
        // 不需要放在ready函数中。
        // --------
        //基础接口检查是否支持指定JS接口
        wx.checkJsApi({
          // 需要检测的JS接口列表，所有JS接口列表见附录2,
          jsApiList: [
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'translateVoice'
          ], 
          success: function(res) {
            //---------- 
            // 以键值对的形式返回，
            // 可用的api值true，
            // 不可用为false
            // 如：
            // {
            // "checkResult":{"chooseImage":true},
            // "errMsg":"checkJsApi:ok"
            // }
            //----------  
            console.log(res);
          }
        });
        
        //敲击录音按钮开始或结束录音
        let isRecording=false;
        $('#recording').tap(function(){
          if(isRecording){
            //----
            //如果isRecording标识符为true
            //则说明正在录音
            //那么久停止录音
            //----
            wx.stopRecord({
              success: function (res) {
                //----
                //录音成功结束后悔返回一个localId
                //这是生成的本地音频的一个路径
                //----
                let localId = res.localId;
                //将按钮的文字设置为‘开始录音’
                $(this).text('开始录音');
                //将标识符设置为false
                isRecording=false;
                //使用translateVoice接口翻译音频
                wx.translateVoice({
                  //需要识别的音频的本地Id，由录音相关接口获得
                  localId: localId, 
                  //默认为1，显示进度提示
                  isShowProgressTips: 1, 
                  success: function (res) {
                    //语音识别的结果
                    alert(res.translateResult); 
                  }
                });
              }
            });
          }else{
            wx.startRecord({
              cancel:function(){
                alert('您点击了取消！');
              },
              success:function(){
                //将按钮的文字设置为‘开始录音’
                $(this).text('录音中...点击结束');
                //将标识符设置为true
                isRecording=true;
              }
            });
          }
        })
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
  let arr=[
    `noncestr=${nonce}`,
    `jsapi_ticket=${ticket}`,
    `timestamp=${timestamp}`,
    `url=${url}`
  ];
  //对arr数组进行排序然后拼接成字符串
  let str=arr.sort().join('&');
  //crypto模块创建sha1加密
  let shasum=crypto.createHash('sha1');
  shasum.update(str);
  let signature=shasum.digest('hex');
  //返回票据对象
  return {
    nonce:nonce,
    timestamp:timestamp,
    signature:signature
  }
}
router.get('/movie',function (ctx){
  let ticketer=require('./wechat/ticket');
  /*
   * 这里不要忘记return啊，
   * 否则模板渲染就不会成功
   */
  return ticketer.fetchTicket().then(function(data){
    let ticket=data.ticket;
    //通过sign方法传入ticket和ctx.request.url参数获取签名
    let signobj=sign(ticket,'http://180.76.148.172'+ctx.request.url);
    //渲染模板并传入signobj为模板变量
    ctx.body=ejs.render(movie,signobj);
  })
})

//使用acctoken中检验验证access_token
app.use(acctoken(config.wechat));

//在中间件里使用路由规则
app.use(router.routes()).use(router.allowedMethods());

//使用reqverify中间件验证请求
app.use(reqverify(config.wechat,reply.reply));

//监听80端口
app.listen(80);
console.log('server is running in port:80');