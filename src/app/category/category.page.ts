import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { PopoverController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { OffercomponentPage } from '../components/offercomponent/offercomponent.page';
import { ItemPage } from '../item/item.page';
import { OfferService } from '../shared/services/data/offer.service';
import { ProfileService } from '../shared/services/data/profile.service';
import { Types } from '../shared/services/models/types';
import { LoadingService } from '../shared/services/utils/loading.service';
import { MessagesService } from '../shared/services/utils/messages.service';
import { PhotoService } from '../shared/utils/photo.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  sub: any;
  categories : Types = new Types();
  subCategories : any;
  offers: any;
  id: any;
  user: any = [];
  userinfos: any;

  constructor(
    private route : ActivatedRoute,
    private router:Router,
    private socialSharing: SocialSharing,
    private offerService: OfferService,
    private ionLoader: LoadingService,
    private popover:PopoverController,
    private message: MessagesService,
    public photoService: PhotoService,
    public profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user)
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
     // console.log(params.type);
      let id = params.item;
      this.id = params.item;
      this.getCategories(id);
    });
  }

  shorten(text: string, max: number) {
    return text && text.length > max ? text.slice(0,max).split(' ').slice(0, -1).join(' ') + '...' : text
}

  getCategories(id){
  //  console.log(id);
   // console.log(this.categories.category);
    let all = this.categories.category;
    all.forEach(element => {
      if(element.id==id){
        this.subCategories = element;
        this.retrieveNews(id);
      }
    });
    console.log(this.subCategories);
  }

  category(item){
    this.router.navigate(['/subcategory'], { queryParams: {
      item: this.subCategories.id,
      subitem: item,
      }
    });
  }

  search(){
    this.router.navigate(['/search']);
  }

  retrieveNews(id){
    //this.ionLoader.hideLoader();
    this.offerService.getAllls(id).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.offers = data;
     // this.ionLoader.hideLoader();
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

  zoomImage(item){
    this.photoService.zoomImage(item);
  }

  userItem(id){
    this.router.navigate(['/user'], { queryParams: {
      item: id,
      }
    });
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
        this.retrieveNews(this.id);
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
        this.retrieveNews(this.id);
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
