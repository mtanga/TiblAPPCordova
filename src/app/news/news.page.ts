import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Actuality} from '../shared/services/models/actuality';
import { NewsService } from '../shared/services/data/news.service';
import { LoadingService } from '../shared/services/utils/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { MessagesService } from '../shared/services/utils/messages.service';
import { PhotoService } from '../shared/utils/photo.service';


@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  comment : any;
  sub: any;
  item: any = []
  id: any;
  userInfos: any;


  constructor(
    private newService: NewsService,
    public router: Router,
    private route : ActivatedRoute,
    private loadingCtrl: LoadingController,
    public photoService: PhotoService,
    private ionLoader: LoadingService,
    public toastController: ToastController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.ionLoader.showLoader();
    this.userInfos = JSON.parse(localStorage.getItem('user'));
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


  async retrieveNews(id){
    await this.newService.getOne(id).then(doc => {
      if (doc.exists) {
        console.log(doc.data());
        this.item = doc.data();
        this.ionLoader.hideLoader();
        console.log("new", this.item)
      } else {
        console.log("There is no document!");
      }
    }).catch(function (error) {
      console.log("There was an error getting your document:", error);
    });
}

SlideDidChange(){
  
}

commentOn(){
  console.log(this.comment);
/*   if(this.comment == "" || this.comment == undefined){
    this.presentToast("Veuillez rediger votre commentaire avant de publier");
  } */

  if(this.comment == "" || this.comment == undefined || this.comment.length < 5){
    this.presentToast("Votre commentaire est vide ou trop long");
  }

  else{
    let arry = [];
    arry = this.item.comments;
    const datas = {
      item : this.comment,
      user : JSON.parse(localStorage.getItem('user')).uid,
      userName : JSON.parse(localStorage.getItem('user')).displayName || "",
      photoURL : JSON.parse(localStorage.getItem('user')).photoURL || "/assets/images/avatar.png",
      createdAt : new Date(),
    };
    this.comment = "";
    arry.push(datas);
    const data = {
      comments : arry,
    };
    this.newService.update(this.id, data)
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
        type : "text",
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
          this.updateComment(data);
        }
      }
    ]
  }).then(res => {
    res.present();
  });
}

updateComment(data){
  this.newService.update(this.id, data)
  .then(() => {
    this.presentToast("Article modifié");
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
          this.newService.update(this.id, datas)
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
          this.newService.update(this.id, datas)
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
