/*--消息管理模块--*/

'use strict'

/*
 * 引入fs模块
 * 引入promise库bluebird
 * 引入config
 */
const[fs,promise,config]=[require('fs'),require('bluebird'),require('../config')];

//将request模块promisify,然后request就拥有的then方法
let request=promise.promisify(require('request'));

class news{
  //构造函数中初始化appId和appSecret属性
  constructor(option){
    this.getAccessToken=option.getAccessToken;
  };
  
  /*
   * 根据用户分组进行消息群发的方法
   * 参数type为发送的消息的类型
   * 参数message为发送的消息内容
   * 参数groupid不说也知道啦
   */
  grouping(type,message,group_id){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于根据分组进行消息群发需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=${data.access_token}`;
        //根据switch不同的type类设置发送数据中不同的属性名
        let typepro;
        switch(type){
          case 'mpnews':
          case 'voice':
          case 'image': 
          case 'mpvideo':  
            typepro='media_id';
            break;
          case 'text':
            typepro='content';
            break;  
          case 'wxcard':
            typepro='card_id';
            break;
        }
        //封装发送数据
        let option={
          url:url,
          method:'post',
          body:{
            "filter":{
              "is_to_all":false,
              "group_id":group_id
            },
            "msgtype":type
          },
          json:true
        };
        //通过变量来设置对象的属性名
        option.body[type]={};
        option.body[type][typepro]=message;
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
   * 根据openid列表群发消息
   * 参数type是发送消息的类型
   * 参数message是要发送的消息的内容
   * 参数openids是要接收消息的用户的openid的列表（是一个数组）
   */
  openidmass(type,message,openids){
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
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/message/mass/send?access_token=${data.access_token}`;
        //根据switch不同的type类设置发送数据中不同的属性名
        let typepro;
        switch(type){
          case 'mpnews':
          case 'voice':
          case 'image': 
          case 'mpvideo':  
            typepro='media_id';
            break;
          case 'text':
            typepro='content';
            break;  
          case 'wxcard':
            typepro='card_id';
            break;
        }
        //封装发送数据
        let option={
          url:url,
          method:'post',
          body:{
            "touser":openids,
            "msgtype":type
          },
          json:true
        };
        //通过变量来设置对象的属性名
        option.body[type]={};
        option.body[type][typepro]=message;
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
   * 预览将要群发的消息的方法
   * 开发者可通过该接口发送消息给指定用户，
   * 在手机端查看消息的样式和排版。
   * 为了满足第三方平台开发者的需求，
   * 在保留对openID预览能力的同时，
   * 增加了对指定微信号发送预览的能力
   * 
   * 参数type是要发送的消息的类型
   * 参数message是要发送的消息的内容
   * 参数openid是要发送给谁预览
   */
  preview(type,message,openid){
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
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/message/mass/preview?access_token=${data.access_token}`;
        //根据switch不同的type类设置发送数据中不同的属性名
        let typepro;
        switch(type){
          case 'mpnews':
          case 'voice':
          case 'image': 
          case 'mpvideo':  
            typepro='media_id';
            break;
          case 'text':
            typepro='content';
            break;  
          case 'wxcard':
            typepro='card_id';
            break;
        }
        //封装发送数据
        let option={
          url:url,
          method:'post',
          body:{
            "touser":openid,
            "msgtype":type
          },
          json:true
        };
        //通过变量来设置对象的属性名
        option.body[type]={};
        option.body[type][typepro]=message;
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

let newsobj=new news(config.wechat);
module.exports=newsobj;