import axios from "axios"
export default class Gmailnator{
    constructor(){
        this.client = axios.create({
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
        },
        "referrer": "https://www.emailnator.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "mode": "cors",
        "credentials": "include",
        withCredentials:true,
        xsrfCookieName:"XSRF-TOKEN",
        xsrfHeaderName:"X-Xsrf-Token"
        })
    }
    async init(){
        let client = this.client;
        let res = await client.get("https://www.emailnator.com/");
        const gmailnator_session = res.headers["set-cookie"][1].match(/gmailnator_session=(.*?);/)[1].replace('%3D', "=");
        const XSRF = res.headers["set-cookie"][0].match(/XSRF-TOKEN=(.*?);/)[1].replace('%3D', "=");
        const newCookieString = `XSRF-TOKEN=${XSRF}; gmailnator_session=${gmailnator_session};`
        client.defaults.headers.common["Cookie"]= newCookieString;
        client.defaults.headers.common["X-Xsrf-Token"]= XSRF;
        this.XSRF= XSRF;
        this.gmailnator_session=gmailnator_session;
    }

    async generateGmail() {
        let gmail = await this.client.post("https://www.emailnator.com/generate-email",'{"email":["dotGmail"]}');
        return gmail.data.email[0];
    }

    async generateGmails(amount){
        let gmail = await this.client.post("https://www.emailnator.com/generate-email",'{"email":["dotGmail"],"emailNo":"'+amount+'"}');
        return gmail.data.email;
    }

    async validateUser(gmail,username) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        let messages = await this.client.post("https://www.emailnator.com/message-list",JSON.stringify({email:gmail}));
        messages = messages.data.messageData;
        if(!messages) return null;
        let mssage = messages.find((msg)=>msg.from.includes("FXP"));
        let attemempts = 1;
        while(!mssage){
            if(attemempts > 5) {
                console.log("faild to validate "+ username+ " the gmail is "+ gmail+" so you can validate manually in https://www.emailnator.com/inbox#"+gmail);
                return null;
            }
            console.log("failed attempt "+attemempts+" to validate "+ username+" trying again...");
            attemempts++;
            await new Promise(resolve => setTimeout(resolve, 8000));
            messages = await this.client.post("https://www.emailnator.com/message-list",JSON.stringify({email:gmail}));
            messages = messages.data.messageData;
            mssage = messages.find((msg)=>msg.from.includes("FXP"));
        }
        mssage=mssage.messageID;
        let content = await this.client.post("https://www.emailnator.com/message-list",JSON.stringify({email:gmail,messageID:mssage}));
        content=content.data;
        let url = /<a(.*?)href="https:\/\/www.fxp.co.il\/register.php(.*?)"(.*?)>(.*?)<\/a>/.exec(content)[4];
        axios.get(url);
        console.log(username+" was validated successfully!");
        return url;
    }

}