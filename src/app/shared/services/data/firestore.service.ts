import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

import { User } from '../../services/models/user';

import { Category } from '../../services/models/category';
import { Chat } from '../../services/models/chat';
import { Comments } from '../../services/models/comments';
import { Membership } from '../../services/models/membership';
import { Message } from '../../services/models/message';
import { News } from '../../services/models/news';
import { Notifications } from '../../services/models/notifications';
import { Offer } from '../../services/models/offer';
import { Subcategory } from '../../services/models/subcategory';
import { Signalement } from '../../services/models/signalement';




@Injectable({
  providedIn: 'root'
})
export class FirestoreService {


  private dbPath = '/tutorials';


  tutorialsRef: AngularFirestoreCollection<Tutorial>;
  constructor(private db: AngularFirestore) {
    this.tutorialsRef = db.collection(this.dbPath);
  }

  
  getAll(): AngularFirestoreCollection<Tutorial> {
    return this.tutorialsRef;
  }
  create(tutorial: Tutorial): any {
    return this.tutorialsRef.add({ ...tutorial });
  }
  update(id: string, data: any): Promise<void> {
    return this.tutorialsRef.doc(id).update(data);
  }
  delete(id: string): Promise<void> {
    return this.tutorialsRef.doc(id).delete();
  }
}
