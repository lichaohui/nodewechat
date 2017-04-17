/*--该文件是用来验证请求合法性的koa中间件--*/

//使用严格模式
'use strict'

//引入sha1加密模块和raw-body模块和自定义的用来解析xml数据的xml模块
const [sha1,rowBody,xml]=[require('sha1'),require('raw-body'),require('./libs/xml')];

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
        
        let content=yeild xml.parseXMLAsync(data);
        console.log(content);
      }else{
        //否则请求就不合法，返回无效请求
        this.body='非法请求!';
      }
    }
  }
}