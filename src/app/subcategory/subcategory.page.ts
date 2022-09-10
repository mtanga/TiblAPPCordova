import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { OffercomponentPage } from '../components/offercomponent/offercomponent.page';
import { OfferService } from '../shared/services/data/offer.service';
import { Types } from '../shared/services/models/types';
import { LoadingService } from '../shared/services/utils/loading.service';
import { MessagesService } from '../shared/services/utils/messages.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ProfileService } from '../shared/services/data/profile.service';
import { PhotoService } from '../shared/utils/photo.service';


@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.page.html',
  styleUrls: ['./subcategory.page.scss'],
})
export class SubcategoryPage implements OnInit {
  sub: any;
  categories : Types = new Types();
  subCategories : any;
  subitem: any;
  offers: any = [];
  userinfos: any = [];
  user: any;


  constructor(
    private route : ActivatedRoute,
    private router:Router,
    private popover:PopoverController,
    private offerService: OfferService,
    private ionLoader: LoadingService,
    private socialSharing: SocialSharing,
    private message: MessagesService,
    public profileService: ProfileService,
    public photoService: PhotoService,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.ionLoader.showLoader();
    this.sub = this.route
    .queryParams
    .subscribe(params => {
      // Defaults to 0 if no query param provided.
     // console.log(params.type);
      let id = params.item;
      this.subitem = params.subitem;
      this.getCategories(id);
    });
  }

  shorten(text: string, max: number) {
    return text && text.length > max ? text.slice(0,max).split(' ').slice(0, -1).join(' ') + '...' : text
}

  getCategories(id){
    this.profileService.GetUserItem(JSON.parse(localStorage.getItem('user')).uid)
    .subscribe(data => {
     this.userinfos = data[0];
     this.user = data[0];
     console.log("infos", this.userinfos)


     let all = this.categories.category;
     all.forEach(element => {
       if(element.id==id){
         this.getItem(element);
       }
     });

    // this.retrieveNews();
   });
    //console.log("item", this.subCategories);
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
    this.offerService.getAlllSub(this.subitem).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log("offres1", data);
      this.offers = data;
        this.ionLoader.hideLoader();
/*       data.forEach(element => {
        if(element.subcategory == this.subitem){
          this.offers.push(element);
          console.log("offres2", element)
        }
        console.log("offres3", this.offers);
      });
      this.ionLoader.hideLoader();
      console.log("offres", this.offers); */
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