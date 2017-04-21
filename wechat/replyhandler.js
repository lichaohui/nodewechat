'use strict'

/*
 * 引入material模块(素材管理)
 * 引入group模块(用户分组管理)
 * 引入user模块(用户管理模块)
 * 引入news模块(消息管理模块)
 * 引入menu模块(菜单管理)
 * 引入account模块(公众号账号管理)
 * 引入files模块(该模块是自己封装的)读取保存数据的文件中的内容
 * 引入path模块
 */
const [material,group,user,news,menu,account,files,path]=[require('./material'),require('./group'),require('./user'),require('./news'),require('./menu'),require('./account'),require('../libs/files'),require('path')];

/*
 * 引入菜单数据文件并创建菜单
 * 这个地方平时是注释掉的
 * 只有在我们第一次创建菜单或者对菜单进行修改的时候才打开
 * 修改完之后再关闭掉
 */ 
/*files.readFileAsync(path.resolve(__dirname, '..')+'/data/menu.json').then(function(data){
  return menu.save(JSON.parse(data));
}).then(function(data){
  console.log(data);
});*/

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
         case 'scancode_push':
          this.msgType='text';
          this.body='您这是一个扫码事件';
          break;
        case 'scancode_waitmsg':
          this.msgType='text';
          this.body='您这是一个扫码等待消息事件';
          break;  
        case 'LOCATION':
          this.msgType='text';
          this.body=`您的纬度是：${con.Latitude}，经度是：${con.Longitude}，精确度：${con.Precision}`;
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
    case 'location':
      this.msgType='text';
      this.body=`您上报的地理位置是：${con.Label}`;
      break;
    case 'image':
      this.msgType='text';
      this.body=`图片我收到了，地址是${con.PicUrl}`;
      break;
    case 'text':
      let data;
      switch(con.Content){
        case 'materialindex':
          data=yield material.index('image',0,2);
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body=JSON.stringify(data);
          }
          break;
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
          data=yield group.show(con.FromUserName);
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
        case 'groupmove':
          data=yield group.move(con.FromUserName,102);
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body='移动成功';
          }
          break;
        case 'groupbatchmove':
          data=yield group.batchMove(["oDF3iYx0ro3_7jD4HFRDfrjdCM58","oDF3iY9FGSSRHom3B-0w5j4jlEyY"],102);
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body='批量移动成功';
          }
          break;
        case 'groupdelete':
          data=yield group.delete(101);
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body='删除成功';
          }
          break;
        case 'userindex':
          data=yield user.index();
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body=JSON.stringify(data);
          }
          break;
        case 'useremark':
          data=yield user.remark(con.FromUserName,'王二麻子');
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body='修改备注成功！';
          }
          break;
        case 'usershow':
          data=yield user.show(con.FromUserName);
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body=JSON.stringify(data);
          }
          break;
        case 'userbatchshow':
          data=yield user.batchshow([{"openid": "otvxTs4dckWG7imySrJd6jSi0CWE"},{"openid": "otvxTs_JZ6SEiP0imdhpi50fuSZg"}]);
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body=JSON.stringify(data);
          }
          break;
        case 'newsgroup':
          data=yield news.grouping('text','hello lucy',102);
          this.msgType='text';
          this.body=data.errmsg;
          break;
        case 'newsopenid':
          data=yield news.openidmass('text','hello lily',['o0xl8w_tdQEl7yWBtrcAepB3rfjg','o0xl8w2Hxj1m9bc_QM8Wnn_k_OEI']);
          this.msgType='text';
          this.body=data.errmsg;
          break;
        case 'newspreview':
          data=yield news.preview('text','hello jack','o0xl8w_tdQEl7yWBtrcAepB3rfjg');
          this.msgType='text';
          this.body=data.errmsg;
          break;
        case 'newsshow':
          data=yield news.show('3147483656');
          this.msgType='text';
          this.body=JSON.stringify(data);
          break; 
        case 'ticket':
          data=yield account.createticket({"expire_seconds": 604800, "action_name": "QR_SCENE", "action_info": {"scene": {"scene_id": 123}}});
          this.msgType='text';
          if(data.errcode){
            this.body=data.errmsg;
          }else{
            this.body='生成成功了';
          }
          break;
        case 'qrcode':
          data=yield account.getqrcode('gQEK8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyVlY0WmNDanBkWTMxMWxJM2hwMUgAAgTV8flYAwSAOgkA');
          this.msgType='text';
          this.body=data;
          break;
      }
      break;    
  }
  yield next;
}