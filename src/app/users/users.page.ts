import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { OffercomponentPage } from '../components/offercomponent/offercomponent.page';
import { FollowerService } from '../shared/services/data/follower.service';
import { OfferService } from '../shared/services/data/offer.service';
import { ProfileService } from '../shared/services/data/profile.service';
import { LoadingService } from '../shared/services/utils/loading.service';
import { MessagesService } from '../shared/services/utils/messages.service';
import { PhotoService } from '../shared/utils/photo.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  user: any;
  offers : any = [];

  constructor(
    public followerService : FollowerService,
    public router: Router,
    private offerService: OfferService,
    private popover:PopoverController,
    private socialSharing: SocialSharing,
    private ionLoader: LoadingService,
    private message: MessagesService,
    public profileService: ProfileService,
    public photoService: PhotoService,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.retrieveNews();
  }

  //get all offers
  retrieveNews(): void {
    this.followerService.getAll(this.user.uid).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      console.log("fav", data)
      this.getFavoris(data);
    });
  }


  getFavoris(data){
    this.offers =[];
    data.forEach(element => {
      this.offerService.getAllss(element.userFollowed).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        console.log("oolloo", data);
        data.forEach(element => {
          if(this.containsObject(element, this.offers)==false){
            this.offers.push(element);
          }
           
        });
        console.log("mes foolloo", this.offers);
      });
    });
    this.offers = this.offers.sort((a, b) => a.dateCreated - b.dateCreated);
    console.log("order tab", this.offers);
  }

  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].uid === obj.uid) {
            return true;
        }
    }

    return false;
}

  getuser(id){
    console.log("User setting", this.profileService.getUser(id));
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
