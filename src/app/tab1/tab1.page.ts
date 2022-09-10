import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import {Types} from '../shared/services/models/types';
import { OffercomponentPage } from '../components/offercomponent/offercomponent.page';
import { LoadingService } from '../shared/services/utils/loading.service';
import { Offer } from '../shared/services/models/offer';
import { map } from 'rxjs/operators';
import { MessagesService } from '../shared/services/utils/messages.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { OfferService } from '../shared/services/data/offer.service';
import { ProfileService } from '../shared/services/data/profile.service';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { PhotoService } from '../shared/utils/photo.service';
import { Subscription, timer } from 'rxjs';


//import {collection, documentId} from 'firebase/firestore'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  categories : Types = new Types();
  offers: any;
  userinfos: any;
  user: any;
  timerSubscription: Subscription; 


  constructor(
    public router: Router,
    private popover:PopoverController,
    private offerService: OfferService,
    private ionLoader: LoadingService,
    private message: MessagesService,
    private socialSharing: SocialSharing,
    public profileService: ProfileService,
    public photoService: PhotoService,
  ) {

                // timer(0, 10000) call the function immediately and every 10 seconds 
                this.timerSubscription = timer(0, 300000).pipe( 
                  map(() => { 
                    this.retrieveNews();
                  }) 
                ).subscribe();
  }


  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getuser(JSON.parse(localStorage.getItem('user')).uid);
    console.log("User ici et là", this.user);
    this.ionLoader.showLoader();
    this.profileService.GetUserItem(JSON.parse(localStorage.getItem('user')).uid)
    .subscribe(data => {
     this.userinfos = data[0];
     console.log("infos", this.userinfos)
     this.retrieveNews();
   });
  }

  getuser(id){
    console.log("User setting", this.profileService.getUser(id));
  }


  zoomImage(item){
    this.photoService.zoomImage(item);
  }


  retrieveNews(): void {
    this.ionLoader.hideLoader();
    this.offerService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.offers = data;
     // this
      this.ionLoader.hideLoader();
      this.getUser();
    });
  }

  
  getUser(){
    this.profileService.GetUserItem(this.user.uid)
    .subscribe(data => {
     this.user = data[0];
     console.log("infos of user", this.userinfos)
   });
  }

  userItem(id){
    this.router.navigate(['/user'], { queryParams: {
      item: id,
      }
    });
  }
  
  category(item){
    this.router.navigate(['/category'], { queryParams: {
      item: item,
      }
    });
  }

  search(){
    this.router.navigate(['/search']);
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

  shorten(text: string, max: number) {
    return text && text.length > max ? text.slice(0,max).split(' ').slice(0, -1).join(' ') + '...' : text
}



  create(){
    this.popover.create({component:OffercomponentPage,
      showBackdrop:false}).then((popoverElement)=>{
        popoverElement.present();
      })
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
        this.message.presentToast("Like ajouté avec succès");
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
        this.message.presentToast("Like retiré succès");
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




}
