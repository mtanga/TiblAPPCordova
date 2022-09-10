import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Offer } from '../../services/models/offer';
import { finalize, map, take } from 'rxjs/operators';
import { NewsPage } from 'src/app/news/news.page';
import {formatDate} from '@angular/common';
import * as firebase from 'firebase/compat';
import { User } from '../models/user';
import { Subject } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private dbPath = '/users';


  Ref: AngularFirestoreCollection<Offer>;
  images: any = [];
  userItem: any;


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    public toastController: ToastController,
    ) {
    this.Ref = db.collection(this.dbPath);
  }

  
  getAll(): AngularFirestoreCollection<Offer> {
    return this.Ref;
  }


  getOne(id) {
    return this.Ref.doc(id).ref.get();
  }

  getUser(user): AngularFirestoreCollection<User> {
    return this.db.collection('users', ref => ref.where('uid', '==', user));
  }


  GetUserItem(user){
    console.log("Id ici", user)
    //var subject = new Subject<string>();
   return this.getUser(user).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    )

   // console.log("user ici et ici 2", this.userItem);
  //  return subject.asObservable();
    //return this.userItem;
  }

  create(offer: Offer): any {     
     // console.log("images ici", this.images)
      offer.dateCreated = new Date();
      offer.userCreated = JSON.parse(localStorage.getItem('user')!).uid;
      offer.userImage = JSON.parse(localStorage.getItem('user')!).photoURL;
      offer.userName = JSON.parse(localStorage.getItem('user')!).displayName;
      offer.visible = false;
      offer.photoURL = [];
      offer.comments = [];
      offer.likes =  [];
      offer.shares = 0;
     return this.Ref.add({ ...offer });
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

  updatePhoto(id, image){
  // console.log("id", id)
      let rdN = Math.random().toString(36).substr(2, 9);
      let pic = image;
      const filePath = `user_photos/${rdN}`;
      const ref = this.storage.ref(filePath);

      const task = ref.putString(pic, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          console.log("Image ici cici", url)
          this.Ref.doc(id).update(
            {
              photoURL : url
            }
          );
          });   
          this.presentToast("Votre image a été mise à jour");
        })
      ).subscribe();
      return "Avec succès! "
    }

    async presentToast(text) {
      const toast = await this.toastController.create({
        message: text,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
}

