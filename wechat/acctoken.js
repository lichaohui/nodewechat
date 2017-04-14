/*--该文件是用来验证access_token的类--*/

//使用严格模式
'use strict'

//引入promise的bluebird库
let promise=request('bluebird');
//将request模块promisify,然后request就拥有的then方法
let request=promise.promisify(require('request'));

//设置一些配置信息
let apiurl='https://api.weixin.qq.com/cgi-bin/';

/*--声明一个acctoken类--*/
class acctoken{
  //let this=this;
  //构造函数中初始化appId和appSecret属性
  constructor(option){
    this.appId=option.appId;
    this.appSecret=option.appSecret;
    this.getAccessToken=option.getAccessToken;
    this.setAccessToken=option.setAccessToken;
  };
  
  //验证accesstoken是否有效的方法
  isValidAccessToken(data){
    //先判断参数中的access_token和expires_in是否存在
    if(data.access_token && data.expires_in){
      //如果存在则分别获取到两个值
      let [access_token,expires_in]=[data.access_token,data.expires_in];
      if(new Date().getTime()<expires_in){
        /*
         * 如果当前时间小于过期时间则说明没有过期
         * 返回true
         */
        return true;
      }else{
        //否则说明已经过期了
        return false;
      }
    }else{
      //如果参数中的access_token和expires_in不存在则直接返回false
      return false;
    }
  }

  //更新accesstoken的方法
  updateAccessToken(){
    /*
     * 先声明几个变量
     * appid就是公众哈的appid,
     * appsecret就是公众号的secret
     * 这两个参数在获取accesstoken的时候需要用到
     * url则是微信提供给我们的获取accesstoken的请求地址
     */
    let [appId,appSecret]=[this.appId,this.appSecret];
    let url=`${url}?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
    
    /*
     * 因为我们希望updateAccessToken方法返回一个promise对象
     * 所以我们需要封装一下
     * 在这里返回一个promise对象
     */
    return new promise(function(resolve,reject){
      /*
       * 通过nodejs的request模块发送一个get请求到微信提供的url上
       * 可以获取到accesstoken
       * request请求参数是一个对象
       * url是请求地址，json:true是设置返回格式为json
       */
      request({url:url,json:true}).then(function(response){
        //响应的数据在response[1]中
        let data=response[1];
        /*
         * 重新设置accesstoken的过期时间
         * 将过期时间设置为当前时间加上服务器返回的expires_in（毫秒，然后*1000）
         */
        data.expires_in=new Date().getTime()+(data.expires_in-20)*1000;
        //然后将promise对象的状态设置为已完成
        resolve(data);
      })
    }) 
  }

  /*
   * getAccessToken()方法返回的是一个promise对象
   * 所以可以调用该对象的then方法进行下一步操作
   * promise对象是es6新标准中定义的用来改善异步回调写法的js对象
   * then方法中包含一个回调函数
   * 回调函数的data参数是上一步中的返回值
   */
  this.getAccessToken().then(function(data){
    try{
      //尝试将data进行JSON.parst
      data=JSON.parse(data);
    }catch(e){
      //如果有异常则使用updateAccessToken()方法更新accesstoken
      return this.updateAccessToken();
    }
    //如果拿到了token则验证是否是有效的
    if(this.isValidAccessToken(data)){
      /*
       * 如果token有效则通过promise对象的resolve方法将promise对象的状态设置为resolve
       * 就是已完成的状态
       */
      promise.resolve(data);
    }else{
      /*
       * 如果token已经过期则还是更新token
       */
      return this.updateAccessToken();
    }
  }).then(function(data){
    //最后调用then方法保存accesstoken到本地
    this.access_token=data.access_token;
    this.expires_in=data.expires_in;
    this.setAccessToken(data);
  })
}

module.exports=function(option){
  let acc=new acctoken(option);
}