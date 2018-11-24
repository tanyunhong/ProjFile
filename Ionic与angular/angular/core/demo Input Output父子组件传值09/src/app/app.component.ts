import { Component } from '@angular/core';


import { StorageService } from './storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private service: StorageService) {

    console.log(this.service.getData());
  }


  title = 'app works!';


}
