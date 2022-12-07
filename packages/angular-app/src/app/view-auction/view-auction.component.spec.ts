import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuctionComponent } from './view-auction.component';

describe('ViewAuctionComponent', () => {
  let component: ViewAuctionComponent;
  let fixture: ComponentFixture<ViewAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAuctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
