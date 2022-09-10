import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Offer } from '../../services/models/offer';
import { finalize, map, take } from 'rxjs/operators';
import {formatDate} from '@angular/common';
import { Message } from '../../services/models/message';
import * as firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private dbPath = '/chats';


  Ref: AngularFirestoreCollection<Message>;
  images: any = [];


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    ) {
    this.Ref = db.collection(this.dbPath);
  }

  
  getAll(): AngularFirestoreCollection<Message> {
    return this.Ref;
  }

  getUserChat(id): AngularFirestoreCollection<any> {
    return this.db.collection('chats', ref => ref.where('users', 'array-contains', {user : id}));
  }

  getUserChatByClient(user): AngularFirestoreCollection<Message> {
    return this.db.collection('chats', ref => ref.where('userCreated', '==', user));
  }


  getOne(id) {
    return this.Ref.doc(id).ref.get();
 
    
  }

  create(data){     
     return this.Ref.add({ ...data });
  }

  update(id: string, data: any): Promise<void> {
    return this.Ref.doc(id).update(data);
  }

  sendMessage(id: string, data: any){
    return this.Ref.doc(id).update({
      messages : firebase.default.firestore.FieldValue.arrayUnion(data)
    });
    //this.Ref.doc(id).update({photoURL : firebase.default.firestore.FieldValue.arrayUnion(url)});
  }

  like(id: string, data: any): Promise<void> {
    return this.Ref.doc(id).update(data);
  }
  
  delete(id: string): Promise<void> {
    return this.Ref.doc(id).delete();
  }

  storeImages(images){
    console.log("images ici 1", images)
    let rdN = Math.random().toString(36).substr(2, 9);
    images.photoURL.forEach(image => {
      //console.log(image.webviewPath);
      let pic = image.webviewPath;
      const filePath = `offer_photos/${rdN}`;
      const ref = this.storage.ref(filePath);

      const task = ref.putString(pic, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.images.push(url);
          console.log("Votre image", url);
          });   
        })
      )//.subscribe();

      
    }, (err) => {
      console.log(err);
     })


    }
   

}

