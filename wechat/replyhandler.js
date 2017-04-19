'use strict'

/*
 * 引入material模块
 * 引入path模块
 */
const [material,path]=[require('./material'),require('path')];

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
      //let data=yield material.delete('euOCFj_5eNJC6t4I_eJg-3bGlIniQ5Ry074JZ8-u1WU');
      //let data=yield material.create('permanent','other',path.resolve(__dirname, '..')+'/public/image/foo.jpg');
      let data=yield material.show('temporary','euOCFj_5eNJC6t4I_eJg-3bj_ZfwdYGewudyS6XzEl8');
      console.log(data);
      this.msgType='text';
      this.body=data;
      /*this.body={
        mediaId:data.media_id
      };*/
      break;
  }
  yield next;
}