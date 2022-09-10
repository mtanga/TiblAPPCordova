import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PhotoService } from '../../shared/utils/photo.service';

import {Actuality} from '../../shared/services/models/actuality';
import { NewsService } from '../../shared/services/data/news.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as firebase from 'firebase/compat/app';
import { finalize } from 'rxjs/operators';
import { Offer } from 'src/app/shared/services/models/offer';
import { MessagesService } from '../../shared/services/utils/messages.service';


@Component({
  selector: 'app-newcomponent',
  templateUrl: './newcomponent.page.html',
  styleUrls: ['./newcomponent.page.scss'],
})
export class NewcomponentPage implements OnInit {
  text : any;
  name : any;


  new: Actuality = new Actuality();
  submitted = false;
  images: any;

  private dbPath = '/actualites';
  Ref: AngularFirestoreCollection<Offer>;


  constructor(
    private popover:PopoverController,
    public photoService: PhotoService,
    private newService: NewsService,
    private db: AngularFirestore,
    private message: MessagesService,
    private storage: AngularFireStorage,
    ){ 
      this.Ref = db.collection(this.dbPath);
    }

  ngOnInit() {
  }

  ClosePopover()
  {
    this.popover.dismiss();
  }

  addPhotoToGallery() {
    //this.photoService.addNewToGallery();
    this.photoService.imagePick();
  }


  async create() {
    if((this.new.name == "" || this.new.name == null) || (this.new.description == "" || this.new.description == null)){
        this.message.presentToast("Le titre ou la description de votre article est vide");
    }
    else{
      this.images = this.photoService.photos;
      const { id } = await this.newService.create(this.new);
      console.log("the new city's id:", id);
      console.log(this.images)

      let rdN = Math.random().toString(36).substr(2, 9);
      this.images.forEach(image => {
        let pic = image.webviewPath;
        const filePath = `news_photos/${rdN}`;
        const ref = this.storage.ref(filePath);
  
        const task = ref.putString(pic, 'data_url');
        task.snapshotChanges().pipe(
          finalize(() => {
          ref.getDownloadURL().subscribe(url => {
          this.Ref.doc(id).update({photoURL : firebase.default.firestore.FieldValue.arrayUnion(url)});
            });   
          })
        ).subscribe();
      }) 

     this.ClosePopover();
     this.new = new Actuality();
     this.submitted = true;
     this.photoService.photos = [];
     this.name = "";
     this.text = "";
   }


  }
  newTutorial(): void {
    this.submitted = false;
    this.new = new Actuality();
  }







}
