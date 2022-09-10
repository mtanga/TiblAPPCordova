import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import {Types} from '../shared/services/models/types';
import { OffercomponentPage } from '../components/offercomponent/offercomponent.page';
import { NewsService } from '../shared/services/data/news.service';
import { LoadingService } from '../shared/services/utils/loading.service';
import { Offer } from '../shared/services/models/offer';
import { map } from 'rxjs/operators';
import { MessagesService } from '../shared/services/utils/messages.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { OfferService } from '../shared/services/data/offer.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: any;

  name_filtered_items: Array<any>;
  public goalList: any[];
  public loadedGoalList: any[];

  constructor(
    private router:Router,
    private popover:PopoverController,
    private offerService: OfferService,
    private ionLoader: LoadingService,
    private socialSharing: SocialSharing,
    private message: MessagesService,
  ) { }


  ngOnInit() {
    this.ionLoader.showLoader();
    this.retrieveNews();
  }

  initializeItems(): void {
    this.offers = this.loadedGoalList;
  }

  filterList(evt) {
    this.initializeItems();
    const searchTerm = evt.srcElement.value;
   // console.log(searchTerm)
    if (!searchTerm) {
      return;
    }
    console.log(searchTerm)
    //this.search = true;
   // console.log(this.search)
    //console.log(this.goalList);
    this.offers = this.goalList.filter(currentGoal => {
      if (currentGoal.name && searchTerm) {
        //console.log(currentGoal.fName)
        if (currentGoal.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          console.log(currentGoal.name)
          return true;
        }
        //console.log(currentGoal.fName)
        return false;
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
      this.offers = data;
      this.goalList = data;
      this.loadedGoalList = data;
      this.ionLoader.hideLoader();
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
