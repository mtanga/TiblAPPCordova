export interface Message {
    uid: string;
    name: string;
    idP: string;
    messages : any;
    dateCreated: Date;
    userCreated: string;
    cibleUser: string;
    visible: boolean;
}
