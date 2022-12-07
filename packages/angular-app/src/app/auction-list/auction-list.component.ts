
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
  selector: 'app-auction-list',
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css']
})
export class AuctionListComponent implements OnInit {

  auctions: undefined|any[];
  account: any;
  ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  nftAuctionManagerContract: any;

  constructor(
    public web3: Web3Service,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location,
    private http: HttpClient) { 

    }

  ngOnInit(): void {

    setTimeout(async ()=>{
      this.account = this.web3.accounts[0];
      this.nftAuctionManagerContract = new this.web3.web3js!.eth.Contract(NFTAuctionManagerABI,environment.nftAuctionManager);  

      const auctionCount = await this.nftAuctionManagerContract.methods.auctionCount().call()
      

      this.auctions=[];
      await Promise.all(
        Array(parseInt( auctionCount))
          .fill(undefined)  
          .map(async (element, index) => {

            
              const auctionAddress = await this.nftAuctionManagerContract.methods.getAuctionAddress(index + 1).call();
      
              const nftAuctionContract = new this.web3.web3js!.eth.Contract(NFTAuctionABI, auctionAddress);

              const auction = await nftAuctionContract.methods.details().call();
              auction.id = index+1;
              // console.log('this.auction: ', this.auction);

              const nftTokenContract = new this.web3.web3js!.eth.Contract(tokenURIABI, auction._nft);

              this.auctions.push(auction);
              try{ 

                (await this.getNFTMetadata(nftTokenContract, auction._nftId) ).subscribe(
                  (response) => {  

                                  
                      auction.nftMetadata = response;
                      console.log(auction.nftMetadata);
                  });

              }catch{
                 
              }
            

            
          })            
      );

      

    }, 3000)

    


  }


  async getNFTMetadata(contract: any, tokenId: any) {
    
    const result = await contract.methods.tokenURI(tokenId).call();
    return this.http.get(result);


  }



  formatToEther(bn){
    return this.web3.web3js!.utils.fromWei(bn , 'ether')
  }

  

}
