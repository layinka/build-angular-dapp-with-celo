import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { ViewAuctionComponent } from './view-auction/view-auction.component';
import { HttpClientModule } from  '@angular/common/http';
import { AuctionListComponent } from './auction-list/auction-list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'create-auction', component: CreateAuctionComponent },
  { path: 'view-auction/:auctionId', component: ViewAuctionComponent },
  { path: 'list-auction', component: AuctionListComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateAuctionComponent,
    ViewAuctionComponent,
    AuctionListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
