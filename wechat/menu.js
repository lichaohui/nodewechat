/*--菜单管理的模块--*/

'use strict'

/*
 * 引入fs模块
 * 引入promise库bluebird
 * 引入config
 */
const[fs,promise,config]=[require('fs'),require('bluebird'),require('../config')];

//将request模块promisify,然后request就拥有的then方法
const request=promise.promisify(require('request'));

class menu{
  //构造函数中初始化appId和appSecret属性
  constructor(option){
    this.getAccessToken=option.getAccessToken;
  };
  
  /*
   * 获取菜单列表的方法
   */
  index(){
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
        let url=`https://api.weixin.qq.com/cgi-bin/menu/get?access_token=${data.access_token}`;
        //封装发送数据
        let option={
          url:url,
          method:'get',
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
   * 创建菜单的方法
   * 参数menu是要创建的菜单（对象的形式传入）
   */
  save(menu){
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
        let url=`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
        //封装发送数据
        let option={
          url:url,
          method:'post',
          body:menu,
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
   * 获取菜单配置的方法
   */
  show(){
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
        let url=`https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info?access_token=${data.access_token}`;
        //封装发送数据
        let option={
          url:url,
          method:'get',
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
   * 删除菜单的方法
   * 使用接口创建自定义菜单后，
   * 开发者还可使用接口删除当前使用的自定义菜单。
   * 另请注意，在个性化菜单时，
   * 调用此接口会删除默认菜单及全部个性化菜单。
   */
  delete(){
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
        let url=`https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;
        //封装发送数据
        let option={
          url:url,
          method:'get',
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

//实例化一个menu对象并暴露给外界调用
let menuer=new menu(config.wechat);
module.exports=menuer;