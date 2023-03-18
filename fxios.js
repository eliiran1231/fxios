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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fxios = void 0;
var axios = require('axios').default;
var axiosCookieJarSupport = require('axios-cookiejar-support').wrapper;
var tough = require('tough-cookie');
var md5 = require('md5');
var querystring = require('querystring');
var io = require('socket.io-client');
var cheerio = require('cheerio');
var axiosProxyTunnel = require('axios-proxy-tunnel');
var options = querystring.stringify({
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
    },
});
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
        .replace(/<div class="bbcode_code" style="height:36px;"><code><code>((.|\n|<br>)*?)<\/code><\/code><\/div>/gm[0], '$1'.replace(/<span style="color: #(.*?)">/, '').replace("</span>", "").replace('&nbsp;', " "))
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
var Fxios = /** @class */ (function () {
    function Fxios() {
        this.info = {
            securitytoken: "",
            userId: 0,
            send: ""
        };
        this.instance = axios.create({
            withCredentials: true
        });
        axiosCookieJarSupport(this.instance);
        this.instance.defaults.jar = new tough.CookieJar();
        axiosProxyTunnel(this.instance);
    }
    Fxios.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var data, res, securitytoken, send, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = querystring.stringify({
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
                        return [4 /*yield*/, this.instance.post("https://www.fxp.co.il/login.php?do=login", data, options)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.instance.get("https://www.fxp.co.il")];
                    case 2:
                        res = _a.sent();
                        securitytoken = /var SECURITYTOKEN = "(.*?)";/.exec(res.data);
                        send = /send = '(.*?)'/g.exec(res.data);
                        userId = /var LOGGEDIN = (.*?) >/.exec(res.data);
                        if (send == null || securitytoken == null || userId == null) {
                            console.error("error occured while logging in, please make sure you entered correct username and password");
                            return [2 /*return*/];
                        }
                        this.info.securitytoken = securitytoken[1];
                        this.info.send = send[1];
                        this.info.userId = Number(userId[1]);
                        console.log("logged in");
                        return [2 /*return*/];
                }
            });
        });
    };
    Fxios.prototype.addmember = function (username, password) {
        var data = querystring.stringify({
            username: username,
            password: "",
            passwordconfirm: "",
            email: username + "e@gmail.com",
            emailconfirm: "",
            agree: "1",
            s: "",
            securitytoken: "guest",
            do: 'addmember',
            url: "https://www.fxp.co.il/",
            password_md5: md5(password),
            passwordconfirm_md5: md5(password),
            day: "",
            month: "",
            year: ""
        });
        axios.post("https://www.fxp.co.il/register.php?do=addmember", data, options)
            .then(function (res) {
            console.log("statusCode: ".concat(res.status));
            console.log("the user " + username + " has created sueccesfully");
        })
            .catch(function (error) {
            console.error(error);
        });
    };
    Fxios.prototype.logout = function () {
        var securitytoken = this.info.securitytoken;
        this.instance.get("https://www.fxp.co.il/login.php?do=logout&logouthash=" + securitytoken)
            .then(function (respnse) {
            console.log('logged out');
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    Fxios.prototype.makelike = function (commentId) {
        var securitytoken = this.info.securitytoken;
        var data = querystring.stringify({
            do: 'add_like',
            postid: commentId + "",
            securitytoken: securitytoken,
        });
        this.instance.post("https://www.fxp.co.il/ajax.php", data, options)
            .then(function (respnse) {
            console.log("like added to message " + commentId);
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    Fxios.prototype.sendMessage = function (showtherdId, message) {
        var securitytoken = this.info.securitytoken;
        var data = querystring.stringify({
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
            .then(function (respnse) {
            console.log("message has been sent");
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    Fxios.prototype.newthread = function (forumId, tag, title, content) {
        var securitytoken = this.info.securitytoken;
        var data = querystring.stringify({
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
            .then(function (respnse) {
            console.log("new showthread has created");
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    Fxios.prototype.deleteMessage = function (commentId) {
        var securitytoken = this.info.securitytoken;
        var data = querystring.stringify({
            s: "",
            securitytoken: securitytoken,
            p: commentId + "",
            url: "https://www.fxp.co.il/showthread.php?p=" + commentId,
            do: "deletepost"
        });
        this.instance.post("https://www.fxp.co.il/editpost.php?do=deletepost&p=" + commentId, data, options)
            .then(function (respnse) {
            console.log("the message " + commentId + " has deleted");
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    Fxios.prototype.editMessage = function (commentId, content) {
        var securitytoken = this.info.securitytoken;
        var data = querystring.stringify({
            securitytoken: securitytoken,
            do: "updatepost",
            ajax: "1",
            postid: commentId + "",
            poststarttime: "1593697060",
            message: content + "",
            reason: "",
            relpath: "showthread.php?p=" + commentId
        });
        var options = querystring.stringify({
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
            }
        });
        this.instance.post("https://www.fxp.co.il/editpost.php?do=updatepost&postid=" + commentId, data, options)
            .then(function (respnse) {
            console.log("the massage content is now " + content);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    Fxios.prototype.sendNewPM = function (user, subject, message) {
        var securitytoken = this.info.securitytoken;
        var data = querystring.stringify({
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
            .then(function (respnse) {
            console.log('new private message has been sent and it is "' + message + '" now');
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    Fxios.prototype.sendPM = function (pmId, user, message) {
        var securitytoken = this.info.securitytoken;
        var data = querystring.stringify({
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
            .then(function (respnse) {
            console.log("private message has been sent to chat number " + pmId);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    Fxios.prototype.getUserInfo = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, $, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("https://www.fxp.co.il/member.php?u=" + id)];
                    case 1:
                        res = _a.sent();
                        $ = cheerio.load(res.data);
                        user = {
                            name: $('.member_username').text(),
                            id: Number(id),
                            subname: $('.usertitle').text(),
                            isConnected: res.data.includes($('.member_username').text() + " לא" + " מחובר/ת") == false
                        };
                        return [2 /*return*/, new Promise(function (resolve) { return resolve(user); })
                                .catch(function (reject) { return reject("there was an error"); })];
                }
            });
        });
    };
    Fxios.prototype.getUserInfoByName = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var res, $, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios.get("https://www.fxp.co.il/member.php?username=" + encodeURI(username))];
                    case 1:
                        res = _a.sent();
                        $ = cheerio.load(res.data);
                        user = {
                            name: $('.member_username').text(),
                            id: Number(/(?<=u=)\d+(?=\&)/gm.exec(res.data)),
                            subname: $('.usertitle').text(),
                            isConnected: res.data.includes($('.member_username').text() + " לא" + " מחובר/ת") == false
                        };
                        return [2 /*return*/, new Promise(function (resolve) { return resolve(user); })
                                .catch(function (reject) { return reject("there was an error"); })];
                }
            });
        });
    };
    Fxios.prototype.getQouteInfo = function (commentId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, username, user, Quote, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = querystring.stringify({
                            securitytoken: this.info.securitytoken,
                            do: 'getquotes',
                            p: commentId + ''
                        });
                        return [4 /*yield*/, this.instance.post('https://www.fxp.co.il/ajax.php?do=getquotes&p=' + commentId, data, options)
                            //getting the pages and saving the responses into the variables
                        ];
                    case 1:
                        response = _a.sent();
                        username = /(?<==)[^;"]+/gm.exec(response.data)[0];
                        return [4 /*yield*/, this.getUserInfoByName(username)];
                    case 2:
                        user = _a.sent();
                        //scrapping more data about the message author using the name we scrapped
                        console.log(response.data);
                        Quote = /\[QUOTE=(.*?);(.*?)\]((.|\n)*?)\[\/QUOTE]/gm.exec(response.data)[0];
                        message = {
                            author: function () { return user; },
                            id: function () { return Number(commentId); },
                            VBQuote: function () { return Quote + "<br><br><br>"; },
                            content: function () { return Quote.replace("[/QUOTE]", '').replace("[QUOTE=".concat(user.name, ";").concat(commentId, "]"), '').replace(/<br><br>$/, ""); },
                            reply: function (msg) {
                                var securitytoken = _this.info.securitytoken;
                                var data = querystring.stringify({
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
                                    loggedinuser: _this.info.userId + "",
                                    poststarttime: "1593688317"
                                });
                                _this.instance.post("https://www.fxp.co.il/newreply.php?do=postreply&p=" + commentId, data, options)
                                    .then(function (respnse) {
                                    if (respnse.status != 200) {
                                        console.log(respnse.statusText);
                                    }
                                    else {
                                        console.log("reply has been sent");
                                    }
                                })
                                    .catch(function (err) {
                                    console.log("reply has been sent");
                                });
                            }
                        };
                        return [2 /*return*/, new Promise(function (resolve) { return resolve(message); }).catch(function (reject) { return reject("there was an error"); })];
                }
            });
        });
    };
    Fxios.prototype.onNewMessage = function (callback) {
        var _this = this;
        var socket = io.connect('https://socket5.fxp.co.il');
        socket.on('connect', function () {
            var send = _this.info.send;
            socket.send(send);
        });
        socket.on('newreply', function (data) { return __awaiter(_this, void 0, void 0, function () {
            function TheId() { return $('#posts').children().last().attr('id').replace('post_', ""); }
            function post() { return $('#posts').children().last().html(); }
            function VBQuote() { return "[QUOTE=".concat(data.username, ";").concat(TheId(), "]").concat(content(), "[/QUOTE]<br><br>"); }
            function content() { return htmlToBBCode(c('#post_message_' + TheId()).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/g, ''); }
            var res, $, c, user, message;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.instance.get('https://www.fxp.co.il/showthread.php?t=' + data.thread_id + '&page=90000')];
                    case 1:
                        res = _a.sent();
                        $ = cheerio.load(res.data, { decodeEntities: false });
                        c = cheerio.load(post(), { decodeEntities: false });
                        user = {
                            name: data.username,
                            id: Number(c('.user-picture-holder').attr('data-user-id')),
                            subname: c('.usertitle').text().replace(/\n/g, ''),
                            isConnected: post().includes(data.username + " מחובר" || data.username + " מחוברת"),
                        };
                        message = {
                            author: function () { return user; },
                            id: function () { return Number(TheId()); },
                            VBQuote: function () { return "[QUOTE=".concat(data.username, ";").concat(TheId(), "]").concat(content(), "[/QUOTE]<br><br>"); },
                            content: function () { return htmlToBBCode(c('#post_message_' + TheId()).html()).replace(/\[QUOTE=(.*?)]((.|\n)*?)\[\/QUOTE]/, '').replace(/^<br><br><br>/g, ''); },
                            reply: function (msg) { _this.sendMessage(data.thread_id, VBQuote() + msg); }
                        };
                        callback(message);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Fxios.prototype.onNewLike = function (callback) {
        var _this = this;
        var socket = io.connect('https://socket5.fxp.co.il');
        socket.on('connect', function () {
            var send = _this.info.send;
            socket.send(send);
        });
        socket.on('new_like', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var message, member, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getQouteInfo(data.postid)];
                    case 1:
                        message = _a.sent();
                        return [4 /*yield*/, this.getUserInfoByName(data.username)];
                    case 2:
                        member = _a.sent();
                        obj = {
                            messageLiked: message,
                            memberLiked: member
                        };
                        callback(obj);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Fxios.prototype.onNewPM = function (callback) {
        var _this = this;
        var socket = io.connect('https://socket5.fxp.co.il');
        socket.on('connect', function () {
            var send = _this.info.send;
            socket.send(send);
        });
        socket.on('newpmonpage', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var pm;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            content: data.message
                        };
                        return [4 /*yield*/, this.getUserInfo(data.send)];
                    case 1:
                        pm = (_a.author = _b.sent(),
                            _a.id = Number(data.pmid),
                            _a.title = data.title,
                            _a.time = data.date + " " + data.time,
                            _a.reply = function (msg) { _this.sendPM(data.pmid, data.username, msg); },
                            _a);
                        callback(pm);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Fxios.prototype.onNewThread = function (forumId, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var socket;
            var _this = this;
            return __generator(this, function (_a) {
                socket = io.connect('https://socket5.fxp.co.il');
                socket.on('connect', function () { return __awaiter(_this, void 0, void 0, function () {
                    var forum, send;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.instance.get('https://www.fxp.co.il/forumdisplay.php?f=' + forumId + '&web_fast_fxp=1')];
                            case 1:
                                forum = _a.sent();
                                send = /\{"userid[^']+/gm.exec(forum.data);
                                socket.send(send);
                                return [2 /*return*/];
                        }
                    });
                }); });
                socket.on('newtread', function (data) { return __awaiter(_this, void 0, void 0, function () {
                    var res, content, thread;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.instance.get('https://www.fxp.co.il/printthread.php?t=' + data.id)];
                            case 1:
                                res = _b.sent();
                                content = /<blockquote class="restore">(.*?)<\/blockquote>/g.exec(res.data)[1];
                                _a = {
                                    content: htmlToBBCode(content).trim(),
                                    id: Number(data.id),
                                    title: data.title.replace('&quot;', '"')
                                };
                                return [4 /*yield*/, this.getUserInfo(data.poster)];
                            case 2:
                                thread = (_a.author = _b.sent(),
                                    _a.time = data.time,
                                    _a.tag = data.prefix,
                                    _a);
                                callback(thread);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Fxios.prototype.onNewMessageOnThread = function (thread_id, callback) {
        var _this = this;
        var socket = io.connect('https://socket5.fxp.co.il');
        socket.on('connect', function () { return __awaiter(_this, void 0, void 0, function () {
            var thread, send;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.instance.get("https://www.fxp.co.il/showthread.php?t=" + thread_id)];
                    case 1:
                        thread = _a.sent();
                        send = /send = '(.*?)'/g.exec(thread.data)[1];
                        console.log(send);
                        socket.send(send);
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on('showthreadpost', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getQouteInfo(data.postid)];
                    case 1:
                        msg = _a.sent();
                        callback(msg);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return Fxios;
}());
exports.Fxios = Fxios;
module.exports = Fxios;
