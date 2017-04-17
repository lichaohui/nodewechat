//引入xml2js模块和promise库bluebird
const [xml2js,promise]=[require('xml2js'),require('bluebird')];

/*
 * 自定义一个parseXMLAsync方法并将其暴露给外界
 * 该方法将xml格式解析为js对象
 */
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

/*
 * 将解析完后获取到的js对象通过xml模块的format方法格式化一下
 * 将其格式化为可用的js对象
 * 这个地方可能解释不清楚
 * 比如：parseXMLAsync()方法解析完成后的数据为：
 * { 
     xml: 
       { 
         ToUserName: [ 'gh_3ce3a0e92da9' ],
         FromUserName: [ 'orNfTwvWWqwM04jnZRfgbURBdGxY' ],
         CreateTime: [ '1492407655' ],
         MsgType: [ 'event' ],
         Event: [ 'subscribe' ],
         EventKey: [ '' ] 
       } 
     }
 * 那么格式化(format)完之后就会是这个样子：
 * 
 */
var result={};

exports.format=function(obj){
  result={};
  //通过Object.keys(obj)获取某个对象的所有键名
  let keys=Object.keys(obj);
  //通过一个循环遍历将obj的键名和对应的键值放到result对象中
  for(let key of keys){
    //获取当前的键值
    let value=obj[key];
    //如果当前的键值
    if(typeof(value)=='object'){
      if(value.length){
	    result[key]=value[0];
	  }else{
	    formatMsg(value);
	  }
    }else{
      result[key]=value;
    }
  }
  return result;
}
