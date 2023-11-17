import {AxiosInstance, AxiosResponse} from "axios"
export interface User {
    name: string;
    id: number;
    subname: string;
    isConnected: boolean;
    getMore: ()=>Promise<UserMore>
    rank: string;
}

export interface UserMore{
    gen:{
        biography: string;
        hobbies: string;
        profession: string;
        sex: string = "זכר" || "נקבה" || "אחר";
        relationshipStatus: string='פנוי/ה לקשר' || "לא פנוי/ה לקשר";
        attractedTo: string='נשים' || "גברים" || "שני המינים" || "מוסתר";
        livingArea: string='המרכז'|| "השרון" || "הצ]פון" || "הדרום" || "ירושלים והסביבה" || 'חו"ל';
        city: string="אבן יהודה" || "אופקים" || "אור יהודה" || "אור עקיבא" || "אילת" || "אריאל" || "אשדוד" || "אשקלון" || "באר יעקב" || "באר שבע" || "בית שאן" || "בית שמש" || "ביתר עילית" || "בני ברק" || "בת ים" || "גבעת שמואל" || "גבעתיים" || "גדרה" || "דימונה" || "הוד השרון" || "הרצליה" || "חדרה" || "חולון" || "חיפה" || "טבריה" || "טייבה" || "טירה" || "טירת כרמל" || "טמרה" || "יבנה" || "יהוד" || "יהוד–מונוסון" || "יקנעם" || "ירושלים" || "כפר סבא" || "כרמיאל" || "לוד" || "מבשרת ציון" || "מגדל העמק" || "מודיעין–מכבים–רעות" || "מזכרת בתיה" || "מעלה אדומים" || "מעלות – תרשיחא" || "מצפה רמון" || "נהריה" || "נס ציונה" || "נצרת" || "נצרת עילית" || "נשר" || "נתיבות" || "נתניה" || "סח'נין" || "עכו" || "עפולה" || "ערד" || "פרדס חנה" || "פתח תקווה" || "צוחר" || "צפת" || "קיסריה" || "קצרין" || "קריית אונו" || "קריית אתא" || "קריית ביאליק" || "קריית גת" || "קריית חיים" || "קריית טבעון" || "קריית ים" || "קריית מוצקין" || "קריית מלאכי" || "קרית עקרון" || "קריית שמונה" || "ראש העין" || "ראשון לציון" || "רחובות" || "רמלה" || "רמת גן" || "רמת השרון" || "רעננה" || "שגור" || "שדרות" || "שוהם" || "שפרעם" || "תל אביב – יפו" || "אחר" || "חו\"ל";
    }
    friends:{
        name:string;
        id: number;
    }[]
    stats: {
        totalMessages: number;
        messagesPerDay: number;
        totalLikes: number;
        totalFollowers: number;
        lastActivityDate?: Date;
        joinDate?: Date;
        totalFriendMessages?: number;
        lastFriendMessageDate?:Date;
        birthDate?:Date;
      }
    signature: string;
}

export interface Message {
    author: () => User;
    id: () => number;
    VBQuote: () => string;
    content: () => string;
    reply: (msg: string) => void;
}
export interface Like {
    messageLiked: Message;
    memberLiked: User;
}
export interface Thread {
    content: string;
    id: number;
    title: string;
    author: User;
    lastPage: number;
    messages: (page: number,max:number,pp:number,callback:(message:Message)=>void) => Promise<Message[][]>;
}
export interface PM {
    content: string;
    author: User;
    id: number;
    title: string;
    time: string;
    reply: (msg: string) => void;
}

export interface Admin{
    name: string;
    id: number;
    isConnected: boolean;
    rank:string;
}

export declare const options = "headers[user-agent]=Mozilla%2F5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F81.0.4044.138%20Safari%2F537.36";
export declare var htmlToBBCode: (html: string) => string;
declare class Fxios {
    instance: AxiosInstance;
    info: {
        securitytoken: string;
        userId: number;
        send: string;
    };
    constructor();
    login(username: string, password: string): Promise<AxiosResponse<any,any>>;
    addmember(username: string, password: string, email?:string): Promise<{created:boolean,validated:boolean,data:any}>;
    addmembers(usernames: string[], password: string, safeMode: boolean): Promise<{username:string,gmail:string, created:boolean,validated:boolean}[]>;
    logout(): Promise<AxiosResponse<any,any>>;
    makelike(commentId: number): Promise<AxiosResponse<any,any>>;
    sendMessage(showtherdId: number, message: string): Promise<AxiosResponse<any,any>>;
    newthread(forumId: number, tag: number, title: string, content: string): Promise<AxiosResponse<any,any>>;
    deleteMessage(commentId: number): Promise<AxiosResponse<any,any>>;
    editMessage(commentId: number, content: string): Promise<AxiosResponse<any,any>>;
    sendNewPM(user: number, subject: string, message: string): Promise<AxiosResponse<any,any>>;
    sendPM(pmId: number, user: number, message: string): Promise<AxiosResponse<any,any>>;
    getUserInfo(id: number): Promise<User>;
    getUserInfoByName(username: string): Promise<User>;
    getQouteInfo(commentId: number): Promise<Message>;
    getThreadInfo(id:number):Promise<Thread>;
    onNewMessage(callback: (msg: Message,isQouted:boolean) => void): void;
    onNewLike(callback: (like: Like) => void): void;
    onNewPM(callback: (pm: PM) => void): void;
    onNewThread(forumId: number, callback: (thread: Thread) => void): void;
    onNewMessageOnThread(thread_id: number, callback: (msg: Message) => void): void;
    getAdminsInfo(): Promise<Admin[]>;
    getTopThreads(forumId: number): Promise<number[]>;
    async uploadAudio(audio:string, duration:number,sox:number): Promise<string>;
}
export default Fxios;