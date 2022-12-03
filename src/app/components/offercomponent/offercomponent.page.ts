import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { PopoverController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { OfferService } from 'src/app/shared/services/data/offer.service';
import { Types } from 'src/app/shared/services/models/types';
import { PhotoService } from 'src/app/shared/utils/photo.service';
import * as firebase from 'firebase/compat/app';
import {Offer} from '../../shared/services/models/offer';
import { NotificationService } from 'src/app/shared/services/data/notification.service';
//import { firestore } from 'firebase/compat/firestore';
//import firebase from 'firebase/compat/app';
import { LoadingService } from 'src/app/shared/services/utils/loading.service';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import { MessagesService } from 'src/app/shared/services/utils/messages.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { NgxPhotoEditorService } from 'ngx-photo-editor';

@Component({
  selector: 'app-offercomponent',
  templateUrl: './offercomponent.page.html',
  styleUrls: ['./offercomponent.page.scss'],
})
export class OffercomponentPage implements OnInit {
  text : any;
  name : any;

  basePath = '/ads';                       //  <<<<<<<
  task: AngularFireUploadTask;

  categories : Types = new Types();
  offer : Offer = new Offer();
  submitted = false;
  sub: any;
  images: any = [];
  private dbPath = '/offers';
  Ref: AngularFirestoreCollection<Offer>;
  arrayOfImages: any[];
  img: Promise<any[]>;
  imadesSave: any = [];

  constructor(
    private popover:PopoverController,
    public photoService: PhotoService,
    private offerService: OfferService,
    public toastController: ToastController,
    private camera: Camera,
    private service: NgxPhotoEditorService,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    public notificationService: NotificationService,
    private imagePicker: ImagePicker,
    private ionLoader: LoadingService,
    private message: MessagesService,
  ) {
    this.Ref = db.collection(this.dbPath);
   }

  ngOnInit() {
    console.log(this.categories);
  }

  triggerEvent(){
      console.log(this.offer.category)
      this.chargeSub(this.offer.category);
  }


  chargeSub(category: string) {
    let arri = this.categories.category;
    arri.forEach(element => {
      if(element.id==category){
          this.sub = element.subcategories;
          console.log(this.sub);
      }
    });
  }

  




  ClosePopover()
  {
    this.popover.dismiss();
  }

  addPhotoToGallery() {
    this.imagePick();
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


  async create() {
    if(this.offer.name == "" || this.offer.name == null){
      this.message.presentToast("Le titre de votre article est vide");
    }
    else if(this.offer.lieu == "" || this.offer.lieu == null){
      this.message.presentToast("Le lieu de votre article est vide");
    }
    else if(this.offer.price == null){
      this.message.presentToast("Le prix de votre article est vide");
    }
    else if(this.offer.category == "" || this.offer.category == null){
      this.message.presentToast("Veuillez sélectionner une catégorie");
    }
    else if(this.offer.subcategory == "" || this.offer.subcategory == null){
      this.message.presentToast("Veuillez sélectionner une sous-catégorie");
    }
    else if(this.images.length < 0){
      this.message.presentToast("Veuillez ajouter des images à votre offre");
    }
    else if (this.offer.description == "" || this.offer.description == null){
      this.message.presentToast("La description de votre article est vide");
    }
    else{
      this.ionLoader.showLoader();
      this.saveimage(this.images).then( res => {
        console.log("images ici 2", res);
        //this.imadesSave = res;
        this.saveOffer(res);
      })

    }
  }


  async saveOffer(images){
   // this.offer.photoURL.push(images);
    this.offer.photoURL = images[0];
    this.offer.images = images;
    const { id } = await this.offerService.create(this.offer);
    this.Ref.doc(id).update({ uid : id });
    let datas = {
      item : id,
      titre : this.offer.name,
      type : "Chat",
      descritpion : "Votre nouvelle offre est en cours de validation",
      read: false,
      userCreated: JSON.parse(localStorage.getItem('user')).uid,
      cibleUser: JSON.parse(localStorage.getItem('user')).uid,
    }
    this.notificationService.create(datas).then(() => {
      console.log('Created new item successfully!');
     // this.getChat(id);
    });
    this.ionLoader.hideLoader();
    this.ClosePopover();
    this.images = []
    this.presentToast("Votre offre a été crée avec succès. Elle sera activée par un admin dans les plus brefs délais");
    this.photoService.photos = [];
    this.offer = new Offer();
    this.submitted = true 
  }



  async saveimage(images){
    this.arrayOfImages = [];
    for (var i = 0; i < images.length; i++){
      let rdN = Math.random().toString(36).substr(2, 9);
      let pic = images[i];
      const filePath = `offers_photos/${rdN}`;
      const ref = this.storage.ref(filePath);
      const task = ref.putString(pic, 'data_url');
      (await task).ref.getDownloadURL().then(url => {
        this.arrayOfImages.push(url); 
      }); 
    }
    return this.arrayOfImages;
  }




  newTutorial(): void {
    this.submitted = false;
    this.offer = new Offer();
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
