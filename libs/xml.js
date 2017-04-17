//引入xml2js模块和promise库bluebird
const [xml2js,promise]=[require('xml2js'),require('bluebird')];

//自定义一个parseXMLAsync方法并将其暴露给外界
exports.parseXMLAsync=function(xml){
  /*
   * 该方法返回一个promise对象
   */
  return new promise(function(resolve,reject){
    /*
     * 使用xml2js莫夸的parseString方法解析xml格式的内容
     */
    xml2js.parseString(xml,{trim:true},function(err,content){
      if(err){
        //如果有错则将promise对象的状态设置为reject
        reject(err);
      }else{
        //如果解析成功则将promise对象的状态设置为已完成
        resolve(content);
      }
    })
  })
}