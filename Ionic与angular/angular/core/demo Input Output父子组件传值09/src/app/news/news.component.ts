import { Component, OnInit } from '@angular/core';

import { NewsService } from '../news.service';

import {Http} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/Rx";


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  list:any[];

  private headermsg:string;

  private  msgFromChild:string;
  //products:Observable<any>;

  constructor(private http:Http,private newsservice:NewsService) { }

  ngOnInit() {

    //this.newsservice.requestNewsData()
      this.http.get("http://www.phonegap100.com/appapi.php?a=getPortalList&catid=20&page=1")
      .map(res => res.json()) .subscribe(
         function(data){
           console.log(data);
         }
      );

    this.headermsg='msg from praent';

  }

  getData(){
    alert('从服务中获取数据');


    this.newsservice.requestNewsData().subscribe(function(data){
         console.log(data.result);
        this.list=data.result;
    })

  }
//接收子组件传递过来的数据
  runParent(msg:string){
    alert(msg);
     this.msgFromChild=msg;
  }

}
