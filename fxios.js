import axios from 'axios';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { CookieJar as tough } from 'tough-cookie';
import { html, load } from 'cheerio';
import Gmailnator from "./modules/validateUser.js";
import querystring from "query-string";
import crypto from "crypto";
import io from 'socket.io-client';
import { HttpCookieAgent, HttpsCookieAgent, createCookieAgent } from "http-cookie-agent/http"
import { HttpsProxyAgent } from "https-proxy-agent";
export const options = "headers[user-agent]=Mozilla%2F5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F81.0.4044.138%20Safari%2F537.36";
const htmlToBBCode = function (html) {
    return html
        .replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img]$2[/img]")
        .replace(/&nbsp;/g, ' ')
        .replace(/<div class="bbcode_container">((.|\n|<br>)*?)<strong>(.*?)<\/strong>((.|\n|<br>)*?)p=(.*?)#((.|\n|<br>)*?)<div class="message">((.|\n|<br>)*?)<\/div>/g, '[QUOTE=$3;$6]$9[/QUOTE]<br><br><br>')
        .replace(/<pre(.*?)>(.*?)<\/pre>/gmi, "[code]$2[/code]")
        .replace(/<br>/g, '$.^')
        .replace(/\n/g, '')
        .replace(/<a href="member.php\?u=(.*?)" style="text-decoration: none;color:#0e5ba7;">(.*?)<\/a>/, "[taguser]$1[/taguser]")
        .replace(/<h[1-7](.*?)>((.|\n|<br>)*?)<\/h[1-7]>/, "<br>[h]$2[/h]<br>")
        .replace(/<iframe.*src="\/\/www.youtube.com\/embed\/(.*)\?.*<\/iframe>/g, ' https://www.youtube.com/watch?v=$1 ')
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
        .replace(/<a(.*?)href="(.*?)"(.*?)>((.|\n|<br>)*?)<\/a>/gi, "[url=$2]$4[/url]")
        .replace(/<head>(.*?)<\/head>/gmi, "")
        .replace(/<script(.*?)>(.*?)<\/script>/gmi, "")
        .replace(/<style(.*?)>(.*?)<\/style>/gmi, "")
        .replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "")
        .replace(/\r\r/gi, "")
        .replace(/\[url=\//gi, "[url=")
        .replace(/\$\.\^/g, '<br>')
        .replace(/^<br>|<br>$/g, '');
};
const parseFxpDate = (string)=>{
    string=string.replace(String.fromCharCode(160)," ");
    let date = string, time;
    if(string.includes(" ")){
        [date,time] = string.split(" ");
        if(string.includes("היום") || string.includes("אתמול")) {
            const [hours, minutes] = time.split(':').map(Number);
            const day = new Date();
            if(date.includes("אתמול"))day.setDate(day.getDate()-1);
            day.setHours(hours, minutes, 0, 0);
            return day;
        }
    }
    let [day, month, year] = date.split("-");
    console.log(`${month}-${day}-${year}${time?" "+time:""}`)
    date=new Date(`${month}-${day}-${year}${time?" "+time:""}`);
    return date;
}
async function getMore(html) {
    let $ = load(html);
    let friendss = $(".friends a.username");
    let friends = [];
    friendss.map((i, e) => {
        let b = load(e)("a");
        friends.push({ name: b.attr("title"), id: Number(b.attr('href').replace(/\D/g, "")) });
    })

    const table = $("#view-aboutme > div:nth-child(2)");
    let values = table.find("dd");
    let fields = table.find("dt");

    let gen = {}
    for (let i = 0; i < fields.length; i++) {
        gen[translate($(fields[i]).text().trim())] = load(values[i]).text().trim()
    }

    let stats = {};
    values = $("dl.stats.blockrow dd");
    fields = $("dl.stats.blockrow dt");
    for (let i = 0; i < fields.length; i++) {
        let value = load(values[i]).text().trim().replace(/,/g, "");
        let field = translate($(fields[i]).text().trim());
        if (field.includes("Date")) {
            let date = parseFxpDate(value);
            stats[field] = date;
        }
        else stats[field] = isNaN(value) ? value : Number(value);
    }

    let signature = $(".signature_holder").html();
    signature = signature && htmlToBBCode(signature);
    return { gen, friends, stats, signature };
}
function scrappUserInfo(message, instance) {
    let c = load(message, { decodeEntities: false });
    let id = Number(c('.user-picture-holder').attr('data-user-id'));
    let name = c(".user_pic_" + id).children().attr("alt").replace("הסמל האישי של", "").trim();
    let subname = c('.usertitle').text().replace(/\n/g, '');
    let isConnected = c(".inlineimg").attr("alt").includes("מחובר")
    let more = async () => {
        let html = (await axios.get("https://www.fxp.co.il/member.php?u=" + id)).data;
        return getMore(html);
    }
    let rank = c(".username_container strong span").attr("class");

    return { id, name, subname, isConnected, rank, more };
}
function translate(fields) {
    fields = fields.replace(":", "");
    switch (fields) {
        case "שם פרטי": return "personalName"
        case "ביוגרפיה": return "biography"
        case "תחומי עניין": return "hobbies"
        case "מקצוע": return "profession"
        case "מין": return "sex"
        case "סטאטוס זוגי": return "relationshipStatus"
        case "מתעניין/ת ב": return "attractedTo"
        case "איזור מגורים": return "livingArea"
        case "עיר מגורים": return "city"
        case "סך הכל הודעות": return 'totalMessages';
        case "מס' הודעות ביום": return 'messagesPerDay';
        case "סך הכל לייקים": return 'totalLikes';
        case "סך הכל עוקבים": return 'totalFollowers';
        case "סך הכל הודעות חברים": return 'totalFriendMessages';
        case "הודעת חברים אחרונה": return 'lastFriendMessageDate';
        case "פעילות אחרונה": return 'lastActivityDate';
        case "תאריך הצטרפות": return 'joinDate';
        case "תאריך לידה": return "birthDate";
        case "עמוד זה": return "contact";
    }
    return fields;
}
function scrappMessageInfo(post,bot,id) {
    let c = load(post, { decodeEntities: false });
    const user = scrappUserInfo(post, bot.instance);
    const message = {
        author: () => user,
        id: () => Number(id),
        VBQuote: () => { },
        content: () => htmlToBBCode(c('#post_message_' + id).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/g, ''),
        reply: () => { },
        time: () => {
            let time = c(".date").text().trim();
            time=time.replace("היום ").replace("אתמול ");
            return parseFxpDate(time);
        }
    };
    message.VBQuote = () => `[QUOTE=${user.name};${id}]${message.content()}[/QUOTE]<br><br>`;
    message.reply = (msg) => {
        var securitytoken = bot.info.securitytoken;
        const data = querystring.stringify({
            securitytoken: securitytoken,
            ajax: "1",
            message_backup: (message.VBQuote()+ msg).replace(/\n/g, "<br>"),
            message: (message.VBQuote()+ msg).replace(/\n/g, "<br>"),
            wysiwyg: "1",
            signature: "1",
            fromquickreply: "1",
            s: "",
            do: "postreply",
            p: id,
            specifiedpost: "0",
            parseurl: "1",
            loggedinuser: bot.info.userId + "",
            poststarttime: "1593688317"
        });
        return bot.instance.post("https://www.fxp.co.il/newreply.php?do=postreply&p=" + id, data, options);
    }
    return message;
}

export default class Fxios {
    constructor(proxies) {
        const HttpsCookieProxyAgent = createCookieAgent(HttpsProxyAgent);
        let [username, password, host, port] = proxies && proxies[0] ? proxies[0].split(":") : [null, null, null, null];
        //console.log({ username, password, host, port });
        this.gmailClient = null;
        this.proxyManager = {
            proxies,
            nextProxy: () => {
                let proxies = this.proxyManager.proxies;
                if (!proxies || proxies.length == 0) return;
                proxies.push(proxies.shift());
                this.proxyManager.proxies = proxies;
                return proxies[0];
            }
        };
        this.info = {
            securitytoken: "",
            userId: 0,
            send: ""
        };
        let jar = new tough();
        this.instance = axios.create({
            withCredentials: true,
            validateStatus: () => true,
            httpsAgent: host ? new HttpsCookieProxyAgent({
                rejectUnauthorized: false,
                protocol: "http",
                hostname: host,
                username: username,
                password: password,
                port: Number(port),
                cookies: {
                    jar
                }
            }) : undefined,
            jar: host?undefined:jar
        });
        console.log(this.instance.httpsAgent)
        axiosCookieJarSupport(this.instance);
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
        let post = await this.instance.post("https://www.fxp.co.il/login.php?do=login", data, options);
        var res = await this.instance.get("https://www.fxp.co.il");
        const securitytoken = /var SECURITYTOKEN = "(.*?)";/.exec(res.data);
        const send = /send = '(.*?)'/g.exec(res.data);
        const userId = /var LOGGEDIN = (.*?) >/.exec(res.data);
        if (send == null || securitytoken == null || userId == null) {
            console.log("error occured while logging in to " + username + " with password" + password + ", please make sure you entered correct username and password");
            console.log(post.data);
            return post;
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
        return post;
    }
    async addmember(username, password, email) {
        let md5 = crypto.createHash('md5').update(password).digest('hex');
        if (!this.gmailClient) {
            this.gmailClient = new Gmailnator();
            await this.gmailClient.init();
        }
        let gmail = email || await this.gmailClient.generateGmail();
        const data = querystring.stringify({
            username: username,
            password: password,
            passwordconfirm: password,
            email: gmail,
            emailconfirm: gmail,
            agree: "1",
            s: "",
            securitytoken: "guest",
            do: 'addmember',
            url: "https://www.fxp.co.il/login.php?do=login",
            password_md5: md5,
            passwordconfirm_md5: md5,
            day: "",
            month: "",
            year: ""
        });
        return axios.post("https://www.fxp.co.il/register.php?do=addmember", data, {
            httpsAgent: this.proxyManager.proxies && new HttpsProxyAgent("http://" + this.proxyManager.proxies[0])
        })
            .then(async (res) => {
                if (!res.data.includes("נשלחה הודעה בנוגע לפרטי החשבון שלך לכתובת")) {
                    console.log("couldnt create " + username + "! make sure your username is in English!");
                    this.proxyManager.nextProxy()
                    return { created: false, validated: false, data: res.data };
                }
                console.log("the user " + username + " has created sueccesfully");
                let validated = false;
                if (gmail != email) validated = await this.gmailClient.validateUser(gmail, username);
                validated || this.proxyManager.nextProxy();
                return { created: true, validated: validated, data: res.data };
            })
            .catch((error) => {
                console.error(error);
                return { created: false, validated: false, data: error };
            });
    }
    async addmembers(usernames, password, safeMode) {
        if (!this.gmailClient) {
            this.gmailClient = new Gmailnator();
            await this.gmailClient.init();
        }
        let hasProxies = this.proxyManager.proxies && this.proxyManager.proxies.length > 0;
        if (!hasProxies) {
            this.proxyManager.proxies = [false];
            console.log("notice: you havent provided any proxy adress, which means you are completely exposed to fxp's manegment. also, this will take more time");
        }
        else if (this.proxyManager.proxies.length < usernames.length) console.log("notice: you dont have enough proxies. this may result some issues");
        let gmails = await this.gmailClient.generateGmails(usernames.length);
        let task = (i) => new Promise(async (resolve) => {
            safeMode && await new Promise(resolve => setTimeout(resolve, 1500 * i));
            let stack = { username: usernames[i], gmail: gmails[i], created: false, validated: false };
            this.addmember(stack.username, password, stack.gmail).then((status) => {
                if (!status.created) {
                    resolve(stack);
                    return;
                }
                stack.created = true
                this.gmailClient.validateUser(gmails[i], usernames[i]).then(async (validated) => {
                    stack.validated = validated;
                    resolve(stack);
                }).catch(() => {
                    resolve(stack);
                })
            }).catch(() => resolve(stack))
        });
        let tasks = new Array(usernames.length).fill(null).map((e, i) => task(i));
        let result = await Promise.all(tasks);
        let unValidated = result.filter((stack, i) => {
            stack.index = i;
            stack.created && !stack.validated
        });
        console.log(unValidated.length == 0 ? "all of the created users are validated!" : unValidated.length + " gmails were unavailable...");
        return result;
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
    }
    sendMessage(showtherdId, message) {
        var securitytoken = this.info.securitytoken;
        const data = querystring.stringify({
            securitytoken: securitytoken,
            ajax: "1",
            message_backup: (message + "").replace(/\n/g, "<br>"),
            message: (message + "").replace(/\n/g, "<br>"),
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
            title: "תגובה להודעה",
            recipients: user,
            forward: "0",
            savecopy: "1",
            fastchatpm: "1",
            wysiwyg: "1",
        });
        return this.instance.post("https://www.fxp.co.il/private_chat.php", data, options)
    }
    async getUserInfo(id) {
        const res = await axios.get("https://www.fxp.co.il/member.php?u=" + id);
        const $ = load(res.data);
        const user = {
            name: $('.member_username').text().trim(),
            id: Number(id),
            subname: $('.usertitle').text(),
            isConnected: res.data.includes($('.member_username').text() + " לא" + " מחובר/ת") == false,
            rank: $(".member_username span").attr("class"),
            getMore: () => getMore(res.data)
        };
        return user;
    }
    async getUserInfoByName(username) {
        const res = await axios.get("https://www.fxp.co.il/member.php?username=" + encodeURI(username));
        const $ = load(res.data);
        const user = {
            name: username,
            id: Number(/(?<=u=)\d+(?=\&)/gm.exec(res.data)),
            subname: $('.usertitle').text(),
            isConnected: res.data.includes(username + " לא" + " מחובר/ת") == false,
            rank: $(".member_username span").attr("class"),
            getMore: () => getMore(res.data)
        };
        return user;
    }
    async getQouteInfo(commentId) {
        let res = await this.instance.get("https://www.fxp.co.il/showthread.php?&p="+commentId);
        let $ = load(res.data,{decodeEntities:false});
        let post = $('#post_' + commentId).html();
        return scrappMessageInfo(post,this,commentId);
    }
    async getThreadInfo(thread_id) {
        let res = await this.instance.get('https://www.fxp.co.il/showthread.php?t=' + thread_id + "&pp=15");
        let l = load(res.data);
        let lastPage = l(".first_last").children().attr("href");
        let content = l(".restore").first().text();
        if (lastPage) lastPage = lastPage.match(/showthread.php\?t=(.*?)&page=(.*?)&pp=/)[2];
        let thread = {
            content: htmlToBBCode(content).trim(),
            id: Number(thread_id),
            title: l("h1").text().replace('&quot;', '"'),
            author: scrappUserInfo(l.html(),this.instance),
            lastPage: lastPage ? Number(lastPage) : 1,
            messages: async (page = 1, last = null, pp = 15, callback) => {
                if (last == null || last < 1) last = Math.round((thread.lastPage - 1) * 15 / pp);
                let pages = ["pages"]
                for (let i = page - 1; i <= last; i++) {
                    let list = ["messages"];
                    var res = await this.instance.get('https://www.fxp.co.il/showthread.php?t=' + thread_id + "&page=" + (page + i) + "&pp=" + pp)
                    let $ = load(res.data, { decodeEntities: false });
                    let messages = $("li.postbit.postbitim.postcontainer");
                    messages.each(async (i, message) => {
                        let id = $(message).attr("id").replace(/\D/g,"");
                        let info = scrappMessageInfo($(message).html(),this,id); 
                        list.push(info);
                        if(callback)callback(info);
                    })
                    pages[i + 1] = list;
                }
                return pages;
            }
        };
        return thread;
    }
    onNewMessage(callback) {
        this.socket.on('newreply', async (data) => {
            var res = await this.instance.get('https://www.fxp.co.il/showthread.php?t=' + data.thread_id + '&page=9000000');
            const $ = load(res.data.replace(/<li id="ynet-vid">((.|\n)*?)<\/li>/g, ""), { decodeEntities: false });
            let id = (() => {
                let match = $('.postbit').filter(function (_, node) {
                    return $(node).find('.username:contains(' + data.username + ')').length > 0;
                }).last().attr("id").replace("post_", "");
                return match;
            })();
            let post = $('#post_' + id).html();
            let message = scrappMessageInfo(post,this,id);
            callback(message, data.qouted);
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
            if (data.send == this.info.userId) return;
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
        const res = await axios.get("https://www.fxp.co.il/showgroups.php");
        const regex = /<a href="member\.php\?u=(\d+)" class="username (\w+)".*><span class="usermarkup (\w+)">(.*)<\/span>/g;
        let admins = [];
        let mathces = res.data.matchAll(regex)
        for (const match of mathces) {
            admins.push({
                id: Number(match[1]),
                isConnected: match[2] == "online",
                rank: match[3],
                name: match[4].replace('<img src="//static.fcdn.co.il/images3/sp.gif" alt />', "").trim()
            })
        }
        return admins;
    }
    async getTopThreads(forumId) {
        const regex = /id="thread_title_(\d+)"/g;
        const response = await axios.get('https://www.fxp.co.il/forumdisplay.php?f=' + forumId + '&web_fast_fxp=1');
        const data = await response.data;
        const values = [...data.matchAll(regex)];
        return values.map(value => parseInt(value.at(1)));
    }
    async uploadAudio(audio, duration, sox) {
        let res = await this.instance.post("https://www.fxp.co.il/ajax.php", querystring.stringify({
            do: "insert_voice_data",
            thread_voice: 0,
            duration: duration,
            sox: sox,
            f_id: 0,
            securitytoken: this.info.securitytoken
        }), options)

        let data = res.data;
        let link = await this.instance.post("https://voice.fcdn.co.il/sound", querystring.stringify({
            function: "insertaudio",
            data: audio,
            p: 0,
            id: data.en_id,
            vid: data.voice_id,
            vid2: data.en_int_id,
            u_id: this.info.userId,
            to: data.to,
            f_id: 0
        }), options)
        return link.data;
    }
}