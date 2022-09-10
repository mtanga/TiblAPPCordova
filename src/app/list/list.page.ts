import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../shared/services/data/notification.service';
import { ProfileService } from '../shared/services/data/profile.service';
import { LoadingService } from '../shared/services/utils/loading.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  userInfo: string;
  user: any;
  searchValue: string = "";
  search : boolean = false;

  infos: any;


  chatsCollection: AngularFirestoreCollection<any[]>;
  chats: Observable<any>;
  myChats : any = [];

  usersCollection: AngularFirestoreCollection<any[]>;
  users : Observable<any>;
  info : any[];

  age_filtered_items: Array<any>;
  name_filtered_items: Array<any>;
  public goalList: any = [];
  public loadedGoalList: any = [];

  
  constructor(
    public profileService: ProfileService,
    private ionLoader: LoadingService,
    private alertController : AlertController,
    public toastController: ToastController,
    private router : Router,
    public notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.ionLoader.showLoader();
    this.userss();
  }

  userss(): void {
    this.profileService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.infos = data;
      this.goalList = data;
      this.loadedGoalList = data;
      console.log("users", data)
      this.ionLoader.hideLoader();
    });
  }


  initializeItems(): void {
    this.infos = this.loadedGoalList;
  }

  filterList(evt) {
    this.initializeItems();
    const searchTerm = evt.srcElement.value;
   // console.log(searchTerm)
    if (!searchTerm) {
      return;
    }
    console.log(searchTerm)
    this.search = true;
    console.log(this.search)
    //console.log(this.goalList);
    this.infos = this.goalList.filter(currentGoal => {
      if (currentGoal.displayName && searchTerm) {
        //console.log(currentGoal.fName)
        if (currentGoal.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          console.log(currentGoal.displayName)
          return true;
        }
        //console.log(currentGoal.fName)
        return false;
      }
    });
  }

validate(user){
  if(user.status == false){
      this.Activate(user);
  }
  else{
     this.Desactivate(user);
  }
}

userItem(user){
  this.router.navigate(['/user'], { queryParams: {
    item: user.uid,
    }
  });
}

async Desactivate(user){
  this.alertController.create({
    header: 'Désactivation du profil',
   // subHeader: 'Beware lets confirm',
    message: 'Souhaitez-vous Désactiver ce utilisateur ?',
    inputs: [
      {
        name: "prenom",
        type : "text",
        value: user.first_name,
        placeholder: 'Prénom',
        disabled: true,
        handler: () => {
          console.log('I care about humanity');
        }
      },
      {
        name: "nom",
        type : "text",
        placeholder: 'Nom',
        disabled: true,
        value: user.last_name,
        handler: () => {
          console.log('I care about humanity');
        }
      },
      {
        name: "phone",
        type : "number",
        placeholder: 'Téléphone',
        value: user.phone,
        disabled: true,
        handler: () => {
          console.log('I care about humanity');
        }
      },
      {
        name: "address",
        type : "textarea",
        placeholder: 'Adresse',
        disabled: true,
        value: user.address,
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
        text: 'Voir ses offres',
        handler: () => {
          this.userItem(user);
        }
      },
      {
        text: 'Désactiver',
        handler: (data) => {
          const datas = {
            status : false,
          };
          this.profileService.update(user.uid, datas)
          .then(() => {
            let datass = {
              status : "",
              descritpion : "Votre compte a été désactivé",
              type : "Désactivation effectuée",
              read: false,
              item: "Activation",
              userCreated: this.user.uid,
              cibleUser: user.uid,
            }
             this.notificationService.create(datass).then(() => {
              //console.log('Created new item successfully!');
              this.presentToast("Profil activé avec succès");
              //this.getChat(id);
              //localStorage.setItem('user', JSON.stringify(this.user));
              //this.user = JSON.parse(localStorage.getItem('user')!);
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

  async Activate(user){
    this.alertController.create({
      header: 'Activation du profil',
     // subHeader: 'Beware lets confirm',
      message: 'Souhaitez-vous Activer ce utilisateur ?',
      inputs: [
        {
          name: "prenom",
          type : "text",
          value: user.first_name,
          placeholder: 'Prénom',
          disabled: true,
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "nom",
          type : "text",
          placeholder: 'Nom',
          disabled: true,
          value: user.last_name,
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "phone",
          type : "number",
          placeholder: 'Téléphone',
          value: user.phone,
          disabled: true,
          handler: () => {
            console.log('I care about humanity');
          }
        },
        {
          name: "address",
          type : "textarea",
          placeholder: 'Adresse',
          disabled: true,
          value: user.address,
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
          text: 'Voir ses offres',
          handler: () => {
            this.userItem(user);
          }
        },
        {
          text: 'Activer',
          handler: (data) => {
            const datas = {
              status : true,
            };
            this.profileService.update(user.uid, datas)
            .then(() => {
              let datass = {
                status : "",
                descritpion : "Votre compte a été activé",
                type : "Activation effectuée",
                read: false,
                item: "Activation",
                userCreated: this.user.uid,
                cibleUser: user.uid,
              }
               this.notificationService.create(datass).then(() => {
                //console.log('Created new item successfully!');
                this.presentToast("Profil activé avec succès");
                //this.getChat(id);
                //localStorage.setItem('user', JSON.stringify(this.user));
                //this.user = JSON.parse(localStorage.getItem('user')!);
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



    // send messages 
    async presentToast(text) {
      const toast = await this.toastController.create({
        message: text,
        duration: 2000
      });
      toast.present();
    }
}
