import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Offer } from '../shared/services/models/offer';
import { OfferService } from '../shared/services/data/offer.service';
import { LoadingService } from '../shared/services/utils/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { MessagesService } from '../shared/services/utils/messages.service';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { AuthService } from '../shared/services/data/auth.service';
import { MessageService } from '../shared/services/data/message.service';
import { NotificationService } from '../shared/services/data/notification.service';
import { map } from 'rxjs/operators';
import { PhotoService } from '../shared/utils/photo.service';
import { FollowerService } from '../shared/services/data/follower.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  comment : any;
  sub: any;
  item: any = [];
  user: any = [];
  id: any;
  userInfos: any;
  messageItem: any;
  deja: boolean;
  dejas: boolean = false;
  dejass: boolean = false;
  disFollowerid: any = [];
  timerSubscription: Subscription; 

  constructor(
    private offerService: OfferService,
    public router: Router,
    private route : ActivatedRoute,
    private loadingCtrl: LoadingController,
    private ionLoader: LoadingService,
    private callNumber: CallNumber,
    public toastController: ToastController,
    public alertController: AlertController,
    public authService: AuthService,
    public messageService: MessageService,
    public notificationService: NotificationService,
    public photoService: PhotoService,
    public followerService : FollowerService
  ) { 

            // timer(0, 10000) call the function immediately and every 10 seconds 
            this.timerSubscription = timer(0, 300000).pipe( 
              map(() => { 
                this.sub = this.route
                .queryParams
                .subscribe( params  => {
                  this.id = params['item'];
                  this.retrieveNews(this.id);
                });
              }) 
            ).subscribe();
  }

  ngOnInit() {
    this.ionLoader.showLoader();
    this.userInfos = JSON.parse(localStorage.getItem('user'));
    console.log("user", this.userInfos)
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.id = params['item'];
      this.retrieveNews(this.id);
    });
    
  }

  zoomImage(item){
    this.photoService.zoomImage(item);
  }


   message(item){
    this.deja = false;
    this.messageService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      data.forEach((element, index) => {
        if(element.idP==this.id && element.userCreated==this.userInfos.uid){
          this.deja = true;
          this.messageItem  = element;
          //console.log('message', this.messageItem)
         // console.log('message2', this.id)
         // console.log('message3', this.userInfos.uid);
          //console.log('message4', element.userCreated);
        }
      });
      this.createChat(item, this.deja);
    });
   
  }

  async createChat(item, deja){
    console.log(deja);
    console.log("item", this.messageItem);
   if(deja == false){
      let data = {
        name: item.name,
        dateCreated: new Date(),
        dateUptdated: new Date(),
        readsCounter: 1,
        userCreated: JSON.parse(localStorage.getItem('user')).uid,
        cibleUser: item.userCreated,
        idP : this.id,
        users : [
          {
            user : item.userCreated
          },
          {
            user : JSON.parse(localStorage.getItem('user')).uid
          }
        ],
        messages : [],
        visible: true,
        image : item.photoURL[0] || ""
      }
      const { id } = await this.messageService.create(data);

      let datas = {
        item : id,
        type : "Chat",
        descritpion : "Nouveau message de "+JSON.parse(localStorage.getItem('user')).displayName || "User",
        read: false,
        userCreated: JSON.parse(localStorage.getItem('user')).uid,
        cibleUser: item.userCreated,
      }
      this.notificationService.create(datas).then(() => {
        console.log('Created new item successfully!');
        this.getChat(id);
      });
    }
    else{
       this.getChat(this.messageItem.id);
    } 

  }

  userItem(id){
    this.router.navigate(['/user'], { queryParams: {
      item: id,
      }
    });
  }


  async desactivate(item){
    console.log(item)
    this.alertController.create({
      header: 'Publier l\'offre',
     // subHeader: 'Beware lets confirm',
      message: 'Souhaitez-vouspublier cette offre ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          text: 'Désactiver',
          handler: (data) => {
            const datas = {
              visible : false,
            };
            this.offerService.update(this.id, datas)
            .then(() => {
              let datass = {
                status : "",
                descritpion : "Désactivation de votre offre ("+item.name+")",
                type : "Desactivation",
                read: false,
                item: "Désactivation de "+item.name,
                userCreated: this.user.uid,
                cibleUser: item.userCreated,
              }
               this.notificationService.create(datass).then(() => {
                this.presentToast("Offre désactivée avec succès. L' agent concernée a été informé.");
                this.retrieveNews(this.id);
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

  async activate(item){
    console.log(item)
    this.alertController.create({
      header: 'Publier l\'offre',
     // subHeader: 'Beware lets confirm',
      message: 'Souhaitez-vouspublier cette offre ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          text: 'publier',
          handler: (data) => {
            const datas = {
              visible : true,
            };
            this.offerService.update(this.id, datas)
            .then(() => {
              let datass = {
                status : "",
                descritpion : "Publication de votre offre ("+item.name+")",
                type : "publication",
                read: false,
                item: "Publication de "+item.name,
                userCreated: this.user.uid,
                cibleUser: item.userCreated,
              }
               this.notificationService.create(datass).then(() => {
                this.presentToast("Offre publiée avec succès, L' agent concernée a été informé.");
                this.retrieveNews(this.id);
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


  signaler(item){
    this.alertController.create({
      header: 'Signaler une offre',
     // subHeader: 'Beware lets confirm',
      message: 'Souhaitez-vous signaler cette offre ?',
      inputs: [
        {
          name: "raison",
          type : "textarea",
          placeholder : "Veuillez-nous expliquer la raison de votre signalement",
          handler: () => {
            console.log('Let me think');
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
          text: 'Signaler',
          handler: (data) => {
            //data.visible = false;
            //this.updateComment(data);
            let datas = {
              item : item.uid,
              descritpion : data.raison,
              type :  "L'offre "+ item.name +" de "+item.userName+" avec identifiant "+item.userCreated+" a été signalé par l'utilisateur "+JSON.parse(localStorage.getItem('user')).displayName+" avec identifiant "+JSON.parse(localStorage.getItem('user')).uid,
              read: false,
              userCreated: JSON.parse(localStorage.getItem('user')).uid,
              cibleUser: "admin",
            }
            this.notificationService.create(datas).then(() => {
              console.log('Created new item successfully!');
              this.presentToast("Offre signalé avec succès")
            });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }










  getChat(item){
    this.router.navigate(['/messages'], { queryParams: {
      item: item,
      }
    });
  }

  call(item){
    console.log(item);
    console.log(this.user.phone);
    if(this.user.phone==null || this.user.phone==""){
      this.presentToast("Désolé, cet utilisateur n'a pas de numéro de téléphone")
    }
    else{
   // console.log("user is here 2",this.user);
    this.callNumber.callNumber(this.user.phone, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
    }


  }

  async getuser(id){
    await this.authService.getOne(id).then(doc => {
      if (doc.exists) {
        console.log(doc.data());
        this.user = doc.data();
        console.log("user", this.user);
        this.ionLoader.hideLoader();
        this.getFavoris();
        //return this.user;
      } else {
        console.log("There is no document!");
      }
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    });
}

getFavoris(){
  //this.dejass = false;
  this.followerService.getAll(this.userInfos.uid).snapshotChanges().pipe(
    map(changes =>
      changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      )
    )
  ).subscribe(data => {
    data.forEach((element, index) => {
      console.log("Folowers", element);
      if(element.userCreated==this.userInfos.uid && element.userFollowed==this.item.userCreated){
        this.dejass = true;
        this.disFollowerid = element.id;
      }
    });
    console.log("deja vue id 2", this.disFollowerid);
  });

  console.log("deja vue ", this.dejass);
  console.log("deja vue id", this.disFollowerid);
}

disFollower(item){
  this.followerService.delete(this.disFollowerid).then(() => {
    this.presentToast("Vous êtes plus désormais connecté avec cet agent immobilier.")
    this.dejass = false;
  })
}


  follower(item){
    console.log(item);
    this.dejas = false;
    this.followerService.getAll(this.userInfos.uid).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      data.forEach((element, index) => {
        console.log("Folowers", data);
        if(element.userCreated==this.userInfos.uid && element.userFollowed==item){
          this.dejas = true;
         // this.messageItem  = element;
        }
      });
      if(this.dejas==false){
        let data = {
          userCreated : this.userInfos.uid,
          userFollowed : item
        }
        this.followerService.create(data).then(() => {
          this.presentToast("Vous êtes désormais connecté avec cet agent immobilier.")
        });
      }
      else{
        this.presentToast("Vous êtes déjà connecté avec cet agent immobilier.");
      }
    });




/* 

    console.log(item.userCreated)
    let data = {
      userCreated : this.userInfos.uid,
      userFollowed : item.userCreated
    }
    this.followerService.create(data).then(() => {
     // console.log('Created new item successfully!');
      this.presentToast("Vous êtes désormais connecté avec cet agent immobilier.")
    }); */
  }


/*   folowerGo(item, deja){
    this.alertController.create({
      header: 'Abonnement',
     // subHeader: 'Beware lets confirm',
      message: 'Souhaitez-vous affiver les offres correspo ?',
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
            data.visible = false;
            this.updateComment(data);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  } */


  async retrieveNews(id){
    await this.offerService.getOne(id).then(doc => {
      if (doc.exists) {
        console.log(doc.data());
        this.item = doc.data();
        this.getuser(this.item.userCreated);
        
        console.log("new", this.item)
      } else {
        console.log("There is no document!");
      }
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    });
}

commentOn(){
  console.log(this.comment);
  console.log("id", this.id);
  if(this.comment == "" || this.comment == undefined || this.comment.length < 5){
    this.presentToast("Votre commentaire est vide ou trop court");
  }
  else{
    let arry = [];
    arry = this.item.comments;
    const datas = {
      item : this.comment,
      user : JSON.parse(localStorage.getItem('user')).uid,
      userName : JSON.parse(localStorage.getItem('user')).displayName || "User",
      photoURL : JSON.parse(localStorage.getItem('user')).photoURL || "/assets/images/avatar.png",
      createdAt : new Date(),
    };
    arry.push(datas);
    console.log("Mon commentaire", arry)
    const data = {
      comments : arry,
    };
    this.comment = "";
    console.log("Mon commentaire 1", data)
    this.offerService.update(this.id, data)
    
    .then(() => {
      this.presentToast("Commentaire ajouté avec succès");
    })
   
    .catch(err => console.log(err));
  }
}

async presentToast(text) {
  const toast = await this.toastController.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}

editNews() {
  this.alertController.create({
    header: 'Votre commentaire',
   // subHeader: 'Beware lets confirm',
    message: 'Souhaitez-vous modifier votre article ?',
    inputs: [
      {
        name: "name",
        type : "text",
        value: this.item.name,
        handler: () => {
          console.log('I care about humanity');
        }
      },
      {
        name: "description",
        type : "textarea",
        value: this.item.description,
        handler: () => {
          console.log('Let me think');
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
          data.visible = false;
          this.updateComment(data);
        }
      }
    ]
  }).then(res => {
    res.present();
  });
}

updateComment(data){
  this.offerService.update(this.id, data)
  .then(() => {
    this.presentToast("Offre modifié. Elle sera réactivée par un admin dans les plus brefs délais.");
    this.retrieveNews(this.id);
  })
  .catch(err => console.log(err));
}



updateTheComment(item, i) {
  console.log("indice", i)
  console.log("item", item)
  console.log("les items", this.item.comments)
  this.alertController.create({
    header: 'Votre commentaire',
   // subHeader: 'Beware lets confirm',
    message: 'Souhaitez-vous modifier votre commentaire ?',
    inputs: [
      {
        name: "name",
        type : "text",
        value: item.item,
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
          //this.updateComment(data);
          this.item.comments[i].item = data.name;
          const datas = {
            comments : this.item.comments,
          };
          console.log("Nouveau", this.item.comments)
          this.offerService.update(this.id, datas)
          .then(() => {
            this.presentToast("Commentaire ajouté avec succès");
            this.retrieveNews(this.id);
          })
          .catch(err => console.log(err)); 
        }
      }
    ]
  }).then(res => {
    res.present();
  });
}


deleteTheComment(item, i) {
 // console.log("indice", i)
 // console.log("item", item)
 // console.log("les items", this.item.comments)
  this.alertController.create({
    header: 'Suppression de votre commentaire',
   // subHeader: 'Beware lets confirm',
    message: 'Souhaitez-vous supprimer votre commentaire ?',
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
          //this.updateComment(data);
          this.item.comments.splice(i, 1);
          //arr.splice(i, 1);
          const datas = {
            comments : this.item.comments,
          };
          //console.log("Nouveau", this.item.comments)
          this.offerService.update(this.id, datas)
          .then(() => {
            this.presentToast("Commentaire supprimé avec succès");
            this.retrieveNews(this.id);
          })
          .catch(err => console.log(err)); 
        }
      }
    ]
  }).then(res => {
    res.present();
  });
}


}

