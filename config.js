/*--项目配置文件--*/

//引入path模块
const path=require('path');
//引入files模块(自定义的模块)
const files=require('./libs/files');
//设置存储凭据的配置文件
const access_token_file=path.join(__dirname,'./config/access_token.json');

//设置一个对象用来存储一些配置信息
const config={
  wechat:{
    appId:'wxbf37d744e196cf9b',
    appSecret:'fcc5ec54936416d17fb06aba1e3d0d00',
    token:'lichaohui',
    getAccessToken:function(){
      return files.readFileAsync(access_token_file);
    },
    setAccessToken:function(data){
      data=JSON.stringify(data);
      return files.writeFileAsync(access_token_file,data);
    }
  }
}

module.exports=config;