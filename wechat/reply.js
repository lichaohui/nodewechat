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
    //通过tpl的create方法来生成我们的回复消息
    let xml=tpl.create(this.body,this.con);
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
