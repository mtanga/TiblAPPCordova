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

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private dbPath = '/offers';


  Ref: AngularFirestoreCollection<Offer>;
  images: any = [];


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    ) {
    this.Ref = db.collection(this.dbPath);
  }

  
  getAll(): AngularFirestoreCollection<Offer> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc').where('visible', '==', true));
  }


  getAllss(id): AngularFirestoreCollection<Offer> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc').where('visible', '==', true).where('userCreated', '==', id));
  }

  getAllls(id): AngularFirestoreCollection<Offer> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc').where('category', '==', id).where('visible', '==', true));
  }

  getAlllSub(id): AngularFirestoreCollection<Offer> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc').where('subcategory', '==', id).where('visible', '==', true));
  }

  getAlls(): AngularFirestoreCollection<Offer> {
    //return this.Ref;
    return this.db.collection('offers', ref => ref.orderBy('dateCreated', 'desc'));
    //return this.db.collection('offers', ref => ref.where('visible', '==', false));
  }


  getOne(id) {
    return this.Ref.doc(id).ref.get();
  }

  create(offer: Offer) {  
   // console.log("mes images", images)   
      offer.dateCreated = new Date();
      offer.userCreated = JSON.parse(localStorage.getItem('user')!).uid;
      offer.userImage = JSON.parse(localStorage.getItem('user')!).photoURL || "";
      offer.userName = JSON.parse(localStorage.getItem('user')!).displayName || "";
      offer.visible = false;
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

