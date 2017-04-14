/*--该文件是用来验证请求合法性的koa中间件--*/

//使用严格模式
'use strict'

//引入sha1加密模块
var sha1=require('sha1');

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
    var token=option.token;
    /*
     * 获取请求参数中的signature参数（签名）用来进行
     * 该参数也是用来紧密的一个元件
     */
    var signature=this.query.signature;
    //拿到请求参数中的nonce参数
    var nonce=this.query.nonce;
    //获取请求参数中的timestamp参数
    var timestamp=this.query.timestamp;
    //获取请求参数中的ecostr参数
    var echostr=this.query.echostr;
    //对token,timestamp和nonce参数进行字典排序后再进行sha1加密
    var str=[token,timestamp,nonce].sort().join('');
    var sha=sha1(str);

    if(sha===signature){
      /*
       * 如果加密后获取的字符串等于signatrue签名
       * 则证明该请求是来自微信端的合法请求
       * 则返回ecostr
       */
      this.body=echostr+'';
    }else{
      //否则请求就不合法，返回无效请求
      this.body='非法请求,请确认';
    }
  }
}