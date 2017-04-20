/*--用户管理的模块--*/

'use strict'

/*
 * 引入fs模块
 * 引入promise库bluebird
 * 引入config
 */
const[fs,promise,config]=[require('fs'),require('bluebird'),require('../config')];

//将request模块promisify,然后request就拥有的then方法
let request=promise.promisify(require('request'));

class user{
  
  //构造函数中初始化appId和appSecret属性
  constructor(option){
    this.getAccessToken=option.getAccessToken;
  };
  
  /*
   * 获取用户基本信息的方法
   * 参数openid是用户的openid
   */
  show(openid){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于设置备注名需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${data.access_token}&openid=${openid}&lang=zh_CN`;
        let option={url:url,method:'get',json:true};
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
   * 批量获取用户数据的接口
   * 参数openids是一个装载所有想要获取信息的用户openid的数组
   */
  batchshow(openids){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于设置备注名需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=${data.access_token}`;
        let option={url:url,method:'post',body:{"user_list": openids},json:true};
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
   * 设置用户备注名
   * 参数openid是用户的id
   * remart是给用户设置的备注名
   * 注意：该接口暂时开放给微信认证的服务号。
   */
  remark(openid,remark){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于设置备注名需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/user/info/updateremark?access_token=${data.access_token}`;
        let option={url:url,method:'post',body:{"openid":openid,"remark":remark},json:true};
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

//实例化一个user对象并暴露出去
let userobj=new user(config.wechat);
module.exports=userobj;