// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

// this is just a token deployed for testing and Demo purpose
contract shake is ERC20, Ownable, ERC20Permit {
    constructor()
        ERC20("shake", "SHK")
        Ownable(msg.sender)
        ERC20Permit("shake")
    {
        _mint(msg.sender, 10000000000000000000000);
        _mint(
            0xF0F21D6AAc534345E16C2DeE12c3998A4e32e789,
            10000000000000000000000
        );
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}