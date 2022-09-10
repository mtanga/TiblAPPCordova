import { Injectable } from '@angular/core';

import { ViewerModalComponent } from 'ngx-ionic-image-viewer';


import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import {NgxCroppedEvent, NgxPhotoEditorService} from "ngx-photo-editor";
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: any = [];
  imgRes: any;
  options: any;
  //public photoss: UserPhoto = [];

  constructor(
    private service: NgxPhotoEditorService,
    private camera: Camera,
    public modalController: ModalController
  ) { }

  public async addNewToGallery() {
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
        this.photos.unshift({
          filepath: "soon...",
          webviewPath: data.base64,
        })
      });
    }, (err) => {
     // Handle error
    });


/*     this.options = {
      width: 200,
      quality: 30,
      outputType: 1
    };
    
    this.imgRes = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imgRes.push('data:image/jpeg;base64,' + results[i]);
        this.photos.unshift({
          filepath: "soon...",
          webviewPath: 'data:image/jpeg;base64,' + results[i],
        })
      }
    }, (error) => {
      alert(error);
    }); */

  }

/*   zoomImaged(item){
    console.log(item);
    if(item == null || item ==""){
      this.photoViewer.show(' /assets/images/avatar.png', 'Tibl image', {share: true});
    }
    else{
      this.photoViewer.show(item, 'Tibl image', {share: true});
    }
   
  } */

  async zoomImage(item) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: item,
        title: 'Tibl image', // optional
        text: 'Tibl Image', // optional
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

  onWillDismiss(){
    
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
        this.photos.unshift({
          filepath: "soon...",
          webviewPath: data.base64,
        })
      });
    }, (err) => {
     // Handle error
    });
  }


}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}


