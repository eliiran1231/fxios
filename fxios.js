const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const md5 = require('md5');
const querystring = require('querystring');
const io = require('socket.io-client')
const cheerio = require('cheerio');
const axiosProxyTunnel = require('axios-proxy-tunnel')



const options = querystring.stringify({
  headers:{
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",  
    
  } ,
  
})
var htmlToBBCode = function(html){

  return html
  .replace(/&nbsp;/g, ' ')
  .replace(/<div class="bbcode_container">((.|\n|<br>)*?)<strong>(.*?)<\/strong>((.|\n|<br>)*?)p=(.*?)#((.|\n|<br>)*?)<div class="message">((.|\n|<br>)*?)<\/div>/g ,'[QUOTE=$3;$6]$9[/QUOTE]<br><br><br>')
  .replace(/<pre(.*?)>(.*?)<\/pre>/gmi, "[code]$2[/code]")
  .replace(/<br>/g, '$.^')
  .replace(/\n/g, '')
  .replace(/<a href="member.php\?u=(.*?)" style="text-decoration: none;color:#0e5ba7;">(.*?)<\/a>/, "[taguser]$1[/taguser]")
  .replace(/<h[1-7](.*?)>((.|\n|<br>)*?)<\/h[1-7]>/, "<br>[h]$2[/h]<br>")
  .replace(/<iframe(.*?)id="(.*?)_(.*?)"(.*?)>((.|\n|<br>)*?)<\/iframe>/g, "https://www.youtube.com/watch?v=$2")
  .replace(/<source src="https:\/\/voice2.fcdn.co.il\/sound2\/(.*?).mp3" type="audio\/mpeg">/gm,'[voice2]$1[/voice2]')
  .replace(/  Your browser does not support the audio element./g,'')
  .replace(/<div class="bbcode_code" style="height:36px;"><code><code>((.|\n|<br>)*?)<\/code><\/code><\/div>/gm[0], '$1'.replace(/<span style="color: #(.*?)">/, '').replace("</span>", "").replace('&nbsp;'," "))
  .replace(/<font size="(.*?)">((.|\n|<br>)*?)<\/font>/gm, '\[SIZE=$1]$2\[/SIZE]')
  .replace(/<textarea(.*?)>((.|\n|<br>)*?)<\/textarea>/gmi, "\[code]$2\[\/code]")
  .replace(/<span style="color:(.*?);">((.|\n|<br>)*?)<\/span>/g, "\[COLOR=$1]$2\[/COLOR]")
  .replace(/<span style="font-family: (.*?)">((.|\n|<br>)*?)<\/span>/g, "\[FONT=$1]$2\[\/FONT]")
  .replace(/<b>/gi, "[b]")
  .replace(/<i>/gi, "[i]")

  .replace(/<u>/gi, "[u]")
  .replace(/<\/b>/gi, "[/b]")
  .replace(/<\/i>/gi, "[/i]")
  .replace(/<\/u>/gi, "[/u]")
  .replace(/<em>/gi, "[b]")

  .replace(/<\/em>/gi, "[/b]")
  .replace(/<strong>/gi, "[b]")
  .replace(/<\/strong>/gi, "[/b]")
  .replace(/<cite>/gi, "[i]")
  .replace(/<\/cite>/gi, "[/i]")
  .replace(/<font color="(.*?)">((.|\n|<br>)*?)<\/font>/g, "\[color=$1]$2\[/color]")
  .replace(/<font color=(.*?)>((.|\n|<br>)*?)<\/font>/gm, "\[color=$1]$2\[/color]")

  .replace(/<link(.*?)>/gi, "")
  .replace(/<li(.*?)>((.|\n|<br>)*?)<\/li>/gi, "[*]$2")
  .replace(/<ul(.*?)>/gi, "[list]")
  .replace(/<\/ul>/gi, "s[/list]")
  .replace(/<div>/gi, "")
  .replace(/<\/div>/gi, "")

  .replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img]$2[/img]")
  .replace(/<a(.*?)href="(.*?)"(.*?)> ((.|\n|<br>)*?)<\/a>/gi, "[url=$2]$4[/url]")

  .replace(/<head>(.*?)<\/head>/gmi, "")
  .replace(/<script(.*?)>(.*?)<\/script>/gmi, "")
  .replace(/<style(.*?)>(.*?)<\/style>/gmi, "")

	.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "")
	.replace(/\r\r/gi, "")
	.replace(/\[url=\//gi, "[url=")
  .replace(/\$\.\^/g, '<br>')  
  .replace(/^<br>|<br>$/g, '')

}

class Bot{
  constructor(){
    this.instance = axios.create({
      withCredentials: true
    })
    axiosCookieJarSupport(this.instance);
    this.instance.defaults.jar = new tough.CookieJar();
    axiosProxyTunnel(this.instance) 
  }
    async login(username, password){ 
      const data = querystring.stringify({
        vb_login_username: username,
        vb_login_password: password,
        loginbtn: "התחברות",
        s: "",
        to_homepage: "1",
        securitytoken: "guest",
        do: "login",
        cookieuser: "1",
        vb_login_md5password: "",
        vb_login_md5password_utf: ""
    })
    await this.instance.post("https://www.fxp.co.il/login.php?do=login", data, options)
    var res = await this.instance.get("https://www.fxp.co.il")
    var info = {
       securitytoken: /var SECURITYTOKEN = "(.*?)";/.exec(res.data)[1],
       userId: Number(/var LOGGEDIN = (.*?) >/.exec(res.data)[1]),
       send: /send = '(.*?)'/g.exec(res.data)[1]
     };
    this.info = info;
    console.log("logged in");      
  }
    addmember(username, password){
    const data = querystring.stringify({
      username: username ,
      password: "" ,
      passwordconfirm: "" ,
      email: username + "e@gmail.com",
      emailconfirm: "",
      agree: "1" ,
      s: "",
      securitytoken: "guest",
      do: 'addmember' ,
      url: "https://www.fxp.co.il/",
      password_md5: md5(password) ,
      passwordconfirm_md5: md5(password) ,
      day: "",
      month: "",
      year:""
    })

    axios.post("https://www.fxp.co.il/register.php?do=addmember", data, options)
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
      console.log("the user "+ username +" has created sueccesfully");
    }) 
    .catch((error) =>{
      console.error(error);
    })
  }
    logout(){
      var securitytoken = this.info.securitytoken;
      this.instance.get("https://www.fxp.co.il/login.php?do=logout&logouthash=" + securitytoken)
      .then((respnse) => {
          console.log('logged out');
      })
      .catch((err)=> {console.log(err);
       }) 
      
  }
    makelike(commentId){
      var securitytoken = this.info.securitytoken;
      const data = querystring.stringify({
        do: 'add_like',
        postid: commentId + "",
        securitytoken: securitytoken,
      })

      this.instance.post("https://www.fxp.co.il/ajax.php", data, options)
      .then((respnse) => {
        console.log("like added to message "+ commentId);          
      }) 
      .catch((error) =>{
      console.log(error);
      })
    

  
  }
    sendMessage(showtherdId, message){
      var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
          securitytoken: securitytoken,
          ajax: "1",
          message_backup: message + "",
          message: message + "",
          wysiwyg: "1",
          signature: "1",
          fromquickreply: "1",
          s: "",
          securitytoken: securitytoken,
          do: "postreply",
          t: showtherdId + "",
          specifiedpost: "0",
          parseurl: "1",
          loggedinuser: this.info.id + "",
          poststarttime: "1593688317"
        })  
  
        this.instance.post("https://www.fxp.co.il/newreply.php?do=postreply&t=" + showtherdId ,data, options)
        .then((respnse) => {
          console.log("message has been sent");  
        })
        .catch((err) => {
          console.log(err);
        })
  }
    newthread(forumId, tag, title, content){
      var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
          prefixid: tag + "",
          subject: title + "",
          message_backup: content + "",
          message: content + "",
          wysiwyg: "1",
          s: "",
          securitytoken: securitytoken, 
          f: forumId + "",
          do: "postthread",
          posthash: "",
          poststarttime: "",
          loggedinuser: bot.info.id + "",
          sbutton: "צור אשכול חדש",
          signature: "1",
          parseurl: "1"
        })
  
        this.instance.post("https://www.fxp.co.il/newthread.php?do=postthread&f=" + forumId ,data, options)
        .then((respnse) => {
        console.log("new showthread has created");
        })
        .catch((err) => {
          console.log(err);
        })
  
  }
    deleteMessage(commentId){
      var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
          s: "",
          securitytoken: securitytoken,
          p: commentId + "",
          url: "https://www.fxp.co.il/showthread.php?p=" + commentId,
          do: "deletepost"
        })
  
        this.instance.post("https://www.fxp.co.il/editpost.php?do=deletepost&p=" + commentId ,data, options)
        .then((respnse) => {
          console.log("the message " + commentId + " has deleted");
        })
        .catch((err) => {
          console.log(err);
        })
  
  }
    editMessage(commentId, content){
      var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
          securitytoken: securitytoken,
          do: "updatepost",
          ajax: "1",
          postid: commentId + "",
          poststarttime: "1593697060",
          message: content + "",
          reason: "",
          relpath: "showthread.php?p=" + commentId
        })
        const options = querystring.stringify({
          headers:{
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"  
          }
          }) 
          this.instance.post("https://www.fxp.co.il/editpost.php?do=updatepost&postid=" + commentId ,data, options)
        .then((respnse) => {
          console.log("the massage content is now " + content);
        })
        .catch((err) => {
          console.log(err);
        })
  }
    sendNewPM(user, subject, message){
      var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
          securitytoken: securitytoken,
          do: "insertpm",
          recipients: user + "",
          title: subject + "",
          message: message + "",
          savecopy: "1",
          signature: "1",
          parseurl: "1",
          frompage: "1"
        })
  
        this.instance.post("https://www.fxp.co.il/private_chat.php" ,data, options)
        .then((respnse) => {
          console.log('new private message has been sent and it is "' + message +'" now');
        })
        .catch((err) => {
          console.log(err);
        })
  
  }
    sendPM(pmId, user, message){
    var securitytoken = this.info.securitytoken;
      const data = querystring.stringify({
        message: message + "",
        fromquickreply: "1",
        securitytoken: securitytoken,
        do: "insertpm",
        pmid: pmId + "",
        loggedinuser: this.info.id + "",
        parseurl: "1",
        signature: "1",
        title: "תגובה להודעה:",
        recipients: user,
        forward: "0",
        savecopy: "1",
        fastchatpm: "1",
        wysiwyg: "1",
        })

        this.instance.post("https://www.fxp.co.il/private_chat.php" ,data, options)
      .then((respnse) => {      
        console.log("private message has been sent to chat number " + pmId);
      })
      .catch((err) => {
        console.log(err);
      })

  }
    async getUserInfo(id){
      const res = await axios.get("https://www.fxp.co.il/member.php?u=" + id); 
      const $ = cheerio.load(res.data);
      const user = {
       name: $('.member_username').text(),
       id: Number(id),
       subname: $('.usertitle').text(), 
       isConnected: res.data.includes($('.member_username').text() +" לא" +" מחובר/ת") == false
      }
      return new Promise(resolve => {
        resolve(user)
      })
      .catch((reject) => {
        reject("there was an error")
      })
  }
    async getUserInfoByName(username){
      const res = await axios.get("https://www.fxp.co.il/member.php?username=" + encodeURI(username)); 
      const $ = cheerio.load(res.data);
      const user = {
       name: $('.member_username').text(),
       id: Number(/(?<=u=)\d+(?=\&)/gm.exec(res.data)),
       subname: $('.usertitle').text(), 
       isConnected: res.data.includes($('.member_username').text() +" לא" +" מחובר/ת") == false
      }
      return new Promise(resolve => {
        resolve(user)
      })
      .catch((reject) => {
        reject("there was an error")
      })
  }
    async getQouteInfo(commentId){
      const data = querystring.stringify({
        securitytoken: bot.info.securitytoken,
        do: 'getquotes',
        p: commentId + ''
      })
      const response = await this.instance.post('https://www.fxp.co.il/ajax.php?do=getquotes&p=' + commentId,data,options)
      //getting the pages and saving the responses into the variables
      const username = /(?<==)[^;"]+/gm.exec(response.data)[0]
      //getting the name of the message author
      const user = await this.getUserInfoByName(username);
      //scrapping more data about the message author using the name we scrapped
      let Quote = /\[\w+[^UTF]+\w+\]/gm.exec(response.data)[0]
      //scarpping the full VB Quote code 


      const message = { 
          author: ()=>{return user},
          id: ()=>{return Number(commentId)},
          VBQuote: ()=>{return Quote + "<br><br><br>"} ,
          content: ()=>{return Quote.replace("[/QUOTE]", '').replace(`[QUOTE=${user.name};${commentId}]`, '').replace(/<br><br>$/, "")}, //the actuall content of the message
          reply: (msg) => {
            var securitytoken = this.info.securitytoken;
            const data = querystring.stringify({
              securitytoken: securitytoken,
              ajax: "1",
              message_backup: Quote + msg + "",
              message: Quote + msg + "",
              wysiwyg: "1",
              signature: "1",
              fromquickreply: "1",
              s: "",
              securitytoken: securitytoken,
              do: "postreply",
              p: commentId + "",
              specifiedpost: "0",
              parseurl: "1",
              loggedinuser: this.info.id + "",
              poststarttime: "1593688317"
            })  
      
            instance.post("https://www.fxp.co.il/newreply.php?do=postreply&p=" + commentId ,data, options)
            .then((respnse) => {
                if(respnse.status != 200){
                  console.log(respnse.statusText);
                }
                else if(querystring.parse(data).securitytoken == null || querystring.parse(data).securitytoken == undefined || querystring.parse(data).id== null || querystring.parse(data).id== undefined){
                getUserData()            
                this.sendMessage(commentId, msg)
                }
                else{
              console.log("reply has been sent");  
              }
            })
            .catch((err) => {
              console.log("reply has been sent");  
            })
          } 
        }
     return new Promise(resolve => {resolve(message)}).catch(reject => {"there was an error"})               
    
  }
    onNewMessage(callback){
    var socket = io.connect('https://socket5.fxp.co.il');
    socket.on('connect',()=>{
    var send = this.info.send;
    socket.send(send)
    })
  
    socket.on('newreply',async(data)=>{
      var res = await this.instance.get('https://www.fxp.co.il/showthread.php?t='+data.thread_id+'&page=90000')
      const $ = cheerio.load(res.data, {decodeEntities: false})
      function TheId(){return $('#posts').children().last().attr('id').replace('post_', "")} 
      function post(){return $('#posts').children().last().html()} 
      const c = cheerio.load(post(), {decodeEntities: false})      
      function VBQuote(){return `[QUOTE=${data.username};${TheId()}]${content()}[/QUOTE]<br><br>`}
      function content(){return htmlToBBCode(c('#post_message_'+ TheId()).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/g, '')}

      const message = {
        author: {
          name: ()=>{return data.username},
          id: ()=>{return Number(c('.user-picture-holder').attr('data-user-id'))} ,
          subname: ()=>{return c('.usertitle').text().replace(/\n/g, '')},
          isConnected: ()=>{return post().includes(data.username + " מחובר" || data.username + " מחוברת")} ,
        },
        thread: {
          id: Number(data.thread_id),
          title: data.title
        },
        id: ()=>{return Number(TheId())},
        VBQuote: function(){return `[QUOTE=${data.username};${TheId()}]${content()}[/QUOTE]<br><br>`},
        content: function(){return htmlToBBCode(c('#post_message_'+ TheId()).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/g, '')},
        contentWithQuotes: function(){return htmlToBBCode(c('#post_message_'+ TheId()).html()).replace(' [/QUOTE]','[/QUOTE]')},
        reply: (msg)=>{this.sendMessage(data.thread_id, VBQuote() + msg)}
      }

      callback(message)

    })

  } 
    onNewLike(callback){
  var socket = io.connect('https://socket5.fxp.co.il');
  socket.on('connect',()=>{
  var send = this.info.send;
  socket.send(send)
  })

  socket.on('new_like',async(data)=>{
    var message = await this.getQouteInfo(data.postid);
    var member = await this.getUserInfoByName(data.username)
    var obj = {
      messageLiked:message,
      memberLiked: member
    }
    callback(obj)
})
  }
    onNewPM(callback){
      var socket = io.connect('https://socket5.fxp.co.il');
      socket.on('connect',()=>{
      var send = this.info.send;
      socket.send(send)
      })
    
      socket.on('newpmonpage',async(data)=>{
        var pm = {
          content: data.message,
          author: await this.getUserInfo(data.send),
          id: Number(data.pmid),
          title: data.title,
          time: data.date + " " + data.time,
          reply: (msg)=>{this.sendPM(data.pmid,data.username,msg)} 
        }
        callback(pm)
    })
  
  }
    async onNewThread(forumId, callback){
    var socket = io.connect('https://socket5.fxp.co.il');
    socket.on('connect',async()=>{
    var forum = await this.instance.get('https://www.fxp.co.il/forumdisplay.php?f='+ forumId +'&web_fast_fxp=1')
    var send = /\{"userid[^']+/gm.exec(forum.data)
    socket.send(send)

    })
  
    socket.on('newtread',async(data)=>{
      var res = await this.instance.get('https://www.fxp.co.il/printthread.php?t=' + data.id)
      var content = /<blockquote class="restore">(.*?)<\/blockquote>/g.exec(res.data)[1] 
      var thread ={
        content: htmlToBBCode(content).trim(),
        id: Number(data.id),
        title: data.title.replace('&quot;', '"'),
        author: await this.getUserInfo(data.poster),
        time: data.time,
        tag: data.prefix
      }
      callback(thread);  
  })
  }
  onNewMessageOnThread(thread_id,callback){
    var socket = io.connect('https://socket5.fxp.co.il');
    socket.on('connect',async()=>{
    var thread = await this.instance.get("https://www.fxp.co.il/showthread.php?t="+thread_id)
    var send = /send = '(.*?)'/g.exec(thread.data)[1];
    console.log(send);
    socket.send(send)

    })
  
    socket.on('showthreadpost',async(data)=>{
      const msg = await this.getQouteInfo(data.postid);
      callback(msg);
  })
  }      
}


module.exports = Bot;