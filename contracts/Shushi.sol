// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Shushi is ERC20("Sushi Token", "SUSHI"){

    constructor(){
        _mint(msg.sender, 10**28 );
    }
}

