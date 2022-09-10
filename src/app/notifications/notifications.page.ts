import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NotificationService } from '../shared/services/data/notification.service';
import { LoadingService } from '../shared/services/utils/loading.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notications: any;
  user: any;

  constructor(
    public noticationService: NotificationService,
    private ionLoader: LoadingService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.retrieveNews(JSON.parse(localStorage.getItem('user')).uid);
  }

  offer(item){
    console.log(item);
    this.router.navigate(['/item'], { queryParams: {
      item: item,
      }
    });
  }


  retrieveNews(id): void {
    if(JSON.parse(localStorage.getItem('user')).role=="agent"){
      this.ionLoader.hideLoader();
      this.noticationService.getAll(id).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.notications = data;
        this.ionLoader.hideLoader();
        console.log("notifiactions", data)
      });
    }
    else{
      this.ionLoader.hideLoader();
      this.noticationService.getAdmin().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.notications = data;
        this.ionLoader.hideLoader();
        console.log("notifiactions", data)
      });
    }

  }

}
