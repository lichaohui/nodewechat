'use strict'

exports.reply=function* (next){
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
      this.body=`你怎么能说${con.Content}呢？`;
      this.msgType='text';
      break;
  }
  yield next;
}