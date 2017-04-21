/*--项目配置文件--*/

/*
 * 引入path模块
 * 引入files模块(自定义的模块)
 */
const [path,files]=[require('path'),require('./libs/files')];
//设置存储凭据的配置文件
const access_token_file=path.join(__dirname,'./data/access_token.json');

//设置一个对象用来存储一些配置信息
const config={
  wechat:{
    appId:'wx2c474296930e81b4',
    appSecret:'f55e5fa2781afcc869f045830eba269f',
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