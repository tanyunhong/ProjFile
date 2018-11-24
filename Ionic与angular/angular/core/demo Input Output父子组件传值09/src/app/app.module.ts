import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';

import { HttpModule, JsonpModule } from '@angular/http';
// 普通的 HTTP 调用并不需要用到 JsonpModule，
// 不过稍后我们就会演示对 JSONP 的支持， 所以现在就加载它，免得再回来改浪费时间。

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { StorageService } from './storage.service';

import { NewsService } from './news.service';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { NewscontentComponent } from './newscontent/newscontent.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewsComponent,
    NewscontentComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [StorageService,NewsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
