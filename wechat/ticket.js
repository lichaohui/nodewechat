/*--获取api-ticket的管理模块--*/

'use strict'

/*
 * 引入fs模块
 * 引入promise库bluebird
 * 引入config
 */
const[fs,promise,config]=[require('fs'),require('bluebird'),require('../config')];

//将request模块promisify,然后request就拥有的then方法
const request=promise.promisify(require('request'));

class ticket{
  constructor(option){
    this.appId=option.appId;
    this.appSecret=option.appSecret;
    this.getAccessToken=option.getAccessToken;
    this.getTicket=option.getTicket;
    this.setTicket=option.setTicket;
  };
  
  //判断ticket是否有效的方法
  isValidTicket(data){
    //先判断参数中的ticket和expires_in是否存在
    if(data.ticket && data.expires_in){
      //如果存在则分别获取到两个值
      let [ticket,expires_in]=[data.ticket,data.expires_in];
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
      //如果参数中的ticket和expires_in不存在则直接返回false
      return false;
    }
  }

  //更新ticket的方法
  updateTicket(){
    let that=this;
    /*
     * 因为我们希望updateTicket方法返回一个promise对象
     * 所以我们需要封装一下
     * 在这里返回一个promise对象
     */
    return new promise(function(resolve,reject){
      that.getAccessToken().then(function(data){
        data=JSON.parse(data);
        //ticket的请求地址
        let url=`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data.access_token}&type=jsapi`;
        /*
         * 通过nodejs的request模块发送一个get请求到微信提供的url上
         * 可以获取到accesstoken
         * request请求参数是一个对象
         * url是请求地址，json:true是设置返回格式为json
         */
        request({url:url,json:true}).then(function(response){
          //响应的数据在response.body中
          let data=response.body;
          /*
           * 重新设置ticket的过期时间
           * 将过期时间设置为当前时间加上服务器返回的expires_in（毫秒，然后*1000）
           */
          data.expires_in=new Date().getTime()+(data.expires_in-20)*1000;
          //然后将promise对象的状态设置为已完成
          resolve(data);
        })
      })
    }) 
  }
  
  //获取ticket的方法
  fetchTicket(){
    let that=this;
    return new promise(function(resolve,reject){
      /*
       * getTicket()方法返回的是一个promise对象
       * 所以可以调用该对象的then方法进行下一步操作
       * promise对象是es6新标准中定义的用来改善异步回调写法的js对象
       * then方法中包含一个回调函数
       * 回调函数的data参数是上一步中的返回值
       */
      that.getTicket()
      .then(function(data){
        try{
          //尝试将data进行JSON.parst
          data=JSON.parse(data);
        }catch(e){
          //如果有异常则使用updateTicket()方法更新accesstoken
          that.updateTicket();
        }
        //如果拿到了token则验证是否是有效的
        if(that.isValidTicket(data)){
          /*
           * 如果token有效则通过promise对象的resolve方法将promise对象的状态设置为resolve
           * 就是已完成的状态
           */
          return promise.resolve(data);
        }else{
          /*
           * 如果token已经过期则还是更新token
           */
          return that.updateTicket();
        }
      }).then(function(data){
        //最后调用then方法保存ticket到本地
        that.setTicket(data);
      })
    })
  }
}

let ticketer=new ticket(config.wechat);
module.exports=ticketer;