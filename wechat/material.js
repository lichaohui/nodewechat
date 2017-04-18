/*--素材管理模块--*/

'use strict'

/*
 * 引入fs模块
 * 引入promise库bluebird
 * 引入config
 */
const[fs,promise,config]=[require('fs'),require('bluebird'),require('../config')];

//将request模块promisify,然后request就拥有的then方法
let request=promise.promisify(require('request'));

class material{
  //构造函数中初始化appId和appSecret属性
  constructor(option){
    this.getAccessToken=option.getAccessToken;
  };
  
  //上传素材的方法
  create(type,filepath){
    //设置提交的表单
    let form={
      /*
       * fs模块的createReadStream()方法读取一个文件内容
       * 返回一个readstrem(可读流)
       * 参数是要读取的文件的路径
       */
      media:fs.createReadStream(filepath),
    }
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于上传素材需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      
      getAcc().then(function(data){
        data=JSON.parse(data);
        console.log(data);
        //表单提交的地址
        let url=`https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${data}&type=${type}`;
        request({url:url,method:'post',formData:form,json:true}).then(function(response){
          //响应的数据在response.body中
          let resdata=response.body;
          console.log(resdata);
          if(resdata){
            //如果响应正常则将promise对象的状态设置为已完成
            resolve(resdata);
          }
        })
      })
    })
  }
}

let mater=new material(config.wechat);
module.exports=mater;