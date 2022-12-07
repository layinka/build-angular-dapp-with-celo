// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

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

contract NFTAuction {
    event Started();
    event Bidded(address indexed sender, uint amount);
    event Withdrew(address indexed bidder, uint amount);
    event Ended(address winner, uint amount);

    IERC721 public nft;
    uint public nftId;

    address payable public seller;
    uint public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    uint public auctionId;

    constructor(
        address _nft,
        uint _nftId,
        uint _startingBid,
        address _seller,
        uint _auctionId
    ) {
        nft = IERC721(_nft);
        nftId = _nftId;

        seller = payable(_seller); // payable(msg.sender);
        highestBid = _startingBid;
        auctionId=_auctionId;
    }

    function start() external {
        require(!started, "started");
        require(msg.sender == seller, "not seller");

        nft.transferFrom(msg.sender, address(this), nftId);
        started = true;
        endAt = block.timestamp + 7 days;

        emit Started();
    }

    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
        require(msg.value > highestBid, "value < highest");

        // if (highestBidder != address(0)) {
        //     bids[highestBidder] += highestBid;
        // }

        

        highestBidder = msg.sender;
        highestBid = msg.value;

        bids[highestBidder] = highestBid;

        emit Bidded(msg.sender, msg.value);
    }

    function withdraw() external {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);

        emit Withdrew(msg.sender, bal);
    }

    function end() external {
        require(started, "not started");
        require(block.timestamp >= endAt, "not ended");
        require(!ended, "ended");

        ended = true;
        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            seller.transfer(highestBid);
        } else {
            nft.safeTransferFrom(address(this), seller, nftId);
        }

        emit Ended(highestBidder, highestBid);
    }
}