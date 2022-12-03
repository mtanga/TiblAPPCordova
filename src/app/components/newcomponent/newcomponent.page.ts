import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PhotoService } from '../../shared/utils/photo.service';
import { LoadingService } from 'src/app/shared/services/utils/loading.service';
import {Actuality} from '../../shared/services/models/actuality';
import { NewsService } from '../../shared/services/data/news.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as firebase from 'firebase/compat/app';
import { finalize } from 'rxjs/operators';
import { Offer } from 'src/app/shared/services/models/offer';
import { MessagesService } from '../../shared/services/utils/messages.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { NgxPhotoEditorService } from 'ngx-photo-editor';

@Component({
  selector: 'app-newcomponent',
  templateUrl: './newcomponent.page.html',
  styleUrls: ['./newcomponent.page.scss'],
})
export class NewcomponentPage implements OnInit {
  text : any;
  name : any;
  arrayOfImages: any[];
  img: Promise<any[]>;
  imadesSave: any = [];

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
    private service: NgxPhotoEditorService,
    private ionLoader: LoadingService,
    private message: MessagesService,
    private storage: AngularFireStorage,
    private camera: Camera,
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
    this.imagePick();
  }


  async create() {
    if((this.new.name == "" || this.new.name == null) || (this.new.description == "" || this.new.description == null)){
        this.message.presentToast("Le titre ou la description de votre article est vide");
    }
    else{

      this.ionLoader.showLoader();
      this.saveimage(this.images).then( res => {
        this.saveNew(res);
      })
   }
  }

  async saveNew(images){
    this.new.photoURL = images[0];
    this.new.images = images;
    const { id } = await this.newService.create(this.new);
    this.ionLoader.showLoader();
    this.ClosePopover();
    this.new = new Actuality();
    this.submitted = true;
    this.photoService.photos = [];
    this.name = "";
    this.text = "";
  }


  async saveimage(images){
    this.arrayOfImages = [];
    for (var i = 0; i < images.length; i++){
      let rdN = Math.random().toString(36).substr(2, 9);
      let pic = images[i];
      const filePath = `news_photos/${rdN}`;
      const ref = this.storage.ref(filePath);
      const task = ref.putString(pic, 'data_url');
      (await task).ref.getDownloadURL().then(url => {
        this.arrayOfImages.push(url); 
      }); 
    }
    return this.arrayOfImages;
  }

  imagePick() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.service.open(base64Image, {
        aspectRatio: 4 / 3,
        autoCropArea: 1
      }).subscribe(data => {
        this.images.push(data.base64);
      });
    }, (err) => {
     // Handle error
    });
  }



  newTutorial(): void {
    this.submitted = false;
    this.new = new Actuality();
  }







}
