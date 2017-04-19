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
  
  /*
   * 上传素材的方法
   * 参数cate是素材分类：临时素材和永久素材
   * type是素材类型
   * material是具体的素材
   */
  create(cate,type,material){
    
    //设置提交的表单
    let form={};
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
        //通过switch不同的cate和type来封装不同的上传接口地址和上传数据
        let url;
        switch(cate){
          //新增临时素材  
          case 'temporary':
            url=`https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${data.access_token}&type=${type}`;
            /*
             * fs模块的createReadStream()方法读取一个文件内容
             * 返回一个readstrem(可读流)
             * 参数是要读取的文件的路径
             */
            form.media=fs.createReadStream(material);
            
            break;
          //新增永久素材  
          case 'permanent':
            switch(type){
              //新增永久素材之新增图文素材  
              case 'news':
                url=`https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=${data.access_token}`;
                form.media=material;
                break;
              //新增永久图文素材中的图片
              case 'news_pic':
                url=`https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${data.access_token}`;
                form.media=fs.createReadStream(material);
                break;
              //新增永久其他素材
              case 'other':
                url=`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${data.access_token}`;
                form.media=fs.createReadStream(material);
                break;
            }
            break;  
        }
        request({url:url,method:'post',formData:form,json:true}).then(function(response){
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

let mater=new material(config.wechat);
module.exports=mater;