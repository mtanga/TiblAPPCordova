import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { PopoverController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { OffercomponentPage } from '../components/offercomponent/offercomponent.page';
import { AuthService } from '../shared/services/data/auth.service';
import { FollowerService } from '../shared/services/data/follower.service';
import { MessageService } from '../shared/services/data/message.service';
import { NotificationService } from '../shared/services/data/notification.service';
import { OfferService } from '../shared/services/data/offer.service';
import { Types } from '../shared/services/models/types';
import { LoadingService } from '../shared/services/utils/loading.service';
import { PhotoService } from '../shared/utils/photo.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  sub: any;
  categories : Types = new Types();
  subCategories : any;
  subitem: any;
  offers: any = [];
  user: any;
  id: any;
  allFollowers: any = [];
  deja: boolean = false;
  userInfos: any;
  messageItem: any;


  constructor(
    private route : ActivatedRoute,
    public followerService : FollowerService,
    private router:Router,
    private socialSharing: SocialSharing,
    private popover:PopoverController,
    private offerService: OfferService,
    private ionLoader: LoadingService,
    public toastController: ToastController,
    public photoService: PhotoService,
    public authService: AuthService,
    public messageService: MessageService,
    public notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.ionLoader.showLoader();
    this.userInfos = JSON.parse(localStorage.getItem('user'));
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
     // console.log(params.type);
      this.id = params.item;
      this.getuser(this.id);
    });
  }

  async getuser(id){
    await this.authService.getOne(id).then(doc => {
      if (doc.exists) {
        console.log(doc.data());
        this.user = doc.data();
        console.log("user2222", this.user);
        console.log("user444", this.user.displayName);
        this.retrieveNews();
      } else {
        console.log("There is no document!");
      }
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    });
}

zoomImage(item){
  this.photoService.zoomImage(item);
}

message(){
  this.deja = false;
  this.messageService.getAll().snapshotChanges().pipe(
    map(changes =>
      changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      )
    )
  ).subscribe(data => {
    data.forEach((element, index) => {
      if(element.idP=="direct" && element.userCreated==this.userInfos.uid && element.cibleUser==this.user.uid){
        this.deja = true;
        this.messageItem  = element;
      }
    });
    this.createChat(this.deja);
  });
 
}

async createChat(deja){
  console.log(deja);
  //console.log("item", this.messageItem);
 if(deja == false){
    let data = {
      name: this.user.displayName || "User",
      dateCreated: new Date(),
      userCreated: JSON.parse(localStorage.getItem('user')).uid,
      cibleUser: this.user.uid,
      idP : this.id,
      messages : [],
      visible: true,
      image : this.user.photoURL[0] || ""
    }
    const { id } = await this.messageService.create(data);
    let datas = {
      item : id,
      type : "Chat",
      descritpion : "Nouveau message de "+JSON.parse(localStorage.getItem('user')).displayName || "User",
      read: false,
      userCreated: JSON.parse(localStorage.getItem('user')).uid,
      cibleUser: this.user.userCreated,
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

getChat(item){
  this.router.navigate(['/messages'], { queryParams: {
    item: item,
    }
  });
}

  userItem(id){
    this.router.navigate(['/user'], { queryParams: {
      item: id,
      }
    });
  }

  category(item){
    this.router.navigate(['/subcategory'], { queryParams: {
      item: item,
      }
    });
  }

  getItem(item){
    console.log("item", item)
    console.log("subitem", this.subitem)
    let al = item.subcategories;
    console.log("arr", al)
    al.forEach(element => {
      if(element.id==this.subitem){
        this.subCategories = element;
        console.log("item2", element)
       // this.getItem(this.subCategories);
       this.retrieveNews();
      }
    });
  }

  retrieveNews(): void {
    this.offerService.getAlls().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log("offres1", data);
      this.offers = [];
      data.forEach(element => {
        if(element.userCreated == this.id){
          this.offers.push(element);
          console.log("offres2", element)
        }
        console.log("offres3", this.offers);
      });
      this.ionLoader.hideLoader();
      this.getFollowers();
      console.log("offres", this.offers);
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

  search(){
    this.router.navigate(['/search']);
  }

  create(){
    this.popover.create({component:OffercomponentPage,
      showBackdrop:false}).then((popoverElement)=>{
        popoverElement.present();
      })
  }


  offer(item){
    this.router.navigate(['/item'], { queryParams: {
      item: item,
      }
    });
  }

  newsitem(item){
    this.router.navigate(['/item'], { queryParams: {
      item: item.id
      }
    });
  }



  share(item){
    const data = {
      shares : item.shares+1,
    };
    this.offerService.like(item.id, data)
    .then(() => {
      console.log("ök")
      this.goToShare(item);
      
    })
    .catch(err => console.log(err));
  }
  
  async goToShare(item){


    let message = item.name;
    let subject = item.descritpion;
    let url = "https://play.google.com/store/apps/details?id=cm.tiblapp.cordo.com" 
    this.socialSharing.share(message, subject, null, url);
  }

  like(item){
    if(this.checkUser(item.likes).trouve==false){
      console.log(item)
      let arry = [];
      arry = item.likes;
      arry.push(JSON.parse(localStorage.getItem('user')).uid);
      const data = {
        likes : arry,
      };
      this.offerService.like(item.id, data)
      .then(() => {
        console.log("ök")
        this.presentToast("Like ajouté avec succès");
        this.retrieveNews();
      })
      .catch(err => console.log(err));
    }
    else{
      let arry = [];
      //arry = item.likes;
      arry.splice(this.checkUser(item.likes).index, 1);
      const data = {
        likes : arry,
      };
      this.offerService.like(item.id, data)
      .then(() => {
        console.log("ök")
        this.presentToast("Like retiré succès");
        this.retrieveNews();
      })
      .catch(err => console.log(err));
    }
  
  }
  
  checkUser(item){
    let retour = {
      lui : "",
      index : 0,
      trouve : false
    };
    if(item.length == 0){
      let retour = {
        lui : "",
        index : 0,
        trouve : false
      };
    }
    else{
      item.forEach((element, index) => {
        if(element==JSON.parse(localStorage.getItem('user')).uid){
          retour = {
            lui : element,
            index : index,
            trouve : true
          };
        }
      });
    }
    return retour;
  
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