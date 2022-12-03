import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Actuality } from '../../services/models/actuality';
import { finalize, map, take } from 'rxjs/operators';
import { NewsPage } from 'src/app/news/news.page';
import {formatDate} from '@angular/common';
import * as firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private dbPath = '/actualites';


  Ref: AngularFirestoreCollection<Actuality>;
  images: any = [];


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    ) {
    this.Ref = db.collection(this.dbPath);
  }

  
  getAll(): AngularFirestoreCollection<Actuality> {
    return this.Ref;
  }


  getOne(id) {
    return this.Ref.doc(id).ref.get();
 
    
  }

  create(news: Actuality): any {
     news.dateCreated = new Date();
     news.userCreated = JSON.parse(localStorage.getItem('user')!).uid;
     news.comments = [];
     news.likes =  [];
     news.share = 0
     return this.Ref.add({ ...news });
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
    let array = [];
    //array.push()

        let rdN = Math.random().toString(36).substr(2, 9);
        images.forEach(image => {
          //console.log(image.webviewPath);
          let pic = image.webviewPath;
          const filePath = `news_photos/${rdN}`;
          const ref = this.storage.ref(filePath);

     
          const task = ref.putString(pic, 'data_url');
          task.snapshotChanges().pipe(
            finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              array.push(url)
              console.log(url);
              console.log("mes images 2", array);
              });   
            })
          ).subscribe();

        }, (err) => {
          console.log(err);
         })

      return array;
    }
   

}

