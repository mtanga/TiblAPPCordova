import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Notification } from '../../services/models/notifications';
import { finalize, map, take } from 'rxjs/operators';
import { NewsPage } from 'src/app/news/news.page';
import {formatDate} from '@angular/common';
import * as firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private dbPath = '/notifications';


  Ref: AngularFirestoreCollection<Notification>;
  images: any = [];


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    ) {
    this.Ref = db.collection(this.dbPath);
  }

  
  getAll(id): AngularFirestoreCollection<Notification> {
    return this.db.collection('notifications', ref => ref.where('cibleUser', '==', id));
  }

  getAdmin(): AngularFirestoreCollection<Notification> {
    return this.db.collection('notifications', ref => ref.where('cibleUser', '==', "admin"));
  }


  getOne(id) {
    return this.Ref.doc(id).ref.get();
 
    
  }

  getUserNotice(user) {
   // this.Ref.where("state == CA || state == AZ")
    //return this.db.collection('users', ref => ref.owhere('uid', '==', user));

    //citiesRef.where("state", "==", "CA", "||", "state", "==", "AZ")
    //return this.db.collection('cibleUser', ref => ref.where('uid', '==', user));
  }

  create(notification: Notification): any {     
     return this.Ref.add({ ...notification });
  }

  update(id: string, data: any): Promise<void> {
    return this.Ref.doc(id).update(data);
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

