/*--该文件是用来验证请求合法性的koa中间件--*/

//使用严格模式
'use strict'

//引入sha1加密模块和raw-body模块和自定义的用来解析xml数据的xml模块
const [sha1,rawBody,xml]=[require('sha1'),require('raw-body'),require('../libs/xml')];

/*
 * 通过module.exports向外界暴露一个方法
 * 由于koa框架要求中间件必须返回一个generator函数
 * 所以要在exports暴露的方法中return 一个generator函数
 */
module.exports=function(option){
  return function *(next){
    /*
     * 先拿到配置中的token，
     * 该token是用来进行加密的一个元件
     */
    let token=option.token;
    /*
     * 获取请求参数中的signature参数（签名）用来进行
     * 该参数也是用来紧密的一个元件
     * 
     * 拿到请求参数中的nonce参数
     * 获取请求参数中的timestamp参数
     * 获取请求参数中的ecostr参数
     */
    let [signature,nonce,timestamp,echostr]=[this.query.signature,this.query.nonce,this.query.timestamp,this.query.echostr];
    //对token,timestamp和nonce参数进行字典排序后再进行sha1加密
    let str=[token,timestamp,nonce].sort().join('');
    let sha=sha1(str);
    /*
     * 如果请求方式是GET则说明是验证签名
     */
    if(this.method==='GET'){
      if(sha===signature){
        /*
         * 如果加密后获取的字符串等于signatrue签名
         * 则证明该请求是来自微信端的合法请求
         * 则返回ecostr
         */
        this.body=echostr+'';
      }else{
        //否则请求就不合法，返回无效请求
        this.body='非法请求!';
      }
    }else if(this.method==='POST'){
      /*
       * 如果请求方式是post则证明是微信服务器在向我们推送消息
       * 我们这边就需要处理这些消息
       */
      if(sha===signature){
        /*
         * 如果加密后获取的字符串等于signatrue签名
         * 则证明该请求是来自微信端的合法请求
         * 那么我们就通过raw-body模块来获取微信提交给我们的数据
         * rawbody模块需要两个参数，
         * 第一个参数是要获取的数据，
         * 第二个参数是一个配置项的对象字面量
         * yield是es6中生成器函数里面的用法
         * 该用法会中断一下生成器函数
         */
        let data=yield rawBody(this.req,{
          length:this.length,
          limit:'1mb',
          encoding:this.charset
        })
        /*
         * 通过xml模块的parseXMLAsync方法(该模块和方法都是自己定义的)
         * 将接收到的xml格式的消息解析为js对象
         */
        let content=yield xml.parseXMLAsync(data);
        /*
         * 将解析完后获取到的js对象通过xml模块的format方法格式化一下
         * 将其格式化为可用的js对象
         * 这个地方可能解释不清楚
         * 比如：parseXMLAsync()方法解析完成后的数据为：
         * { 
             xml: 
              { 
                ToUserName: [ 'gh_3ce3a0e92da9' ],
                FromUserName: [ 'orNfTwvWWqwM04jnZRfgbURBdGxY' ],
                CreateTime: [ '1492407655' ],
                MsgType: [ 'event' ],
                Event: [ 'subscribe' ],
                EventKey: [ '' ] 
              } 
            }
         * 那么格式化(format)完之后就会是这个样子：
         * { 
             ToUserName: 'gh_3ce3a0e92da9',
             FromUserName: 'orNfTwvWWqwM04jnZRfgbURBdGxY',
             CreateTime: '1492407655',
             MsgType: 'event',
             Event: 'subscribe',
             EventKey: '' 
         * }
         */
        content=xml.format(content);
        if(content.MsgType=='event'){
          /*
           * 如果消息类型是一个事件
           * 则通过event字段获取事件类型
           * 根据不同的事件类型做出不同的响应
           */
          let now=new Date().getTime();
          switch(content.Event){
            case 'subscribe':
              this.status=200;
              this.type='application/xml';
              this.body=`<xml><ToUserName><![CDATA[${content.FromUserName}]]></ToUserName><FromUserName><![CDATA[${content.ToUserName}]]></FromUserName><CreateTime>${now}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好，欢迎关注李朝辉！]]></Content></xml>`;
              break;
          }
        }
      }else{
        //否则请求就不合法，返回无效请求
        this.body='非法请求!';
      }
    }
  }
}