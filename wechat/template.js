'use strict'
/*--处理各种消息类型的模板文件--*/
//引入ejs模板模块和heredoc模块
const [ejs,heredoc]=[require('ejs'),require('heredoc')];

let tpl=`<xml>
           <ToUserName><![CDATA[${toUserName}]]></ToUserName><FromUserName><![CDATA[${fromUserName}]]></FromUserName><CreateTime>${createTime}</CreateTime><MsgType>
           <![CDATA[${msgType}]]></MsgType>
           <% if (msgType=='text'){%>
             <Content><![CDATA[${content}]]></Content>      
           }<% } else if(msgType=='image') { %>
             <Image>
               <MediaId><![CDATA[${content.media_id}]]></MediaId>
             </Image>
           <% } else if(msgType=='voice') { %>
             <Voice>
               <MediaId><![CDATA[${content.media_id}]]></MediaId>
             </Voice>
           <% } else if(msgType=='video') { %>
             <Video>
               <MediaId><![CDATA[${content.media_id}]]></MediaId>
               <Title><![CDATA[${content.title}]]></Title>
               <Description><![CDATA[${content.description}]]></Description>
             </Video> 
           <% } else if(msgType=='music') { %>
             <Music>
               <Title><![CDATA[${content.TITLE}]]></Title>
               <Description><![CDATA[${content.DESCRIPTION}]]></Description>
               <MusicUrl><![CDATA[${content.musicUrl}]]></MusicUrl>
               <HQMusicUrl><![CDATA[${content.hqMusicUrl}]]></HQMusicUrl>
               <ThumbMediaId><![CDATA[${content.thumbMediaId}]]></ThumbMediaId>
             </Music>
           <% } else if(msgType=='news') {%>
             <ArticleCount>${content.length}</ArticleCount>
             <Articles>
               <% content.forEach(function(item){ %>
               <item>
                 <Title><![CDATA[${item.title}]]></Title> 
                 <Description><![CDATA[${item.description}]]></Description>
                 <PicUrl><![CDATA[${item.picurl}]]></PicUrl>
                 <Url><![CDATA[${item.url}]]></Url>
               </item>
               <% }) %>
            </Articles>
           <% } %>
         </xml>`;

//通过ejs的compile()方法编译tpl模板
let compiled=ejs.compile(tpl);

//暴露出一个编译模板的对象
module.exports={
  compiled:compiled
}