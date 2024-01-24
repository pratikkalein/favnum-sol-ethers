// SPDX-License-Identifier: MIT
pragma solidity 0.8.8;

contract FavNum {
    uint favNum;

    function updateFavNum (uint _num) public {
        favNum = _num;
    }

    function retrieve() public view returns (uint) {
        return favNum;
    }
}