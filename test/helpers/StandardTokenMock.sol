pragma solidity ^0.4.8;


import '../../contracts/CTTToken.sol';


// mock class using StandardToken
contract StandardTokenMock is CTTToken {

    function StandardTokenMock(address initialAccount, uint initialBalance) {
        balances[initialAccount] = initialBalance;
        totalSupply = initialBalance;
    }

}