// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// SushiBar is the coolest bar in town. You come in with some Sushi, and leave with more! The longer you stay, the more Sushi you get.
//
// This contract handles swapping to and from xSushi, SushiSwap's staking token.

contract SushiBar is ERC20("SushiBar", "xSUSHI") {

    using SafeMath for uint256;
    IERC20 public sushi;


    // Mapping of address to amount of XShushi in account
    mapping(address => uint256) public s_addressToLastentered;

    // Define the Sushi token contract
    constructor(IERC20 _sushi){
        sushi = _sushi;
    }

    // Enter the bar. Pay some SUSHIs. Earn some shares.
    // Locks Sushi and mints xSushi
    function enter(uint256 _amount) public {
        // Gets the amount of Sushi locked in the contract
        uint256 totalSushi = sushi.balanceOf(address(this));
        // Gets the amount of xSushi in existence
        uint256 totalShares = totalSupply();

        // If no xSushi exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalSushi == 0) {
            _mint(msg.sender, _amount);
            s_addressToLastentered[msg.sender] = block.timestamp;
        }
        // Calculate and mint the amount of xSushi the Sushi is worth. The ratio will change overtime, as xSushi is burned/minted and Sushi deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalSushi);
            _mint(msg.sender, what);
            s_addressToLastentered[msg.sender] = block.timestamp;
        }
        // Lock the Sushi in the contract
        sushi.transferFrom(msg.sender, address(this), _amount);
    }

    function amountToUnstake(uint256 share, address caller) internal view returns (bool){
        uint256 timediff = block.timestamp - s_addressToLastentered[caller];
        uint256 totalxSushi = balanceOf(caller);
        if(timediff < 2 days){
            return false;
        }
        else if(timediff >= 2 days && timediff < 4 days){
            if(share <= (25 * totalxSushi)/100){
                return true;
            }
        }
        else if(timediff >= 4 days && timediff < 6 days){
            if(share <= (50 * totalxSushi)/100){
                return true;
            }
        }
        else if(timediff >= 6 days && timediff < 8 days){
            if(share <= (75 * totalxSushi)/100){
                return true;
            }
        }
        else{
            return true;
        }
    }

    // Leave the bar. Claim back your SUSHIs.
    // Unlocks the staked + gained Sushi and burns xSushi
    function leave(uint256 _share) public {
        require(amountToUnstake(_share, msg.sender), "Tokens are locked");
        // Gets the amount of xSushi in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of Sushi the xSushi is worth
        uint256 what = _share.mul(sushi.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        sushi.transfer(msg.sender, what);
    }
}
