import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { async, Subscription, timer } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AuthService } from '../shared/services/data/auth.service';
import { MessageService } from '../shared/services/data/message.service';
import { NotificationService } from '../shared/services/data/notification.service';
import { Offer } from '../shared/services/models/offer';
import { LoadingService } from '../shared/services/utils/loading.service';
import {  PhotoService } from '../shared/utils/photo.service';
import { Console } from 'console';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  text : any;
  user : any;
  sub : any;
  id: any;
  imgRes: any;
  options: any;
  message: any;
  Ref: AngularFirestoreCollection<Offer>;
  private dbPath = '/chats';
  images: any;
  image: any;
  timerSubscription: Subscription; 

  constructor(
    public router: Router,
    private route : ActivatedRoute,
    private loadingCtrl: LoadingController,
    private ionLoader: LoadingService,
    public toastController: ToastController,
    public alertController: AlertController,
    public authService: AuthService,
    public messageService: MessageService,
    public notificationService: NotificationService,
    public photoService: PhotoService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private camera: Camera,
  ) {
    this.Ref = db.collection(this.dbPath);

        // timer(0, 10000) call the function immediately and every 10 seconds 
        this.timerSubscription = timer(0, 100000).pipe( 
          map(() => { 
            this.sub = this.route
            .queryParams
            .subscribe( params  => {
              this.id = params['item'];
              this.retrieveMessage(this.id);
            });
          }) 
        ).subscribe(); 
  }

  ngOnInit() {
    this.ionLoader.showLoader();
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log("user user 3", this.user)
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.id = params['item'];
      this.retrieveMessage(this.id);
    });
  }

  async retrieveMessage(item){
    await this.messageService.getOne(item).then(doc => {
      if (doc.exists) {
        console.log(doc.data());
        this.message = doc.data();
        console.log("MAJ Message", this.message)
       
      } else {
        console.log("There is no document!");
      }
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    });
    this.ionLoader.hideLoader();
  }

  zoomImage(item){
    //this.photoViewer.show(item.image, 'Tibl image', {share: true});
    this.photoService.zoomImage(item.image);
  }



async sendImage2() {
  if(this.message ==undefined || this.message.messages.lenght < 3){
    console.log("CGU");
      let alert = await this.alertController.create({
        message: '<ion-text text-center color="medium"><h6 no-margin class="small">En envoyant votre message vous acceptez les <a (click)="term()">termes d\' utilisation</a> et <a (click)="term()">Conditions de confidentialité</a></h6></ion-text>',
        buttons: [
          {
            text: 'Je refuse',
            role: 'cancel',
            handler: () => {
              this.presentToast("Message non envoyé!");
            }
          },
          {
            text: 'J\'accepte',
            handler: () => {
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
                 this.updateImg(base64Image);
              }, (err) => {
               // Handle error
              });
            }
          }
        ]
      });
      alert.present();
  }
  else{
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
       this.updateImg(base64Image);
    }, (err) => {
     // Handle error
    });
  }
}

updateImg(img){
  this.image = img;
  var imageUrl = img;
  let rdN = Math.random().toString(36).substr(2, 9);
  let pic = imageUrl;
  const filePath = `chats_photos/${rdN}`;
  const ref = this.storage.ref(filePath);

  const task = ref.putString(pic, 'data_url');
  task.snapshotChanges().pipe(
    finalize(() => {
    ref.getDownloadURL().subscribe(url => {
     // console.log("Image ici cici", url)
      let data = {
        type : "image",
        image : url,
        Sender : this.user.uid,
        dateCreated : new Date(),
      }
      this.messageService.sendMessage(this.id, data)
      .then(() => {
        this.text = "";
        this.retrieveMessage(this.id);
        //this.presentToast("Commentaire ajouté avec succès");
      })
      .catch(err => console.log(err));
      });   
    })
  ).subscribe();
 // return "Avec succès! "
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




  async send(){
    console.log("Votre message", this.text)
    if(this.text == "" || this.text==undefined || this.text==null || this.text.length <2 ){
      this.presentToast("Impossible d'envoyer votre message car il est vide ou trop petit");
    }
    else{
     console.log("longueur", this.message?.message.length)
      if(this.message ==undefined || this.message.messages.lenght < 3){
        console.log("CGU");
          let alert = await this.alertController.create({
            message: '<ion-text text-center color="medium"><h6 no-margin class="small">En envoyant votre message vous acceptez les <a (click)="term()">termes d\' utilisation</a> et <a (click)="term()">Conditions de confidentialité</a></h6></ion-text>',
            buttons: [
              {
                text: 'Je refuse',
                role: 'cancel',
                handler: () => {
                  this.presentToast("Message non envoyé!");
                }
              },
              {
                text: 'J\'accepte',
                handler: () => {
                  console.log(this.text)
                  let data = {
                    type : "text",
                    text : this.text,
                    Sender : this.user.uid,
                    dateCreated : new Date()
                  }
                  this.messageService.sendMessage(this.id, data)
                  .then(() => {
                    this.text = "";
                    this.retrieveMessage(this.id);
                  })
                  .catch(err => console.log(err));
                }
              }
            ]
          });
          alert.present();
      }
      else{
        console.log(this.text)
        let data = {
          type : "text",
          text : this.text,
          Sender : this.user.uid,
          dateCreated : new Date()
        }
        this.messageService.sendMessage(this.id, data)
        .then(() => {
          this.text = "";
          this.retrieveMessage(this.id);
        })
        .catch(err => console.log(err));
      }
    }

  }

  term(){
    //window.open('https://newtec-ing.com/politique-de-confoidentialite/','popup','width=600,height=600');
    window.open('https://newtec-ing.com/politique-de-confoidentialite/', 'location=yes, toolbar=yes');
   }


  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  backNow(){
    console.log("ok")
    this.router.navigate(['/chats']);
  }

  

}
