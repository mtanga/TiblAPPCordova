import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../shared/services/data/auth.service';
import { NotificationService } from '../shared/services/data/notification.service';
import { ProfileService } from '../shared/services/data/profile.service';
import { LoadingService } from '../shared/services/utils/loading.service';
import { PhotoService } from '../shared/utils/photo.service';
import { FollowerService } from '../shared/services/data/follower.service';
import { map } from 'rxjs/operators';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import {NgxCroppedEvent, NgxPhotoEditorService} from "ngx-photo-editor";


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {


  user: any;
  userinfos: any;
  imgRes: any;
  options: any;
  allFollowers: any;

  imageChangedEvent: any = '';
  croppedImage: any = '';


  constructor(
    public followerService : FollowerService,
    public authService: AuthService,
    public profileService: ProfileService,
    public actionSheetController: ActionSheetController,
    private router : Router,
    private alertController : AlertController,
    public toastController: ToastController,
    public notificationService: NotificationService,
    private ionLoader: LoadingService,
    public photoService: PhotoService,
    private service: NgxPhotoEditorService,
    private camera: Camera

  ) {
    
  }


  ngOnInit() {
    //this.ionLoader.showLoader();
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log("user", this.user);
    this.getUser();
  }

  getUser(){
    this.ionLoader.hideLoader();
    this.profileService.GetUserItem(JSON.parse(localStorage.getItem('user')).uid)
    .subscribe(data => {
     this.userinfos = data[0];
     this.user = data[0];
     console.log("infos User", this.userinfos)
     this.ionLoader.hideLoader();
     this.getFollowers();
   });
  }

  getFollowers(){
    this.followerService.getAgent(this.user.uid).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.allFollowers = data;
      console.log("Folowers", this.allFollowers);
    });
  }

/*    addPhotoToGallery() {
     console.log("Camera");
      this.imagePicker.getPictures(this.options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          this.profileService.updatePhoto(this.user.uid, 'data:image/jpeg;base64,' + results[i]);
        }
      }, (error) => {
        alert(error);
      });
      this.getUser();
} */
 zoomImage(item){
        this.photoService.zoomImage(item);
      }


  takePic(){
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
        aspectRatio: 1 / 1,
        autoCropArea: 1
      }).subscribe(data => {
        this.profileService.updatePhoto(this.user.uid, data.base64);
        this.getUser();
      });
    }, (err) => {
     // Handle error
    });
}




  async  base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('method did not return a string');
        }
      };
      reader.readAsDataURL(blob);
    });
  }


  async serviceClient() {
    const actionSheet = await this.actionSheetController.create({
      //header: 'Service client',
      header: "Service client",
      cssClass : 'serviceclient',
        buttons: [{
        text: '+237 6 96 38 76 12',
        role: 'destructive',
        icon: 'call',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'tiblapps@gmail.com',
        icon: 'mail',
        handler: () => {
          console.log('Share clicked');
        }
      },{
        text: 'CGU',
        icon: 'globe',
        handler: () => {
          window.open('https://newtec-ing.com/politique-de-confoidentialite/', 'location=yes, toolbar=yes');
        }
      }]
    });
    await actionSheet.present();
  }



  term(){
    //window.open('https://newtec-ing.com/politique-de-confoidentialite/','popup','width=600,height=600');
    window.open('https://newtec-ing.com/politique-de-confoidentialite/', 'location=yes, toolbar=yes');
   }

  async noter() {
    const actionSheet = await this.alertController.create({
      //title: 'Hello',
      header: "Noter l'application",
      message: "Vous allez être redirigez sur la store",
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: "Annuler",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: "Laissez moi noter",
          handler: (data) => {
            console.log('Confirm Ok');
              //console.log('email : ' + data.email);
              //this.auth.passwordResetEmail(data.email)
              //this.presentToast("Veuillez consulter votre messagerie car un email de réinitialisation du mot de passe vous a été envoyé ");
            
            
          }
        }
      
      ]
    });
    await actionSheet.present();
  }

  offres(){
    this.router.navigate(['/offers']);
  }

  followers(){
    this.router.navigate(['/users']);
  }

  userItem(){
    this.router.navigate(['/user'], { queryParams: {
      item: this.user.uid,
      }
    });
  }

  async profile(){
    this.alertController.create({
      header: 'Votre profil',
     // subHeader: 'Beware lets confirm',
      message: 'Souhaitez-vous modifier les informations de votre profil ?',
      inputs: [
        {
          name: "prenom",
          type : "text",
          value: this.user.first_name,
          placeholder: 'Prénom',
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "nom",
          type : "text",
          placeholder: 'Nom',
          value: this.user.last_name,
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "phone",
          type : "number",
          placeholder: 'Téléphone',
          value: this.user.phone,
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "address",
          type : "textarea",
          placeholder: 'Adresse',
          value: this.user.address,
          handler: () => {
            console.log('I care about humanity');
          }
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          text: 'Valider',
          handler: (data) => {
            const datas = {
              first_name : data.prenom,
              last_name :data.nom,
              address :data.address,
              phone :data.phone,
              displayName : data.prenom +" "+ data.nom
            };
            //console.log(datas);
            this.user.displayName = data.prenom +" "+ data.nom;
            this.user.first_name = data.prenom;
            this.user.last_name = data.nom;
            this.user.address = data.address;
            this.user.phone = data.phone;
            //console.log(this.user.uid);
            this.profileService.update(this.user.uid, datas)
            .then(() => {
              let datas = {
                item : "",
                descritpion : "Modification de votre profil",
                type : "profil",
                read: false,
                userCreated: this.user.uid,
                cibleUser: "",
              }
              this.notificationService.create(datas).then(() => {
                //console.log('Created new item successfully!');
                this.presentToast("Profil modifié avec succès avec succès");
                //this.getChat(id);
                localStorage.setItem('user', JSON.stringify(this.user));
                this.user = JSON.parse(localStorage.getItem('user')!);
              });
              
            })
            .catch(err => console.log(err)); 
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }


  async editPasswordPrompt() {
    const alert = await this.alertController.create({
      header: 'Changer Mot De Passe!',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder : 'Mail'
        },
        {
          name: 'oldPassword',
          type: 'password',
          placeholder : 'Ancien Mot De Passe'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder : 'Nouveau Mot De Passe'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if(data.oldPassword.trim() != ''){
              console.log('New Password : ' + data.newPassword);
              let credentials = { "email" : data.email, "password" : data.oldPassword }
              this.authService.updatePassword(credentials, data.newPassword);
            }
            
          }
        }
      ]
    });

    await alert.present();
  }




    // send messages 
    async presentToast(text) {
      const toast = await this.toastController.create({
        message: text,
        duration: 2000
      });
      toast.present();
    }


  myOffer(){
    this.router.navigate(['/offers'])
  };


  chat(){
    this.router.navigate(['/chats'])
  };


  notification(){
    this.router.navigate(['/notifications'])
  };

  security(){
    this.router.navigate(['/security'])
  };

  users(){
    this.router.navigate(['/list'])
  };

}


