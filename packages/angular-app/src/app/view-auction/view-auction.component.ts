import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Web3Service } from '../services/contract/web3.service';
import {Location} from '@angular/common';
import { HttpClient } from '@angular/common/http';
const NFTAuctionManagerABI = require('../../assets/NFTAuctionManager.json');
const NFTAuctionABI = require('../../assets/NFTAuction.json');

const tokenURIABI: any = [
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
          }
      ],
      "name": "tokenURI",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
];

@Component({
  selector: 'app-view-auction',
  templateUrl: './view-auction.component.html',
  styleUrls: ['./view-auction.component.css']
})
export class ViewAuctionComponent implements OnInit {

  auctionId: undefined|any;
  auctionAddress: undefined|any;
  auction: undefined|any;
  nftAuctionManagerContract: undefined|any;
  nftAuctionContract: undefined|any;
  nftTokenContract: any;
  nftMetadata: any;
  mainFormGroup: FormGroup;
  account: any;
  ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

  constructor(
    public web3: Web3Service,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private http: HttpClient) { 

      this.mainFormGroup = this.fb.group({
        bid: [0.01, [Validators.required,Validators.min(0), Validators.max(1000000)]],
      })
    }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.auctionId = params['auctionId'];

      setTimeout(async ()=>{
        this.account = this.web3.accounts[0];
        this.nftAuctionManagerContract = new this.web3.web3js!.eth.Contract(NFTAuctionManagerABI,environment.nftAuctionManager);  
      
        this.auctionAddress = await this.nftAuctionManagerContract.methods.getAuctionAddress(this.auctionId).call();
        
        this.nftAuctionContract = new this.web3.web3js!.eth.Contract(NFTAuctionABI, this.auctionAddress);

        this.auction = await this.nftAuctionContract.methods.details().call();
        console.log('this.auction: ', this.auction);

        this.nftTokenContract = new this.web3.web3js!.eth.Contract(tokenURIABI, this.auction._nft)

        await this.getNFTMetadata(this.nftTokenContract, this.auction._nftId)

      }, 3000)
      


    })

    


  }


  async getNFTMetadata(contract: any, tokenId: any) {
    
    const result = await contract.methods.tokenURI(tokenId).call()

    this.http.get(result).subscribe(
      (response) => { 
        this.nftMetadata  = response; 
        console.log(this.nftMetadata)
      },
      (error) => { console.error(error); });


  }


  async startAuction(){
    try{
      // approve nft for contract
      await this.nftTokenContract.methods
        .approve(this.auctionAddress, this.auction._nftId)
        .send({from: this.web3.accounts![0]})

      // start
      const receipt =  await this.nftAuctionContract.methods
        .start()
        .send({from: this.web3.accounts![0]});
      this.auction._started=true;
    }catch(err){
      console.error(err);
    }
  }

  async endAuction(){
    try{
      
      // start
      const receipt =  await this.nftAuctionContract.methods
        .end()
        .send({from: this.web3.accounts![0]});
      this.auction._ended=true;
    }catch(err){
      console.error(err);
    }
  }

  get f() {
    return this.mainFormGroup.controls;
  }

  async bid(){
    try{
      
      const receipt =  await this.nftAuctionContract.methods
        .bid()
        .send({
          from: this.web3.accounts![0],
          value: this.web3.web3js!.utils.toWei(this.mainFormGroup.get('bid')?.value.toString() , 'ether')
        });
      this.auction._started=true;
      window.location.reload();
    }catch(err){
      console.error(err);
    }
  }

  formatToEther(bn){
    return this.web3.web3js!.utils.fromWei(bn , 'ether')
  }

  

}
