/*--用户分组管理的模块--*/

'use strict'

/*
 * 引入fs模块
 * 引入promise库bluebird
 * 引入config
 */
const[fs,promise,config]=[require('fs'),require('bluebird'),require('../config')];

//将request模块promisify,然后request就拥有的then方法
const request=promise.promisify(require('request'));

class group{
  //构造函数中初始化appId和appSecret属性
  constructor(option){
    this.getAccessToken=option.getAccessToken;
  };
  
  /*
   * 获取所有用户分组的方法 
   */
  index(){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于显示分组列表需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/groups/get?access_token=${data.access_token}`;
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
   * 查询用户所在分组的方法
   * 参数openId是用户的openId
   */
  show(openId){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于查询分组需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/groups/getid?access_token=${data.access_token}`;
        let option={url:url,method:'post',body:{"openid":openId},json:true};
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
   * 创建分组的方法
   * 参数name 是组的名称
   */
  create(name){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于创建分组需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/groups/create?access_token=${data.access_token}`;
        let option={url:url,method:'post',body:{"group":{"name":name}},json:true};
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
   * 修改分组名的方法
   * 参数groupId是要被更新的分组的id
   * 参数newName是分组的新名字
   */
  update(groupId,newName){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于创建分组需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/groups/update?access_token=${data.access_token}`;
        let option={url:url,method:'post',body:{"group":{"id":groupId,"name":newName}},json:true};
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
   * 移动用户到其他分组的方法
   * 参数openid是用户的openid
   * 参数to_groupid是要移动到哪个组里（那个组的id）
   */
  move(openid,to_groupid){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于移动分组需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/groups/members/update?access_token=${data.access_token}`;
        let option={url:url,method:'post',body:{"openid":openid,"to_groupid":to_groupid},json:true};
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
   * 批量移动用户到新分组的方法
   * 参数openids是一个装载要被移动的用户的openid的数组
   * 参数to_groupid是新分组的id
   */
  batchMove(openids,to_groupid){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于移动分组需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/groups/members/batchupdate?access_token=${data.access_token}`;
        let option={url:url,method:'post',body:{"openid_list":openids,"to_groupid":to_groupid},json:true};
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
   * 删除一个用户分组的方法
   * 参数group_id是要删除的用户分组的id
   */
  delete(group_id){
    let getAcc=this.getAccessToken;
    return new promise(function(resolve,reject){
      /*
       * 由于删除分组需要access_token（调用凭据）
       * 所以这里先调用getAccessToken方法拿到调用凭据
       * getAccessToken方法是我们自己定义的
       * 也是返回一个promise
       * 所以它可以使用then方法来处理后续操作
       */
      getAcc().then(function(data){
        data=JSON.parse(data);
        //设置接口地址和post数据
        let url=`https://api.weixin.qq.com/cgi-bin/groups/delete?access_token=${data.access_token}`;
        let option={url:url,method:'post',body:{"group":{"id":group_id}},json:true};
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

let grouper=new group(config.wechat);
module.exports=grouper;