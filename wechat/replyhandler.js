'use strict'

/*
 * 引入material模块(素材管理)
 * 引入group模块(用户分组管理)
 * 引入path模块
 */
const [material,group,path]=[require('./material'),require('./group'),require('path')];

exports.reply=function* (next){
  /*
   * 在上一步的中间件中也就是reqverify.js中调用replyhandler的时候使用了call方法将当前的上下文对象引用给了replyhandler对象，
   * 所以下面虽然我们没有定义当前对象的con属性
   * 但是仍然可以使用this.con
   * 这是因为当前的上下文对象被改变成为了reqverify中的上下文对象
   * 这里的this就是指的reqverify中的上下文对象而不是指的当前对象了
   * this.con自然也就是指的reqverify上下文对象的con属性了
   */
  let con=this.con;
  /*
   * 通过switch来遍历msgType(消息类型)
   * 根据不同的消息类型做出不同的回复处理
   */
  switch(con.MsgType){
    case 'event':
      /*
       * 如果MsgType是事件(event)类型
       * 通过switch遍历事件类型
       * 通过不同的事件类型来指定不同的回复
       */
      switch(con.Event){
        case 'subscribe':
          //设置回复内容
          this.body='你好，欢迎关注李朝辉！';
          //设置回复的类型
          this.msgType='text';
          break;
        case 'unsubscribe':
          console.log('取消关注！'); 
          this.body='';
          break;
        case 'SCAN':
          this.body=`您SCAN了菜单：${con.EventKey}`;
          this.msgType='text';
          break;
        case 'LOCATION':
          this.body=`您的纬度是：${con.Latitude}，经度是：${con.Longitude}，精确度：${con.Precision}`;
          this.msgType='text';
          break;
        case 'CLICK':
          this.body=`您点击了菜单：${con.EventKey}`;
          this.msgType='text';
          break;
        case 'VIEW':
          this.body=`您要view菜单了：${con.EventKey}`;
          this.msgType='text';
          break;
      }
      break;  
    case 'text':
      let data;
      switch(con.Content){
        case 'groupindex':
          data=yield group.index();
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body=JSON.stringify(data);
          }
          break;
        case 'groupshow':
          data=yield group.show('od8XIjsmk6QdVTETa9jLtGWA6KBc');
          this.msgType='text';
          console.log(data);
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body=JSON.stringify(data);
          }
          break;
        case 'groupcreate':
          data=yield group.create('同学');
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body=`您成功创建了${data.group.name}分组`;
          }
          break;
        case 'groupupdate':
          data=yield group.update(102,'同事');
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body='修改成功';
          }
          break;
      }
      break;    
  }
  yield next;
}