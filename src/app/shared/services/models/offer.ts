export class Offer {
    uid: string;
    name: string;
    subcategory : string;
    category : string;
    type : string;
    lieu : string;
    price : number;
    photoURL: any;
    images: any = [];
    likes : any;
    comments : any;
    shares : number;
    userImage : string;
    userName : string;
    vip: string;
    description: string;
    dateCreated: Date;
    userCreated: string;
    visible: boolean;
}
