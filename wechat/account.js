/*--微信公众账号管理模块--*/

'use strict'

/*
 * 引入fs模块
 * 引入promise库bluebird
 * 引入config
 */
const[fs,promise,config]=[require('fs'),require('bluebird'),require('../config')];

//将request模块promisify,然后request就拥有的then方法
const request=promise.promisify(require('request'));

class account{
  //构造函数中初始化appId和appSecret属性
  constructor(option){
    this.getAccessToken=option.getAccessToken;
  };
  
  /*
   * 生成带参数的二维码的方法
   * 为了满足用户渠道推广分析和用户帐号绑定等场景的需要，
   * 公众平台提供了生成带参数二维码的接口。
   * 使用该接口可以获得多个带不同场景值的二维码，
   * 用户扫描后，
   * 公众号可以接收到事件推送。
   *
   * 参数args就是生成ticket时候的一些选项
   */
  createticket(args){
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
        let url=`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${data.access_token}`;
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
  
  /*
   * 通过ticket换取二维码
   * 参数ticket就是要用来换取二维码的ticket
   */
  getqrcode(ticket){
    //先转码一下ticket
    let enticket=encodeURI(ticket);
    //直接返回一个二维码图片的下载链接
    return new promise(function(resolve,reject){
      resolve(`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${enticket}`);
    })
  }
  
  /*
   * 将长链接转成短链接的方法
   * 主要使用场景： 
   * 开发者用于生成二维码的原链接（商品、支付二维码等）太长导致扫码速度和成功率下降，
   * 将原长链接通过此接口转成短链接再生成二维码将大大提升扫码速度和成功率。
   * 参数long_url是要被转的长链接
   */
  shorturl(long_url){
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
        let url=`https://api.weixin.qq.com/cgi-bin/shorturl?access_token=${data.access_token}`;
        //封装发送数据
        let option={
          url:url,
          method:'post',
          body:{
            "action":'long2short',
            'long_url':long_url
          },
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

//实例化account对象并暴露给外界使用
let accounter=new account(config.wechat);
module.exports=accounter;