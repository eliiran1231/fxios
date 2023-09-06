import axios from 'axios';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { CookieJar as tough } from 'tough-cookie';
import { load } from 'cheerio';
import axiosProxyTunnel from 'axios-proxy-tunnel';
import querystring from "query-string";
import io from 'socket.io-client';
export const options = "headers[user-agent]=Mozilla%2F5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F81.0.4044.138%20Safari%2F537.36";
export var htmlToBBCode = function (html) {
    return html
        .replace(/&nbsp;/g, ' ')
        .replace(/<div class="bbcode_container">((.|\n|<br>)*?)<strong>(.*?)<\/strong>((.|\n|<br>)*?)p=(.*?)#((.|\n|<br>)*?)<div class="message">((.|\n|<br>)*?)<\/div>/g, '[QUOTE=$3;$6]$9[/QUOTE]<br><br><br>')
        .replace(/<pre(.*?)>(.*?)<\/pre>/gmi, "[code]$2[/code]")
        .replace(/<br>/g, '$.^')
        .replace(/\n/g, '')
        .replace(/<a href="member.php\?u=(.*?)" style="text-decoration: none;color:#0e5ba7;">(.*?)<\/a>/, "[taguser]$1[/taguser]")
        .replace(/<h[1-7](.*?)>((.|\n|<br>)*?)<\/h[1-7]>/, "<br>[h]$2[/h]<br>")
        .replace(/<iframe(.*?)id="(.*?)_(.*?)"(.*?)>((.|\n|<br>)*?)<\/iframe>/g, "https://www.youtube.com/watch?v=$2")
        .replace(/<source src="https:\/\/voice2.fcdn.co.il\/sound2\/(.*?).mp3" type="audio\/mpeg">/gm, '[voice2]$1[/voice2]')
        .replace(/  Your browser does not support the audio element./g, '')
        .replace(/<div class="bbcode_code" style="height:36px;"><code><code>((.|\n|<br>)*?)<\/code><\/code><\/div>/gm, '$1'.replace(/<span style="color: #(.*?)">/, '').replace("</span>", "").replace('&nbsp;', " "))
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
        .replace(/^<br>|<br>$/g, '');
};
function delay() {
    return new Promise(resolve => setTimeout(resolve, 2000));
}
export default class Fxios {
    constructor() {
        this.info = {
            securitytoken: "",
            userId: 0,
            send: ""
        };
        this.instance = axios.create({
            withCredentials: true
        });
        axiosCookieJarSupport(this.instance);
        this.instance.defaults.jar = new tough();
        axiosProxyTunnel(this.instance);
    }
    async login(username, password) {
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
        });
        await this.instance.post("https://www.fxp.co.il/login.php?do=login", data, options);
        var res = await this.instance.get("https://www.fxp.co.il");
        const securitytoken = /var SECURITYTOKEN = "(.*?)";/.exec(res.data);
        const send = /send = '(.*?)'/g.exec(res.data);
        const userId = /var LOGGEDIN = (.*?) >/.exec(res.data);
        if (send == null || securitytoken == null || userId == null) {
            console.error("error occured while logging in, please make sure you entered correct username and password");
            return;
        }
        this.info.securitytoken = securitytoken[1];
        this.info.send = send[1];
        this.info.userId = Number(userId[1]);
        this.socket = io.connect('https://socket5.fxp.co.il');
        this.socket.on('connect', () => {
            var send = this.info.send;
            this.socket.send(send);
        });
        console.log("logged in");
    }
    addmember(username, password) {
        const data = querystring.stringify({
            username: username,
            password: password,
            passwordconfirm: "",
            email: username + "e@gmail.com",
            emailconfirm: "",
            agree: "1",
            s: "",
            securitytoken: "guest",
            do: 'addmember',
            url: "https://www.fxp.co.il/",
            password_md5: "",
            passwordconfirm_md5: "",
            day: "",
            month: "",
            year: ""
        });
        return axios.post("https://www.fxp.co.il/register.php?do=addmember", data)
            .then((res) => {
            console.log(`statusCode: ${res.status}`);
            console.log("the user " + username + " has created sueccesfully");
        })
            .catch((error) => {
            console.error(error);
        });
    }
    logout() {
        var securitytoken = this.info.securitytoken;
        return this.instance.get("https://www.fxp.co.il/login.php?do=logout&logouthash=" + securitytoken)
            .then((respnse) => {
            console.log('logged out');
        })
            .catch((err) => {
            console.log(err);
        });
    }
    makelike(commentId) {
        var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
            do: 'add_like',
            postid: commentId + "",
            securitytoken: securitytoken,
        });
        return this.instance.post("https://www.fxp.co.il/ajax.php", data, options)
            .then((respnse) => {
            console.log("like added to message " + commentId);
        })
            .catch((error) => {
            console.log(error);
        });
    }
    sendMessage(showtherdId, message) {
        var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
            securitytoken: securitytoken,
            ajax: "1",
            message_backup: (message + "").replace(/\n/g,"<br>"),
            message: (message + "").replace(/\n/g,"<br>"),
            wysiwyg: "1",
            signature: "1",
            fromquickreply: "1",
            s: "",
            do: "postreply",
            t: showtherdId + "",
            specifiedpost: "0",
            parseurl: "1",
            loggedinuser: this.info.userId + "",
            poststarttime: "1593688317"
        });
        return this.instance.post("https://www.fxp.co.il/newreply.php?do=postreply&t=" + showtherdId, data, options);
    }
    newthread(forumId, tag, title, content) {
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
            loggedinuser: this.info.userId + "",
            sbutton: "צור אשכול חדש",
            signature: "1",
            parseurl: "1"
        });
        return this.instance.post("https://www.fxp.co.il/newthread.php?do=postthread&f=" + forumId, data, options)
            .then(() => {
            console.log("new showthread has created");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    deleteMessage(commentId) {
        var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
            s: "",
            securitytoken: securitytoken,
            p: commentId + "",
            url: "https://www.fxp.co.il/showthread.php?p=" + commentId,
            do: "deletepost"
        });
        return this.instance.post("https://www.fxp.co.il/editpost.php?do=deletepost&p=" + commentId, data, options)
            .then(() => {
            console.log("the message " + commentId + " has deleted");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    editMessage(commentId, content) {
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
        });
        return this.instance.post("https://www.fxp.co.il/editpost.php?do=updatepost&postid=" + commentId, data, options)
            .then(() => {
            console.log("the massage content is now " + content);
        })
            .catch((err) => {
            console.log(err);
        });
    }
    sendNewPM(user, subject, message) {
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
        });
        return this.instance.post("https://www.fxp.co.il/private_chat.php", data, options)
            .then(() => {
            console.log('new private message has been sent and it is "' + message + '" now');
        })
            .catch((err) => {
            console.log(err);
        });
    }
    sendPM(pmId, user, message) {
        var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
            message: message + "",
            fromquickreply: "1",
            securitytoken: securitytoken,
            do: "insertpm",
            pmid: pmId + "",
            loggedinuser: this.info.userId + "",
            parseurl: "1",
            signature: "1",
            title: "תגובה להודעה:",
            recipients: user,
            forward: "0",
            savecopy: "1",
            fastchatpm: "1",
            wysiwyg: "1",
        });
        return this.instance.post("https://www.fxp.co.il/private_chat.php", data, options)
            .then(() => {
            console.log("private message has been sent to chat number " + pmId);
        })
            .catch((err) => {
            console.log(err);
        });
    }
    async getUserInfo(id) {
        const res = await axios.get("https://www.fxp.co.il/member.php?u=" + id);
        const $ = load(res.data);
        const user = {
            name: $('.member_username').text(),
            id: Number(id),
            subname: $('.usertitle').text(),
            isConnected: res.data.includes($('.member_username').text() + " לא" + " מחובר/ת") == false
        };
        return user;
    }
    async getUserInfoByName(username) {
        const res = await axios.get("https://www.fxp.co.il/member.php?username=" + encodeURI(username));
        const $ = load(res.data);
        const user = {
            name: $('.member_username').text(),
            id: Number(/(?<=u=)\d+(?=\&)/gm.exec(res.data)),
            subname: $('.usertitle').text(),
            isConnected: res.data.includes($('.member_username').text() + " לא" + " מחובר/ת") == false
        };
        return user;
    }
    async getQouteInfo(commentId) {
        const data = querystring.stringify({
            securitytoken: this.info.securitytoken,
            do: 'getquotes',
            p: commentId + ''
        });
        const response = await this.instance.post('https://www.fxp.co.il/ajax.php?do=getquotes&p=' + commentId, data, options);
        //getting the pages and saving the responses into the variables
        const username = /(?<==)[^;"]+/gm.exec(response.data)[0];
        //getting the name of the message author
        const user = await this.getUserInfoByName(username);
        //scrapping more data about the message author using the name we scrapped
        console.log(response.data);
        let Quote = /\[QUOTE=(.*?);(.*?)\]((.|\n)*?)\[\/QUOTE]/gm.exec(response.data)[0];
        //scarpping the full VB Quote code 
        const message = {
            author: () => { return user; },
            id: () => { return Number(commentId); },
            VBQuote: () => { return Quote + "<br><br><br>"; },
            content: () => { return Quote.replace("[/QUOTE]", '').replace(`[QUOTE=${user.name};${commentId}]`, '').replace(/<br><br>$/, ""); },
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
                    do: "postreply",
                    p: commentId + "",
                    specifiedpost: "0",
                    parseurl: "1",
                    loggedinuser: this.info.userId + "",
                    poststarttime: "1593688317"
                });
                return this.instance.post("https://www.fxp.co.il/newreply.php?do=postreply&p=" + commentId, data, options)
                    .then((respnse) => {
                    if (respnse.status != 200) {
                        console.log(respnse.statusText);
                    }
                    else {
                        console.log("reply has been sent");
                    }
                })
                    .catch(() => {
                    console.log("reply has been sent");
                });
            }
        };
        return message;
    }
    async getThreadInfo(thread_id){
        let res = await this.instance.get('https://www.fxp.co.il/printthread.php?t=' + thread_id+"&pp=15");
        let content = /<blockquote class="restore"(.*?)>((.|\n|<br>)*?)<\/blockquote>/g.exec(res.data)[2];   
        let lastPage = load(res.data)(".first_last").children().attr("href");
        if(lastPage)lastPage=lastPage.replace(/printthread.php\?t=(.*?)&pp=(.*?)&page=/,"");
        let thread = {
            content: htmlToBBCode(content).trim(),
            id: Number(thread_id),
            title: load(res.data)("h1").text().replace('&quot;', '"'),
            author: await this.getUserInfoByName(res.data.match(/<span class="username">(.*?)<\/span>/)[1]),
            lastPage: lastPage?Number(lastPage):1,
            messages:async(page=1,last=null,pp=15, callback)=>{
                if(last == null || last < 1) last = Math.round((thread.lastPage-1)*15/pp);
                let pages = ["pages:"]
                for (let i = page-1; i <= last; i++) {
                    let list = ["messages:"];
                    var res = await this.instance.get('https://www.fxp.co.il/showthread.php?t='+thread_id+"&page=" + (page+i) +"&pp="+pp)
                    let $ = load(res.data,{decodeEntities: false});
                    let messages = $("li.postbit.postbitim.postcontainer");
                    messages.each(async(i,message)=>{
                    let c = load(message,{decodeEntities:false});
                    let messgaeId = Number(c("li.postbit.postbitim.postcontainer").attr("id").replace(/\D/g,""));
                    let userId= Number(c('.user-picture-holder').attr('data-user-id'));
                    let username = c(".user_pic_"+userId).children().attr("alt").replace("הסמל האישי של","").trim();
                    const user = {
                        name: username,
                        id: userId,
                        subname: c('.usertitle').text().replace(/\n/g, ''),
                        isConnected: c(".inlineimg").attr("alt").includes("מחובר"),
                    };
                    const info = {
                        author: ()=> user,
                        id: ()=> messgaeId,
                        VBQuote: ()=>"function () {}",
                        content:()=> htmlToBBCode(c('#post_message_' + messgaeId).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/, ''),
                        reply: ()=>{}
                    };
                    info.VBQuote = ()=>`[QUOTE=${username};${messgaeId}]${info.content()}[/QUOTE]<br><br>`;
                    info.reply = (msg) => this.sendMessage(Number(thread_id), message.VBQuote() + msg); 
                    list.push(info);
                    if(callback)callback(info);
                    })
                    pages[i+1]=list;
                }
                return pages;
            }
        };
        return thread;
    }
    onNewMessage(callback) {
        this.socket.on('newreply', async (data) => {
            var res = await this.instance.get('https://www.fxp.co.il/showthread.php?t=' + data.thread_id + '&page=9000000');
            const $ = load(res.data.replace(/<li id="ynet-vid">((.|\n)*?)<\/li>/g,""), { decodeEntities: false });
            let id =(()=>{ 
                let match = $('.postbit').filter(function(_, node) {
                    return $(node).find('.username:contains('+data.username+')').length > 0;
                }).last().attr("id").replace("post_","");
                return match;
            })();
            let post = $('#post_'+id).html();
            const c = load(post, { decodeEntities: false });
            const user = {
                name: data.username,
                id: Number(c('.user-picture-holder').attr('data-user-id')),
                subname: c('.usertitle').text().replace(/\n/g, ''),
                isConnected: post.includes(data.username + " מחובר" || data.username + " מחוברת"),
            };
            const message = {
                author: () =>  user,
                id: () => Number(id),
                VBQuote: ()=>{},
                content: ()=> htmlToBBCode(c('#post_message_' + id).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/g, ''),
                reply: ()=>{}
            };
            message.VBQuote = ()=>`[QUOTE=${data.username};${id}]${message.content()}[/QUOTE]<br><br>`;
            message.reply = (msg) => this.sendMessage(data.thread_id, message.VBQuote() + msg);
            callback(message,data.qouted);
        });
    }
    onNewLike(callback) {
        this.socket.on('new_like', async (data) => {
            var message = await this.getQouteInfo(data.postid);
            var member = await this.getUserInfoByName(data.username);
            var obj = {
                messageLiked: message,
                memberLiked: member
            };
            callback(obj);
        });
    }
    onNewPM(callback) {
        this.socket.on('newpmonpage', async (data) => {
            if(data.send == this.info.userId) return;
            const pm = {
                content: data.message,
                author: await this.getUserInfo(data.send),
                id: Number(data.pmid),
                title: data.title,
                time: data.date + " " + data.time,
                reply: (msg) => { this.sendPM(data.pmid, data.username, msg); }
            };
            callback(pm);
        });
    }
    onNewThread(forumId, callback) {
        var socket = io.connect('https://socket5.fxp.co.il');
        socket.on('connect', async () => {
            var forum = await this.instance.get('https://www.fxp.co.il/forumdisplay.php?f=' + forumId + '&web_fast_fxp=1');
            var send = /\{"userid[^']+/gm.exec(forum.data);
            socket.send(send);
        });
        socket.on('newtread', async (data) => {
            let thread = await this.getThreadInfo(data.id);
            callback(thread);
        });
    }
    onNewMessageOnThread(thread_id, callback) {
        var socket = io.connect('https://socket5.fxp.co.il');
        socket.on('connect', async () => {
            var thread = await this.instance.get("https://www.fxp.co.il/showthread.php?t=" + thread_id);
            var send = /send = '(.*?)'/g.exec(thread.data)[1];
            console.log(send);
            socket.send(send);
        });
        socket.on('showthreadpost', async (data) => {
            const msg = await this.getQouteInfo(data.postid);
            callback(msg);
        });
    }
    async getAdminsInfo() {
        let res = await axios.get("https://www.fxp.co.il/showgroups.php");
        let $ = load(res.data, { decodeEntities: false });
        let groups = $(".blockbody");
        let htmls = [];
        let teams = [[], [], [], []];
        groups.each((i, e) => htmls.push(e));
        let i = htmls.length-1;
        for (let html of htmls) {
            let c = load(html, { decodeEntities: false });
            c("h4").children().each((i2, e2) => {
                let element = load(e2, { decodeEntities: false });
                teams[i].push({
                    id: Number(element("a").attr("href").replace(/\D/g, "")),
                    name: element("a").text(),
                    isConnected: element("a").attr("class") == "username online"
                });
            }
            );
            i--;
        }
    
        return teams;
    }
    async getTopThreads(forumId){
        let res = await axios.get("https://www.fxp.co.il/forumdisplay.php?f="+forumId)
        let $ = load(res.data);
        let ids = []
        $("#threads").children().each((i,e)=>ids.push(Number(load(e)("li").attr("id").replace(/\D/g,""))))
        return ids;
    }
}
