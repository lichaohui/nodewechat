//使用严格模式
'use strict'

//引入fs模块进行文件操作和promise库bluebird
const [fs,promise]=[require('fs'),require('bluebird')];

//exports暴露异步读取文件的方法
exports.readFileAsync=function(filepath,encoding){
  //返回一个promise对象
  return new promise(function(resolve,reject){
    //通过fs模块的readFile方法读取文件内容
    fs.readFile(filepath,encoding,function(err,content){
      if(err){
        //如果有错误则将promise对象的状态设置为reject并将错误返回
        reject(err);
      }else{
        //如果正常则将promise对象的状态设置为resolve并将读取的内容返回
        resolve(content);
      }
    })
  })
}

//exports暴露出一个写入文件的方法
exports.writeFileAsync=function(filepath,content){
  //同样的返回一个promise对象
  return new promise(function(resolve,reject){
    //通过fs的writeFile方法写入文件
    fs.writeFile(filepath,content,function(err){
      if(err){
        //如果有错误则将promise状态设置为reject并返回错误信息
        reject(err);
      }else{
        //如果正常则将promise对象状态设置为resolve
        resolve();
      }
    })
  })
}
