'use strict'

exports.reply=function* (next){
  let con=this.con;
  if(con.MsgType=='event'){
    //如果是订阅事件
    if(con.Event=='subscribe'){
      this.body='你好，欢迎关注李朝辉！'
    }else if(con.Event=='unsubscribe'){
      console.log('取消关注！'); 
    }
  }
  yield next;
}