"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const tough_cookie_1 = require("tough-cookie");
const cheerio_1 = require("cheerio");
const axios_proxy_tunnel_1 = __importDefault(require("axios-proxy-tunnel"));
const query_string_1 = __importDefault(require("query-string"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const options = "headers[user-agent]=Mozilla%2F5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F81.0.4044.138%20Safari%2F537.36";
var htmlToBBCode = function (html) {
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
class Fxios {
    constructor() {
        this.info = {
            securitytoken: "",
            userId: 0,
            send: ""
        };
        this.instance = axios_1.default.create({
            withCredentials: true
        });
        (0, axios_cookiejar_support_1.wrapper)(this.instance);
        this.instance.defaults.jar = new tough_cookie_1.CookieJar();
        (0, axios_proxy_tunnel_1.default)(this.instance);
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = query_string_1.default.stringify({
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
            yield this.instance.post("https://www.fxp.co.il/login.php?do=login", data, options);
            var res = yield this.instance.get("https://www.fxp.co.il");
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
            console.log("logged in");
        });
    }
    addmember(username, password) {
        const data = query_string_1.default.stringify({
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
        axios_1.default.post("https://www.fxp.co.il/register.php?do=addmember", data)
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
        this.instance.get("https://www.fxp.co.il/login.php?do=logout&logouthash=" + securitytoken)
            .then((respnse) => {
            console.log('logged out');
        })
            .catch((err) => {
            console.log(err);
        });
    }
    makelike(commentId) {
        var securitytoken = this.info.securitytoken;
        const data = query_string_1.default.stringify({
            do: 'add_like',
            postid: commentId + "",
            securitytoken: securitytoken,
        });
        this.instance.post("https://www.fxp.co.il/ajax.php", data, options)
            .then((respnse) => {
            console.log("like added to message " + commentId);
        })
            .catch((error) => {
            console.log(error);
        });
    }
    sendMessage(showtherdId, message) {
        var securitytoken = this.info.securitytoken;
        const data = query_string_1.default.stringify({
            securitytoken: securitytoken,
            ajax: "1",
            message_backup: message + "",
            message: message + "",
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
        this.instance.post("https://www.fxp.co.il/newreply.php?do=postreply&t=" + showtherdId, data, options)
            .then((respnse) => {
            console.log("message has been sent");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    newthread(forumId, tag, title, content) {
        var securitytoken = this.info.securitytoken;
        const data = query_string_1.default.stringify({
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
        this.instance.post("https://www.fxp.co.il/newthread.php?do=postthread&f=" + forumId, data, options)
            .then(() => {
            console.log("new showthread has created");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    deleteMessage(commentId) {
        var securitytoken = this.info.securitytoken;
        const data = query_string_1.default.stringify({
            s: "",
            securitytoken: securitytoken,
            p: commentId + "",
            url: "https://www.fxp.co.il/showthread.php?p=" + commentId,
            do: "deletepost"
        });
        this.instance.post("https://www.fxp.co.il/editpost.php?do=deletepost&p=" + commentId, data, options)
            .then(() => {
            console.log("the message " + commentId + " has deleted");
        })
            .catch((err) => {
            console.log(err);
        });
    }
    editMessage(commentId, content) {
        var securitytoken = this.info.securitytoken;
        const data = query_string_1.default.stringify({
            securitytoken: securitytoken,
            do: "updatepost",
            ajax: "1",
            postid: commentId + "",
            poststarttime: "1593697060",
            message: content + "",
            reason: "",
            relpath: "showthread.php?p=" + commentId
        });
        this.instance.post("https://www.fxp.co.il/editpost.php?do=updatepost&postid=" + commentId, data, options)
            .then(() => {
            console.log("the massage content is now " + content);
        })
            .catch((err) => {
            console.log(err);
        });
    }
    sendNewPM(user, subject, message) {
        var securitytoken = this.info.securitytoken;
        const data = query_string_1.default.stringify({
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
        this.instance.post("https://www.fxp.co.il/private_chat.php", data, options)
            .then(() => {
            console.log('new private message has been sent and it is "' + message + '" now');
        })
            .catch((err) => {
            console.log(err);
        });
    }
    sendPM(pmId, user, message) {
        var securitytoken = this.info.securitytoken;
        const data = query_string_1.default.stringify({
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
        this.instance.post("https://www.fxp.co.il/private_chat.php", data, options)
            .then(() => {
            console.log("private message has been sent to chat number " + pmId);
        })
            .catch((err) => {
            console.log(err);
        });
    }
    getUserInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get("https://www.fxp.co.il/member.php?u=" + id);
            const $ = (0, cheerio_1.load)(res.data);
            const user = {
                name: $('.member_username').text(),
                id: Number(id),
                subname: $('.usertitle').text(),
                isConnected: res.data.includes($('.member_username').text() + " לא" + " מחובר/ת") == false
            };
            return new Promise(resolve => resolve(user))
                .catch((reject) => reject("there was an error"));
        });
    }
    getUserInfoByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get("https://www.fxp.co.il/member.php?username=" + encodeURI(username));
            const $ = (0, cheerio_1.load)(res.data);
            const user = {
                name: $('.member_username').text(),
                id: Number(/(?<=u=)\d+(?=\&)/gm.exec(res.data)),
                subname: $('.usertitle').text(),
                isConnected: res.data.includes($('.member_username').text() + " לא" + " מחובר/ת") == false
            };
            return new Promise(resolve => resolve(user))
                .catch((reject) => reject("there was an error"));
        });
    }
    getQouteInfo(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = query_string_1.default.stringify({
                securitytoken: this.info.securitytoken,
                do: 'getquotes',
                p: commentId + ''
            });
            const response = yield this.instance.post('https://www.fxp.co.il/ajax.php?do=getquotes&p=' + commentId, data, options);
            //getting the pages and saving the responses into the variables
            const username = /(?<==)[^;"]+/gm.exec(response.data)[0];
            //getting the name of the message author
            const user = yield this.getUserInfoByName(username);
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
                    const data = query_string_1.default.stringify({
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
                    this.instance.post("https://www.fxp.co.il/newreply.php?do=postreply&p=" + commentId, data, options)
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
            return new Promise(resolve => resolve(message)).catch(reject => reject("there was an error"));
        });
    }
    onNewMessage(callback) {
        var socket = (0, socket_io_client_1.default)('https://socket5.fxp.co.il');
        socket.on('connect', () => {
            var send = this.info.send;
            socket.send(send);
        });
        socket.on('newreply', (data) => __awaiter(this, void 0, void 0, function* () {
            var res = yield this.instance.get('https://www.fxp.co.il/showthread.php?t=' + data.thread_id + '&page=90000');
            const $ = (0, cheerio_1.load)(res.data, { decodeEntities: false });
            function TheId() { return $('#posts').children().last().attr('id').replace('post_', ""); }
            function post() { return $('#posts').children().last().html(); }
            const c = (0, cheerio_1.load)(post(), { decodeEntities: false });
            function VBQuote() { return `[QUOTE=${data.username};${TheId()}]${content()}[/QUOTE]<br><br>`; }
            function content() { return htmlToBBCode(c('#post_message_' + TheId()).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/g, ''); }
            const user = {
                name: data.username,
                id: Number(c('.user-picture-holder').attr('data-user-id')),
                subname: c('.usertitle').text().replace(/\n/g, ''),
                isConnected: post().includes(data.username + " מחובר" || data.username + " מחוברת"),
            };
            const message = {
                author: () => { return user; },
                id: () => { return Number(TheId()); },
                VBQuote: function () { return `[QUOTE=${data.username};${TheId()}]${content()}[/QUOTE]<br><br>`; },
                content: function () { return htmlToBBCode(c('#post_message_' + TheId()).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/g, ''); },
                reply: (msg) => { this.sendMessage(data.thread_id, VBQuote() + msg); }
            };
            callback(message);
        }));
    }
    onNewLike(callback) {
        var socket = (0, socket_io_client_1.default)('https://socket5.fxp.co.il');
        socket.on('connect', () => {
            var send = this.info.send;
            socket.send(send);
        });
        socket.on('new_like', (data) => __awaiter(this, void 0, void 0, function* () {
            var message = yield this.getQouteInfo(data.postid);
            var member = yield this.getUserInfoByName(data.username);
            var obj = {
                messageLiked: message,
                memberLiked: member
            };
            callback(obj);
        }));
    }
    onNewPM(callback) {
        var socket = (0, socket_io_client_1.default)('https://socket5.fxp.co.il');
        socket.on('connect', () => {
            var send = this.info.send;
            socket.send(send);
        });
        socket.on('newpmonpage', (data) => __awaiter(this, void 0, void 0, function* () {
            const pm = {
                content: data.message,
                author: yield this.getUserInfo(data.send),
                id: Number(data.pmid),
                title: data.title,
                time: data.date + " " + data.time,
                reply: (msg) => { this.sendPM(data.pmid, data.username, msg); }
            };
            callback(pm);
        }));
    }
    onNewThread(forumId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            var socket = (0, socket_io_client_1.default)('https://socket5.fxp.co.il');
            socket.on('connect', () => __awaiter(this, void 0, void 0, function* () {
                var forum = yield this.instance.get('https://www.fxp.co.il/forumdisplay.php?f=' + forumId + '&web_fast_fxp=1');
                var send = /\{"userid[^']+/gm.exec(forum.data);
                socket.send(send);
            }));
            socket.on('newtread', (data) => __awaiter(this, void 0, void 0, function* () {
                var res = yield this.instance.get('https://www.fxp.co.il/printthread.php?t=' + data.id);
                var content = /<blockquote class="restore">(.*?)<\/blockquote>/g.exec(res.data)[1];
                var thread = {
                    content: htmlToBBCode(content).trim(),
                    id: Number(data.id),
                    title: data.title.replace('&quot;', '"'),
                    author: yield this.getUserInfo(data.poster),
                    time: data.time,
                    tag: data.prefix
                };
                callback(thread);
            }));
        });
    }
    onNewMessageOnThread(thread_id, callback) {
        var socket = (0, socket_io_client_1.default)('https://socket5.fxp.co.il');
        socket.on('connect', () => __awaiter(this, void 0, void 0, function* () {
            var thread = yield this.instance.get("https://www.fxp.co.il/showthread.php?t=" + thread_id);
            var send = /send = '(.*?)'/g.exec(thread.data)[1];
            console.log(send);
            socket.send(send);
        }));
        socket.on('showthreadpost', (data) => __awaiter(this, void 0, void 0, function* () {
            const msg = yield this.getQouteInfo(data.postid);
            callback(msg);
        }));
    }
}
exports.default = Fxios;
