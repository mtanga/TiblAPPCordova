export interface Signalement {
    uid: string;
    raison: string;
    photoURL: string;
    vip: string;
    description: string;
    dateCreated: Date;
    userCreated: string;
    cibleUser: string;
    visible: boolean;
}
