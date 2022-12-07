import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from '../services/contract/web3.service';
import Web3 from 'web3';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { environment } from 'src/environments/environment';

const NFTAuctionManagerABI = require('../../assets/NFTAuctionManager.json');

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.css']
})
export class CreateAuctionComponent implements OnInit {
  mainFormGroup: FormGroup;
  submitted = false;
  
  constructor(private fb: FormBuilder,
    private web3: Web3Service,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {
    this.mainFormGroup = this.fb.group({
      nftAddress: ['0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',  [Validators.required]],
      tokenId: ['1',  [Validators.required]],
      startPrice: [0.01, [Validators.required,Validators.min(0), Validators.max(1000000)]],
    })

  }

  async ngOnInit() {

    console.log('provider: ', this.web3.provider)
  }

  get f() {
    return this.mainFormGroup.controls;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.mainFormGroup.valid) {
      
      console.table(this.mainFormGroup.value);
      
      const nftAuctionManagerContract = new this.web3.web3js!.eth.Contract(NFTAuctionManagerABI,environment.nftAuctionManager);

      const startPrice = this.web3.web3js!.utils.toWei(this.mainFormGroup.get('startPrice')?.value.toString() , 'ether')
      
      const receipt =  await nftAuctionManagerContract.methods
        .createAuction(this.mainFormGroup.get('nftAddress')?.value, this.mainFormGroup.get('tokenId')?.value.toString(), startPrice)
        .send({from: this.web3.accounts![0]});

      const newAuctionId = receipt.events.AuctionCreated.returnValues.auctionId;

      this.router.navigate(['/view-auction', newAuctionId]); 



    }
  }

}
