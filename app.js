/*--app.js为项目的入口文件--*/

//使用严格模式
'use strict'

/*
 * 引入koa模块
 * 引入koa路由模块
 * 引入co模块
 * 引入reqverify中间件
 * 引入acctoken中间件
 * 引入config项目配置文件
 * 引入replyhandler模块
 */
const[koa,route,co,reqverify,acctoken,config,reply]=[require('koa'),require('koa-router'),require('co'),require('./wechat/reqverify'),require('./wechat/acctoken'),require('./config'),require('./wechat/replyhandler')];

/*
 * 实例化一个koa对象
 * 实例化route对象
 */
const[app,router]=[new koa(),new route()];

//制定路由规则
/*router.get('/movie',function(ctx){
  ctx.body=ctx.render('index');
})*/

router.get('/movie', co.wrap(function* (ctx) { //访问根目录
    /*logger.debug(' this is test log')  
    if(ctx.session.view === undefined) {
        ctx.session.view = 0
    } else {
        ctx.session.view += 1   
    }*/
    //console.log('viewNum', ctx.session.view)
    yield ctx.render('index', {title: 'Nunjucks'})  //渲染模板views/index.html, 后面RESTful接口使用要用到该html文件
}))

//在中间件里使用路由规则
app.use(router.routes());

//使用acctoken中检验验证access_token
app.use(acctoken(config.wechat));
//使用reqverify中间件验证请求
app.use(reqverify(config.wechat,reply.reply));

//监听80端口
app.listen(80);
console.log('server is running in port:80');