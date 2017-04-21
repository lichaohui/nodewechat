/*=-智能接口模块--*/

'use strict'

/*
 * 引入fs模块
 * 引入promise库bluebird
 * 引入config
 */
const[fs,promise,config]=[require('fs'),require('bluebird'),require('../config')];

//将request模块promisify,然后request就拥有的then方法
const request=promise.promisify(require('request'));

class intel{
  //构造函数中初始化appId和appSecret属性
  constructor(option){
    this.getAccessToken=option.getAccessToken;
  };
  
  /*
   * 语意理解的方法
   * 参数args是发送的语义的数据
   */
  understand(args){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于该接口需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址
        let url=`https://api.weixin.qq.com/semantic/semproxy/search?access_token=${data.access_token}`;
        //封装发送数据
        let option={
          url:url,
          method:'post',
          body:args,
          json:true
        };
        //通过request模块发送请求
        request(option).then(function(response){
          //响应的数据在response.body中
          let resdata=response.body;
          if(resdata){
            //如果响应正常则将promise对象的状态设置为已完成
            resolve(resdata);
          }
        })
      })
    })
  }
}

let inteler=new intel(config.wechat);
module.exports=inteler;