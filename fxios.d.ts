interface User {
    name: string;
    id: number;
    subname: string;
    isConnected: boolean;
}
interface Message {
    author: () => User;
    id: () => number;
    VBQuote: () => string;
    content: () => string;
    reply: (msg: string) => void;
}
interface Like {
    messageLiked: Message;
    memberLiked: User;
}
interface Thread {
    content: string;
    id: number;
    title: string;
    author: User;
    time: string;
    tag: string;
}
interface PM {
    content: string;
    author: User;
    id: number;
    title: string;
    time: string;
    reply: (msg: string) => void;
}
export declare class Fxios {
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
    onNewMessage(callback: (msg: Message) => void): void;
    onNewLike(callback: (like: Like) => void): void;
    onNewPM(callback: (pm: PM) => void): void;
    onNewThread(forumId: number, callback: (thread: Thread) => void): Promise<void>;
    onNewMessageOnThread(thread_id: number, callback: (msg: Message) => void): void;
}
export {};
