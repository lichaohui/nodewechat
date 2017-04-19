/*--该模块是用来执行回复消息的类--*/

//使用严格模式
'use strict'

//引入扩展包中的tpl模块来生成回复消息（自定义的）
const tpl=require('../libs/tpl');

class reply{
  //构造函数中初始化appId和appSecret属性
  constructor(){
   
  };
  
  //reply方法执行回复消息的动作
  reply(){
    /*
     * 通过tpl的create方法来生成我们的回复消息
     * 因为在reqverify中使用reply的时候call了当前对象，
     * 改变了上下文环境
     * 所有下面参数中的this.body,this.con和this.msgType并不是reply对象的属性
     * 而是reqverify模块中上下文环境的属性
     * 可以直接拿来使用
     */
    let xml=tpl.create(this.body,this.con,this.msgType);
    console.log(xml);
    //执行回复
    this.status=200;
    this.type='application/xml';
    this.body=xml;
  }
}
//实例化一个reply对象
let replyobj=new reply();
//将实例化后的reply对象暴露出去
module.exports=replyobj;
