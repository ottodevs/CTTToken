pragma solidity ^0.4.4;

import "./zeppelin/token/StandardToken.sol";


contract CTTToken is StandardToken{
    string public name = "CTTToken";
    string public symbol = "CTT";
    uint public decimals = 18;
    uint public INITIAL_SUPPLY = 10000;

    function SKLToken(){
        totalSupply = INITIAL_SUPPLY;
    }
}
