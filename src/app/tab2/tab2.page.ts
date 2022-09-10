import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { NewcomponentPage } from '../components/newcomponent/newcomponent.page';
import { map } from 'rxjs/operators';
import {Actuality} from '../shared/services/models/actuality';
import { NewsService } from '../shared/services/data/news.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { MessagesService } from '../shared/services/utils/messages.service';
import { LoadingService } from '../shared/services/utils/loading.service';
import { ProfileService } from '../shared/services/data/profile.service';
import { PhotoService } from '../shared/utils/photo.service';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  news?: Actuality[];
  currentActuality?: Actuality;
  currentIndex = -1;
  title = '';

  name_filtered_items: Array<any>;
  public goalList: any[];
  public loadedGoalList: any[];
  userinfos: any;
  
  constructor(
    public router: Router,
    private popover:PopoverController,
    private newService: NewsService,
    private message: MessagesService,
    private socialSharing: SocialSharing,
    private ionLoader: LoadingService,
    public profileService: ProfileService,
    public photoService: PhotoService,
  ) {

    
  }

  zoomImage(item){
    this.photoService.zoomImage(item);
  }


  ngOnInit(): void {
    this.ionLoader.showLoader();
    this.profileService.GetUserItem(JSON.parse(localStorage.getItem('user')).uid)
    .subscribe(data => {
     this.userinfos = data[0];
     console.log("infos", this.userinfos)
     this.retrieveNews();
   });
  }


  initializeItems(): void {
    this.news = this.loadedGoalList;
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
    this.news = this.goalList.filter(currentGoal => {
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

  refreshList(): void {
    this.currentActuality = undefined;
    this.currentIndex = -1;
    this.retrieveNews();
  }

  retrieveNews(): void {
    this.newService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.news = data;
      this.goalList = data;
      this.loadedGoalList = data;
     // console.log("news", data)
      this.ionLoader.hideLoader();
    });
  }


 share(item){
  const data = {
    share : item.share+1,
  };
  this.newService.like(item.id, data)
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



  setActiveTutorial(news: Actuality, index: number): void {
    this.currentActuality = news;
    this.currentIndex = index;
  }



  create(){
    this.popover.create({component:NewcomponentPage,
      showBackdrop:false}).then((popoverElement)=>{
        popoverElement.present();
      })
  }

  newsitem(item){
    this.router.navigate(['/news'], { queryParams: {
      item: item.id
      }
    });
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
    this.newService.like(item.id, data)
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
    this.newService.like(item.id, data)
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
