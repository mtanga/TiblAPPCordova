import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, NavController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { AuthService } from '../shared/services/data/auth.service';
import { MessageService } from '../shared/services/data/message.service';
import { NotificationService } from '../shared/services/data/notification.service';
import { LoadingService } from '../shared/services/utils/loading.service';
import { ViewChild } from '@angular/core';


import { IonBackButtonDelegate } from '@ionic/angular';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  messages: any = [];

  name_filtered_items: Array<any>;
  public goalList: any[];
  public loadedGoalList: any[];
  user: any;

  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;



  constructor(
    public authService: AuthService,
    public messageService: MessageService,
    public actionSheetController: ActionSheetController,
    private router : Router,
    private _navController: NavController,
    private alertController : AlertController,
    private platform: Platform,
    public toastController: ToastController,
    public notificationService: NotificationService,
    private ionLoader: LoadingService,
  ) { 

    document.addEventListener('ionBackButton', (ev) => {
      console.log('Handler was called!1');
    })
    this.platform.backButton.subscribeWithPriority(1, () => {
      console.log('Handler was called!');
    });
  }

  ngOnInit() {
    this.ionLoader.showLoader();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getChats();
  }



  getChats(){
    this.messageService.getUserChat(this.user.uid).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.messages = data;
      console.log("message", data)
     // console.log("user", this.user.uid)
      this.goalList = data;
      this.loadedGoalList = data;
      this.ionLoader.hideLoader();
    });
  }




  initializeItems(): void {
    this.messages = this.loadedGoalList;
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
    this.messages = this.goalList.filter(currentGoal => {
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

  getChat(item){
    this.router.navigate(['/messages'], { queryParams: {
      item: item,
      }
    });
  }

}
