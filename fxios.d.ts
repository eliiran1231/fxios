export interface User {
    name: string;
    id: number;
    subname: string;
    isConnected: boolean;
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
    time: string;
    tag: string;
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
}

export declare const options = "headers[user-agent]=Mozilla%2F5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F81.0.4044.138%20Safari%2F537.36";
export declare var htmlToBBCode: (html: string) => string;
declare class Fxios {
    instance: any;
    info: {
        securitytoken: string;
        userId: number;
        send: string;
    };
    constructor();
    login(username: string, password: string): Promise<void>;
    addmember(username: string, password: string): void;
    logout(): void;
    makelike(commentId: number): void;
    sendMessage(showtherdId: number, message: string): void;
    newthread(forumId: number, tag: number, title: string, content: string): void;
    deleteMessage(commentId: number): void;
    editMessage(commentId: number, content: string): void;
    sendNewPM(user: number, subject: string, message: string): void;
    sendPM(pmId: number, user: number, message: string): void;
    getUserInfo(id: number): Promise<User>;
    getUserInfoByName(username: string): Promise<User>;
    getQouteInfo(commentId: number): Promise<Message>;
    getThreadInfo(id:number):Promise<User[]>;
    onNewMessage(callback: (msg: Message) => void): void;
    onNewLike(callback: (like: Like) => void): void;
    onNewPM(callback: (pm: PM) => void): void;
    onNewThread(forumId: number, callback: (thread: Thread) => void): Promise<void>;
    onNewMessageOnThread(thread_id: number, callback: (msg: Message) => void): void;
    getAdminsInfo(): Promise<Admin[][]>;
}
export default Fxios;
