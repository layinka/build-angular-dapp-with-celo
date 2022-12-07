// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./NFTAuction.sol";

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

contract NFTAuctionManager {
    
    event AuctionCreated(address indexed creator, uint indexed auctionId, address indexed auctionAddress);
    
    
    uint public auctionCount;

    

    mapping(uint => address) public auctions;

    constructor(
        
    ) {
        
    }

    function createAuction(address _nft,
        uint _nftId,
        uint _startingBid,
        address _seller) external {
        
        auctionCount++;

        address n = address(new NFTAuction(_nft,_nftId,_startingBid,msg.sender, auctionCount) );

        auctions[auctionCount]=n;

        emit AuctionCreated(msg.sender, auctionCount, n);
    }

    

    function getAuctionAddress(uint id) public view returns (address) {
        return auctions[id];
    }

    
}